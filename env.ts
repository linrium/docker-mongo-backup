import { config } from "dotenv"

config()

const processEnv = process.env as any

export const env: { [key: string]: string } = {
  host: processEnv.DB_HOST,
  username: processEnv.DB_USERNAME,
  password: processEnv.DB_PASSWORD,
  authenticationDatabase: processEnv.AUTH_DB,
  output: processEnv.DB_OUTPUT,
  port: processEnv.PORT,
  adminUsername: processEnv.ADMIN_USERNAME,
  adminPassword: processEnv.ADMIN_PASSWORD,
  slackHook: processEnv.SLACK_HOOK,
  nodeEnv: processEnv.NODE_ENV
}

export const buildEnv = () => {
  return Object.keys(env).reduce((acc, k) => {
    return acc + `${k}="${env[k]}" `
  }, "")
}
