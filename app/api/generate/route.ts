import { NextRequest, NextResponse } from 'next/server';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { productName, problem, targetAudience, coreValue, llmChoice, features } = data;
    
    if (!OPENAI_API_KEY) {
      return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 500 });
    }

    const featuresText = features?.length > 0 
      ? features.map((f: { name: string; priority: string }) => 
          `- ${f.name} (${f.priority === 'must-have' ? 'Must-have' : 'Nice-to-have'})`
        ).join('\n')
      : 'Not specified';

    const prompt = `You are an expert AI product strategist at 1Labs.ai. Generate a detailed, actionable 6-week AI product roadmap.

**Product Details:**
- Product Name: ${productName || 'AI Product'}
- Problem: ${problem || 'Not specified'}
- Target Audience: ${targetAudience || 'Not specified'}
- Core Value: ${coreValue || 'Not specified'}
- Preferred LLM: ${llmChoice || 'Not specified'}
- Key Features:
${featuresText}

Create a comprehensive roadmap with:

# ${productName || 'AI Product'} - 6-Week Roadmap

## Week 1: Discovery & Architecture
- Specific activities for user research and technical planning
- Key deliverables and milestones

## Week 2: AI Pipeline Development
- Core AI/ML implementation tasks
- Data pipeline setup

## Week 3: Backend & API Development
- API development tasks
- Database and infrastructure setup

## Week 4: Frontend Development
- UI/UX implementation
- Integration with backend

## Week 5: Integration & Testing
- End-to-end testing
- Performance optimization

## Week 6: Launch Preparation
- Deployment tasks
- Launch checklist

## Recommended Tech Stack
Based on the requirements, suggest specific technologies for:
- AI/ML: (based on ${llmChoice || 'best fit'})
- Backend
- Frontend
- Infrastructure

## Key Milestones & Success Metrics
- Week-by-week milestones
- Launch success metrics

Make it specific to ${productName || 'this AI product'}, practical, and immediately actionable. Each week should have 3-5 concrete tasks.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an expert AI product strategist. Generate practical, actionable roadmaps for AI product development. Be specific, use the product details provided, and structure the output clearly with markdown formatting.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2500,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('OpenAI API error:', error);
      return NextResponse.json({ error: 'Failed to generate roadmap' }, { status: 500 });
    }

    const result = await response.json();
    const roadmap = result.choices[0]?.message?.content;

    if (!roadmap) {
      return NextResponse.json({ error: 'No roadmap generated' }, { status: 500 });
    }

    return NextResponse.json({ success: true, roadmap });
  } catch (error) {
    console.error('Failed to generate roadmap:', error);
    return NextResponse.json({ error: 'Failed to generate roadmap' }, { status: 500 });
  }
}
