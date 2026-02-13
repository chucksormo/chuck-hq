import express from 'express'
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { execSync } from 'child_process'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DATA_DIR = join(__dirname, 'data')

const app = express()
app.use(express.json())

function readJSON(file) {
  const path = join(DATA_DIR, file)
  if (!existsSync(path)) return file.endsWith('.json') ? [] : {}
  try {
    return JSON.parse(readFileSync(path, 'utf-8'))
  } catch {
    console.error(`Failed to parse ${file}, returning empty`)
    return file.endsWith('.json') ? [] : {}
  }
}

function writeJSON(file, data) {
  writeFileSync(join(DATA_DIR, file), JSON.stringify(data, null, 2) + '\n')
}

// --- Mission ---
app.get('/api/mission', (_req, res) => {
  res.json(readJSON('mission.json'))
})

app.put('/api/mission', (req, res) => {
  writeJSON('mission.json', req.body)
  res.json(req.body)
})

// --- Generic CRUD for array-based resources ---
function arrayCRUD(route, file) {
  app.get(`/api/${route}`, (_req, res) => {
    res.json(readJSON(file))
  })

  app.post(`/api/${route}`, (req, res) => {
    const items = readJSON(file)
    const item = { ...req.body, id: req.body.id || String(Date.now()) }
    items.push(item)
    writeJSON(file, items)
    res.status(201).json(item)
  })

  app.put(`/api/${route}/:id`, (req, res) => {
    const items = readJSON(file)
    const index = items.findIndex(i => i.id === req.params.id)
    if (index === -1) return res.status(404).json({ error: 'Not found' })
    items[index] = { ...items[index], ...req.body, id: req.params.id }
    writeJSON(file, items)
    res.json(items[index])
  })

  app.delete(`/api/${route}/:id`, (req, res) => {
    let items = readJSON(file)
    const len = items.length
    items = items.filter(i => i.id !== req.params.id)
    if (items.length === len) return res.status(404).json({ error: 'Not found' })
    writeJSON(file, items)
    res.status(204).end()
  })
}

arrayCRUD('ideas', 'ideas.json')
arrayCRUD('projects', 'projects.json')
arrayCRUD('activities', 'activities.json')
arrayCRUD('health', 'health.json')

// --- Weekly Review (single object) ---
app.get('/api/review', (_req, res) => {
  res.json(readJSON('review.json'))
})

app.put('/api/review', (req, res) => {
  writeJSON('review.json', req.body)
  res.json(req.body)
})

// --- Port handling with retry ---
const BASE_PORT = Number(process.env.PORT) || 3001
const MAX_PORT_RETRIES = 5

function killProcessOnPort(port) {
  try {
    const pid = execSync(`lsof -ti tcp:${port}`, { encoding: 'utf-8' }).trim()
    if (pid) {
      console.log(`[Chuck HQ API] Killing stale process ${pid} on port ${port}`)
      execSync(`kill -9 ${pid}`)
      return true
    }
  } catch {
    // No process on port — that's fine
  }
  return false
}

function startServer(port, attempt = 1) {
  const server = app.listen(port, () => {
    console.log(`[Chuck HQ API] Running on http://localhost:${port}`)
  })

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`[Chuck HQ API] Port ${port} in use (attempt ${attempt}/${MAX_PORT_RETRIES})`)

      // First attempt: try to kill the stale process and reuse the same port
      if (attempt === 1 && killProcessOnPort(port)) {
        console.log(`[Chuck HQ API] Retrying port ${port} after cleanup...`)
        setTimeout(() => startServer(port, attempt + 1), 500)
        return
      }

      // Subsequent attempts: try next port
      if (attempt < MAX_PORT_RETRIES) {
        const nextPort = port + 1
        console.log(`[Chuck HQ API] Trying port ${nextPort}...`)
        startServer(nextPort, attempt + 1)
      } else {
        console.error(`[Chuck HQ API] Could not find an available port after ${MAX_PORT_RETRIES} attempts. Exiting.`)
        process.exit(1)
      }
    } else {
      console.error('[Chuck HQ API] Server error:', err)
      process.exit(1)
    }
  })
}

startServer(BASE_PORT)

process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err)
})

process.on('unhandledRejection', (err) => {
  console.error('Unhandled rejection:', err)
})
