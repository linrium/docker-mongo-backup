import express from "express"
import { CronJob } from "cron"
import bodyParser, { json } from "body-parser"
import fs from "fs"
import jwt from "express-jwt"
import jsonwebtoken from "jsonwebtoken"
import { backup } from "./utils"
import { env } from './env'
import log4js from 'log4js'
import day from 'dayjs'

let beingBackup = false

const app = express()
const port = env.port
const privateKey = "baydidautimthayem"
log4js.configure({
  appenders: {
    console: { type: 'console' },
    access: {
      type: 'file',
      filename: 'logs/access.log',
      pattern: '-yyyy-MM-dd',
      category: 'http',
    },
    app: {
      type: 'file',
      filename: 'logs/app.log',
      maxLogSize: 10485760,
      numBackups: 3,
    },
    errorFile: {
      type: 'file',
      filename: 'logs/errors.log',
    },
    errors: {
      type: 'logLevelFilter',
      level: 'ERROR',
      appender: 'errorFile',
    },
  },
  categories: {
    http: { appenders: ['access', 'console'], level: 'DEBUG' },
    default: { appenders: ['app', 'errors', 'console'], level: 'DEBUG' },
  },
})
const log = log4js.getLogger('app')
const http = log4js.getLogger('http')
const cron = new CronJob(
  "0 2 * * *",
  async () => {
    try {
      beingBackup = true
      const today = day().format('DD/MM/YYYY hh[:]mm')
      log.info(`Starting backup at ${today}`)
      const stdout = await backup()
      log.info(stdout)
      log.info(`Backup successfully at ${today}`)
    } catch (e) {
      log.error(e.error)
      log.error(e.stderr)
    } finally {
      beingBackup = false
    }
  },
  () => {
    const today = day().format('DD/MM/YYYY')
    console.log(`Stopped backup at ${today}`)
  },
  false,
  "Europe/Paris",
  null,
  false
)

// app.use(morgan('common'))
app.use(log4js.connectLogger(http, { level: 'info' }))
app.use(bodyParser.json())
app.use(jwt({ secret: privateKey }).unless({ path: ["/token"] }))

app.post("/token", (req, res) => {
  const body = req.body
  if (body?.username === env.adminUsername && body?.password === env.adminPassword) {
    const token = jsonwebtoken.sign({ admin: true }, privateKey, { expiresIn: '5m' })

    res.json({
      token
    })
  } else {
    res.json({
      message: 'username or password wrong'
    })
  }
})

app.get("/start", (req, res) => {
  if (!cron.running) {
    cron.start()
  }

  res.json({
    message: "Started"
  })
})

app.get("/stop", (req, res) => {
  if (cron.running) {
    cron.stop()
  }

  res.json({
    message: "Stopped"
  })
})

app.get("/files", (req, res) => {
  fs.readdir("/Users/linh/Projects/backup-mongo", (err, filenames) => {
    if (err) {
      res.status(400).json({
        message: err
      })
    } else {
      res.json({
        data: filenames
      })
    }
  })
})

app.post("/set-time", (req, res) => {
  const body = req.body
  if (cron) {
    cron.setTime(body.time)
  }

  res.json({
    message: "Set time successfully"
  })
})

app.get("/statistics", (req, res) => {
  res.json({
    lastDate: cron.lastDate,
    running: cron.running,
    nextDates: cron.nextDates,
    beingBackup,
  })
})

app.get('/logs', (req, res) => {
  const filename = req.query.filename ?? 'access'
  fs.readFile(`./logs/${filename}.log`, {encoding: 'utf-8'}, (err, data) => {
    if (err) {
      const msg = err?.message ?? 'something went wrong'
      res.status(400)
      res.send(msg)
    } else {
      res.writeHead(200, {'Content-Type': 'text/html'})
      res.write(data)
      res.end()
    }
  })
})

app.get("/", (req, res) => res.send("Hello world"))

app.use(
  (err: any, req: express.Request, res: express.Response, next: () => void) => {
    if (err.name === "UnauthorizedError") {
      res.status(401).json({
        message: "invalid token"
      })
    }
  }
)

app.listen(port, () => console.log(`App listening on port ${port}`))
