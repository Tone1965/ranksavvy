import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { location, businessTypes, marketResearch } = await request.json()

    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error('ANTHROPIC_API_KEY not configured')
    }

    const prompt = `As an expert market researcher, analyze the ${location} market and identify 3-5 highly profitable micro-niches for local business opportunities.

For each niche, provide:
- Specific business name/focus
- Detailed description targeting ${location} market
- Competition level (Low/Medium/High)
- Market size (Small/Medium/Large)
- Profit potential (Low/Medium/High)
- Estimated monthly revenue range
- 3-4 specific market insights about ${location}

Focus on these business types: ${businessTypes.join(', ')}

Return a JSON object with this exact structure:
{
  "niches": [
    {
      "id": "unique-slug",
      "name": "Business Name/Focus",
      "description": "Detailed description",
      "competitionLevel": "Low|Medium|High",
      "marketSize": "Small|Medium|Large",
      "profitPotential": "Low|Medium|High",
      "avgMonthlyRevenue": "X000-Y000",
      "insights": ["insight1", "insight2", "insight3", "insight4"]
    }
  ]
}

Only return valid JSON, no other text.`

    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2000,
      messages: [{ role: 'user', content: prompt }]
    })

    const content = response.content[0]?.text
    if (!content) {
      throw new Error('No response from Claude')
    }

    // Parse Claude's response
    const data = JSON.parse(content)
    
    return NextResponse.json(data)

  } catch (error) {
    console.error('Error in micro-niche API:', error)
    
    // NO MOCK DATA - Return actual error to user
    return NextResponse.json(
      { 
        error: 'Failed to get real data from Claude API',
        message: error instanceof Error ? error.message : 'Unknown error',
        details: 'Please check your API key and try again'
      },
      { status: 500 }
    )
  }
}