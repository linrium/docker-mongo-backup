declare module "level" {
  interface ILevel {
    put(key: string, data: any): Promise<undefined>
    get<T = any>(key: string): Promise<T>
  }
  const Level: (
    path: string,
    options?: { valueEncoding: "json" },
    callback?: () => void
  ) => ILevel
  export = Level
}
