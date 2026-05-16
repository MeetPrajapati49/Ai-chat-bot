const Groq = require('groq-sdk')

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

module.exports = async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { messages, fileContent, fileType } = req.body

    let groqMessages = [...messages]

    if (fileContent) {
      if (fileType === 'application/pdf') {
        const lastMsg = groqMessages[groqMessages.length - 1]
        groqMessages[groqMessages.length - 1] = {
          role: 'user',
          content: `${lastMsg.content}\n\nDocument content:\n${fileContent}`
        }
      } else if (fileType && fileType.startsWith('image/')) {
        groqMessages[groqMessages.length - 1] = {
          role: 'user',
          content: [
            { type: 'text', text: messages[messages.length - 1].content },
            { type: 'image_url', image_url: { url: `data:${fileType};base64,${fileContent}` } }
          ]
        }
      }
    }

    const model = fileType && fileType.startsWith('image/')
      ? 'meta-llama/llama-4-scout-17b-16e-instruct'
      : 'llama-3.3-70b-versatile'

    const response = await groq.chat.completions.create({ model, messages: groqMessages })

    res.status(200).json({ message: response.choices[0].message.content })
  } catch (error) {
    console.error('Groq error:', error)
    res.status(500).json({ error: 'Something went wrong' })
  }
}
