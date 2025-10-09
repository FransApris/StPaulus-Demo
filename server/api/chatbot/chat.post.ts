import { allQuery, runQuery } from '../../database/db'
import OpenAI from 'openai'

const config = useRuntimeConfig()

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: config.openai.apiKey
})

// Helper function to find best matching FAQ using keyword matching
function findBestMatch(userMessage: string, faqs: any[]): string {
  const userWords = userMessage.toLowerCase().split(/\s+/)

  let bestMatch = null
  let bestScore = 0

  for (const faq of faqs) {
    const keywords = faq.keywords ? JSON.parse(faq.keywords) : []
    const questionWords = faq.question.toLowerCase().split(/\s+/)

    const allWords = [...keywords, ...questionWords]
    let score = 0

    for (const userWord of userWords) {
      for (const faqWord of allWords) {
        if (faqWord.includes(userWord) || userWord.includes(faqWord)) {
          score += 1
        }
      }
    }

    if (score > bestScore) {
      bestScore = score
      bestMatch = faq
    }
  }

  if (bestMatch && bestScore > 0) {
    return bestMatch.answer
  }

  return 'Maaf, saya tidak menemukan informasi yang sesuai dengan pertanyaan Anda. Silakan hubungi kantor paroki untuk bantuan lebih lanjut.'
}

// Helper function to update usage count
function updateUsageCount(userMessage: string, faqs: any[]) {
  const userWords = userMessage.toLowerCase().split(/\s+/)

  for (const faq of faqs) {
    const keywords = faq.keywords ? JSON.parse(faq.keywords) : []
    const questionWords = faq.question.toLowerCase().split(/\s+/)

    const hasMatch = [...keywords, ...questionWords].some(word =>
      userWords.some(userWord => word.includes(userWord) || userWord.includes(word))
    )

    if (hasMatch) {
      runQuery('UPDATE chatbot_faqs SET usage_count = usage_count + 1 WHERE id = ?', [faq.id])
      break
    }
  }
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { message } = body

  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Pesan tidak boleh kosong'
    })
  }

  try {
    // Get all active FAQs
    const faqs = allQuery('SELECT * FROM chatbot_faqs WHERE is_active = 1') as any[]

    let response = ''

    // Try OpenAI first if API key is available
    if (config.openai.apiKey) {
      try {
        // Prepare context from FAQs
        const context = faqs.map(faq =>
          `Pertanyaan: ${faq.question}\nJawaban: ${faq.answer}`
        ).join('\n\n')

        // Create system prompt
        const systemPrompt = `Anda adalah asisten AI untuk Gereja St. Paulus Juanda. Anda membantu jemaat dengan informasi tentang:

- Jadwal misa dan liturgi
- Sakramen (baptis, pengakuan dosa, pernikahan, dll.)
- Informasi paroki
- Kegiatan gereja

Gunakan informasi berikut sebagai pengetahuan dasar:

${context}

Jawab dalam bahasa Indonesia dengan ramah dan membantu. Jika pertanyaan tidak terkait dengan gereja atau paroki, arahkan kembali ke topik yang relevan.`

        // Call OpenAI API
        const completion = await openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: message }
          ],
          max_tokens: 500,
          temperature: 0.7
        })

        response = completion.choices[0]?.message?.content || 'Maaf, saya tidak dapat memproses pesan Anda saat ini.'
      } catch (openaiError: any) {
        console.warn('OpenAI API error, falling back to keyword matching:', openaiError.message)
        // Fallback to keyword matching
        response = findBestMatch(message, faqs)
      }
    } else {
      // No API key, use keyword matching
      response = findBestMatch(message, faqs)
    }

    // Try to find and update usage count for relevant FAQ
    updateUsageCount(message, faqs)

    return {
      response,
      timestamp: new Date().toISOString()
    }

  } catch (error) {
    console.error('Chatbot error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Terjadi kesalahan saat memproses pesan'
    })
  }
})
