import { exec } from "child_process"
import { buildEnv } from "./env"

export const backup = () =>
  new Promise((resolve, reject) => {
    const cmd = buildEnv() + "sh ./scripts/backup.sh"

    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        reject({
          error,
          stderr
        })
      }

      resolve(stdout)
    })
  })
