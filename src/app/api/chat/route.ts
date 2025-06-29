import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { message, context } = await request.json()

    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error('ANTHROPIC_API_KEY not configured')
    }

    const systemPrompt = `You are the RankSavvy AI Assistant, helping users dominate the Birmingham, Alabama market. You have access to the user's current project context and can help them:

1. Understand their project status
2. Get insights about Birmingham markets
3. Navigate the RankSavvy system
4. Optimize their business strategy
5. Answer questions about their selected niche, domain, and campaigns

Current Project Context:
- Phase: ${context.systemInfo.phase}
- Selected Niche: ${context.systemInfo.selectedNiche}
- Domain: ${context.systemInfo.domain}
- Active Agents: ${context.systemInfo.activeAgents.join(', ') || 'None'}

Project Data Available: ${JSON.stringify(context.currentProject, null, 2)}

Be helpful, specific to Birmingham, and actionable. If asked about system features, explain what RankSavvy can do.`

    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1000,
      system: systemPrompt,
      messages: [{ role: 'user', content: message }]
    })

    const content = response.content[0]?.text
    if (!content) {
      throw new Error('No response from Claude')
    }

    return NextResponse.json({ message: content })

  } catch (error) {
    console.error('Chat API error:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to get response from Claude',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}