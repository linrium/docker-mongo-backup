import { exec } from "child_process"
import moment from "moment"

export const backup = (): Promise<{ diff: number; stdout: string }> =>
  new Promise((resolve, reject) => {
    const start = moment()
    const cmd = "sh ./scripts/backup.sh"

    exec(cmd, (error, stdout, stderr) => {
      console.log(error, stdout, stderr)
      const diff = moment.duration(moment().diff(start)).asSeconds()

      if (error) {
        console.log(error)
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
