import express from 'express'
import { readFileSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DATA_DIR = join(__dirname, 'data')

const app = express()
app.use(express.json())

function readJSON(file) {
  return JSON.parse(readFileSync(join(DATA_DIR, file), 'utf-8'))
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

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`)
})
