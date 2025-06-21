import express from 'express'
import fs from 'fs'
import path from 'path'
import cors from 'cors'
import { fileURLToPath } from 'url'

// Recreate __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = 4000

// Middleware
app.use(express.json())
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['POST'],
}))

// Change this to your actual docs path
const DOCUSAURUS_DOCS_PATH = path.join(__dirname, '../docs')

app.post('/save', (req, res) => {
    const { markdownContent, fileName } = req.body

    if (!markdownContent || !fileName) {
        return res.status(400).json({ error: 'Missing markdownContent or fileName' })
    }

    // Sanitize filename
    const safeFileName = fileName.replace(/[^a-zA-Z0-9-_]/g, '') + '.md'
    const filePath = path.join(DOCUSAURUS_DOCS_PATH, safeFileName)

    // Optional: Add title header
    const fullContent = `# ${fileName}\n\n${markdownContent}`

    fs.writeFile(filePath, fullContent, 'utf8', (err) => {
        if (err) {
            console.error('Error saving file:', err)
            return res.status(500).json({ error: 'Failed to save file' })
        }

        console.log('File saved at:', filePath)
        res.json({ success: true, filePath })
    })
})

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server listening at http://localhost:${PORT}`)
})
