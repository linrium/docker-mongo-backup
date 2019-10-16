import { exec } from "child_process"
import moment from "moment"
import { buildEnv } from "./env"

export const backup = (): Promise<{ diff: number; stdout: string }> =>
  new Promise((resolve, reject) => {
    const start = moment()
    const cmd = buildEnv() + "sh ./scripts/backup.sh"

    exec(cmd, (error, stdout, stderr) => {
      const diff = moment.duration(moment().diff(start)).asSeconds()

      if (error) {
        reject({
          diff,
          error,
          stderr
        })
      }

      resolve({
        diff,
        stdout
      })
    })
  })
