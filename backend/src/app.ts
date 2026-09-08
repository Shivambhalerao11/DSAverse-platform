import express from "express"
import cors from "cors"
import { env } from "./config/env.js"
import { healthRouter } from "./routes/health.js"
import { usersRouter } from "./routes/users.js"
import { executeRouter } from "./routes/execute.js"

export function createApp() {
  const app = express()

  app.use(cors({ origin: env.corsOrigins }))
  app.use(express.json({ limit: "1mb" }))

  app.use("/api/v1", healthRouter)
  app.use("/api/v1", usersRouter)
  app.use("/api/v1", executeRouter)

  app.use((_req, res) => {
    res.status(404).json({ error: "Not found" })
  })

  return app
}
