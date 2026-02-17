'use client';

import { useState } from 'react';

interface LeadData {
  name: string;
  email: string;
  company: string;
  role: string;
}

interface RoadmapData {
  // Section 1
  problem: string;
  targetAudience: string;
  currentSolution: string;
  whyAI: string;
  // Section 2
  icp: string;
  whereTheyHangout: string;
  validationEvidence: string[];
  // Section 3
  coreValue: string;
  features: { name: string; userStory: string; priority: string }[];
  notBuilding: string;
  // Section 4
  llmChoice: string;
  vectorDb: string;
  frontend: string;
  backend: string;
  hosting: string;
  // Section 5
  timeline: string;
  // Section 6
  northStar: string;
  thirtyDayGoals: string;
}

export default function Home() {
  const [step, setStep] = useState(0);
  const [lead, setLead] = useState<LeadData>({ name: '', email: '', company: '', role: '' });
  const [roadmap, setRoadmap] = useState<RoadmapData>({
    problem: '',
    targetAudience: '',
    currentSolution: '',
    whyAI: '',
    icp: '',
    whereTheyHangout: '',
    validationEvidence: [],
    coreValue: '',
    features: [
      { name: '', userStory: '', priority: 'must-have' },
      { name: '', userStory: '', priority: 'must-have' },
      { name: '', userStory: '', priority: 'nice-to-have' },
    ],
    notBuilding: '',
    llmChoice: '',
    vectorDb: '',
    frontend: '',
    backend: '',
    hosting: '',
    timeline: '6-weeks',
    northStar: '',
    thirtyDayGoals: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const totalSteps = 7;

  const handleLeadSubmit = async () => {
    if (!lead.name || !lead.email || !lead.company) return;
    
    // Save lead to API
    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lead, timestamp: new Date().toISOString() }),
      });
    } catch (e) {
      console.error('Failed to save lead:', e);
    }
    
    setStep(1);
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          lead, 
          roadmap, 
          timestamp: new Date().toISOString(),
          complete: true 
        }),
      });
      setIsComplete(true);
    } catch (e) {
      console.error('Failed to save:', e);
    }
    setIsSubmitting(false);
  };

  const updateFeature = (index: number, field: string, value: string) => {
    const newFeatures = [...roadmap.features];
    newFeatures[index] = { ...newFeatures[index], [field]: value };
    setRoadmap({ ...roadmap, features: newFeatures });
  };

  const toggleValidation = (item: string) => {
    const current = roadmap.validationEvidence;
    if (current.includes(item)) {
      setRoadmap({ ...roadmap, validationEvidence: current.filter(i => i !== item) });
    } else {
      setRoadmap({ ...roadmap, validationEvidence: [...current, item] });
    }
  };

  if (isComplete) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white flex items-center justify-center p-4">
        <div className="max-w-xl text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-4">Your AI Roadmap is Ready! 🚀</h1>
          <p className="text-gray-400 mb-8">
            We&apos;ve saved your roadmap. Want help executing it? Our team has helped 20+ founders ship AI products in 6 weeks.
          </p>
          <a 
            href="https://calendly.com/heemang-1labs/30min"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-full font-semibold hover:opacity-90 transition"
          >
            Book a Free Strategy Call
          </a>
          <p className="text-gray-500 text-sm mt-6">
            Or email us at hello@1labs.ai
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      {/* Header */}
      <header className="border-b border-gray-700 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
              1Labs
            </span>
            <span className="text-white font-semibold">AI</span>
          </div>
          {step > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-gray-400 text-sm">Step {step} of {totalSteps - 1}</span>
              <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
                  style={{ width: `${(step / (totalSteps - 1)) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Step 0: Lead Capture */}
        {step === 0 && (
          <div className="text-center">
            <div className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-semibold px-4 py-1 rounded-full mb-6">
              FREE TEMPLATE
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              AI Product Roadmap
            </h1>
            <p className="text-xl text-gray-400 mb-8 max-w-xl mx-auto">
              The same framework we use to take AI products from idea to live MVP in 6 weeks
            </p>
            
            <div className="bg-gray-800 rounded-2xl p-8 max-w-md mx-auto">
              <h2 className="text-xl font-semibold text-white mb-6">Get Started</h2>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Your name"
                  value={lead.name}
                  onChange={(e) => setLead({ ...lead, name: e.target.value })}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                />
                <input
                  type="email"
                  placeholder="Work email"
                  value={lead.email}
                  onChange={(e) => setLead({ ...lead, email: e.target.value })}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                />
                <input
                  type="text"
                  placeholder="Company name"
                  value={lead.company}
                  onChange={(e) => setLead({ ...lead, company: e.target.value })}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                />
                <input
                  type="text"
                  placeholder="Your role (optional)"
                  value={lead.role}
                  onChange={(e) => setLead({ ...lead, role: e.target.value })}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                />
                <button
                  onClick={handleLeadSubmit}
                  disabled={!lead.name || !lead.email || !lead.company}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Start Building My Roadmap →
                </button>
              </div>
              <p className="text-gray-500 text-sm mt-4">
                Free forever. No credit card required.
              </p>
            </div>
          </div>
        )}

        {/* Step 1: Product Vision */}
        {step === 1 && (
          <div className="bg-gray-800 rounded-2xl p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-xl font-bold text-white">
                1
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Product Vision & Problem</h2>
                <p className="text-gray-400">Define what you&apos;re building and why it matters</p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-white font-medium mb-2">What problem are you solving?</label>
                <textarea
                  value={roadmap.problem}
                  onChange={(e) => setRoadmap({ ...roadmap, problem: e.target.value })}
                  placeholder="Be specific. 'Help businesses with AI' is too vague. 'Reduce customer support ticket volume by 60% using AI auto-responses' is specific."
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 h-28"
                />
              </div>
              
              <div>
                <label className="block text-white font-medium mb-2">Who experiences this problem?</label>
                <textarea
                  value={roadmap.targetAudience}
                  onChange={(e) => setRoadmap({ ...roadmap, targetAudience: e.target.value })}
                  placeholder="E.g., 'E-commerce companies with 10-50 employees processing 500+ support tickets/month'"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 h-20"
                />
              </div>
              
              <div>
                <label className="block text-white font-medium mb-2">How do they solve it today?</label>
                <textarea
                  value={roadmap.currentSolution}
                  onChange={(e) => setRoadmap({ ...roadmap, currentSolution: e.target.value })}
                  placeholder="Current solutions, workarounds, competitors they use"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 h-20"
                />
              </div>
              
              <div>
                <label className="block text-white font-medium mb-2">Why is your AI approach better?</label>
                <textarea
                  value={roadmap.whyAI}
                  onChange={(e) => setRoadmap({ ...roadmap, whyAI: e.target.value })}
                  placeholder="What makes AI the right solution? What's your unfair advantage?"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 h-28"
                />
              </div>
              
              <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                <p className="text-purple-300 text-sm">
                  💡 <strong>Pro Tip:</strong> If you can&apos;t explain the problem in one sentence, you don&apos;t understand it well enough. Talk to 10 potential customers before writing code.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Target Users & Validation */}
        {step === 2 && (
          <div className="bg-gray-800 rounded-2xl p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-xl font-bold text-white">
                2
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Target Users & Validation</h2>
                <p className="text-gray-400">Define your ICP and validate demand</p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-white font-medium mb-2">Ideal Customer Profile (ICP)</label>
                <textarea
                  value={roadmap.icp}
                  onChange={(e) => setRoadmap({ ...roadmap, icp: e.target.value })}
                  placeholder="Industry, company size, role/title, budget, tech-savviness, urgency of problem"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 h-28"
                />
              </div>
              
              <div>
                <label className="block text-white font-medium mb-2">Where do they hang out?</label>
                <textarea
                  value={roadmap.whereTheyHangout}
                  onChange={(e) => setRoadmap({ ...roadmap, whereTheyHangout: e.target.value })}
                  placeholder="LinkedIn groups, Slack communities, Twitter, conferences, podcasts they follow"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 h-20"
                />
              </div>
              
              <div>
                <label className="block text-white font-medium mb-3">Validation evidence</label>
                <div className="space-y-3">
                  {[
                    { id: 'interviews', label: 'Customer interviews completed', desc: 'Talked to 10+ potential users' },
                    { id: 'landing', label: 'Landing page with signups', desc: 'Collected emails from interested users' },
                    { id: 'loi', label: 'Letter of intent / Pre-orders', desc: 'Someone committed to pay' },
                    { id: 'competitors', label: 'Competitor analysis done', desc: 'Know who you\'re competing with' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => toggleValidation(item.id)}
                      className={`w-full flex items-start gap-3 p-4 rounded-lg border transition ${
                        roadmap.validationEvidence.includes(item.id)
                          ? 'bg-purple-500/20 border-purple-500'
                          : 'bg-gray-700 border-gray-600 hover:border-gray-500'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded border-2 flex-shrink-0 mt-0.5 flex items-center justify-center ${
                        roadmap.validationEvidence.includes(item.id)
                          ? 'bg-purple-500 border-purple-500'
                          : 'border-gray-400'
                      }`}>
                        {roadmap.validationEvidence.includes(item.id) && (
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <div className="text-left">
                        <p className="text-white font-medium">{item.label}</p>
                        <p className="text-gray-400 text-sm">{item.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: MVP Scope */}
        {step === 3 && (
          <div className="bg-gray-800 rounded-2xl p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-xl font-bold text-white">
                3
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">MVP Scope Definition</h2>
                <p className="text-gray-400">Ruthlessly cut scope. Do ONE thing well.</p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-white font-medium mb-2">Core value proposition (one sentence)</label>
                <input
                  type="text"
                  value={roadmap.coreValue}
                  onChange={(e) => setRoadmap({ ...roadmap, coreValue: e.target.value })}
                  placeholder="What's the ONE thing your MVP must do perfectly?"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                />
              </div>
              
              <div>
                <label className="block text-white font-medium mb-3">Must-have features (max 3-5)</label>
                <div className="space-y-3">
                  {roadmap.features.map((feature, i) => (
                    <div key={i} className="bg-gray-700 rounded-lg p-4">
                      <div className="flex gap-3">
                        <span className="text-purple-400 font-bold">{i + 1}.</span>
                        <div className="flex-1 space-y-2">
                          <input
                            type="text"
                            value={feature.name}
                            onChange={(e) => updateFeature(i, 'name', e.target.value)}
                            placeholder="Feature name"
                            className="w-full bg-gray-600 border border-gray-500 rounded px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 text-sm"
                          />
                          <input
                            type="text"
                            value={feature.userStory}
                            onChange={(e) => updateFeature(i, 'userStory', e.target.value)}
                            placeholder="As a [user], I want to [action] so that [benefit]"
                            className="w-full bg-gray-600 border border-gray-500 rounded px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 text-sm"
                          />
                          <select
                            value={feature.priority}
                            onChange={(e) => updateFeature(i, 'priority', e.target.value)}
                            className="bg-gray-600 border border-gray-500 rounded px-3 py-2 text-white focus:outline-none focus:border-purple-500 text-sm"
                          >
                            <option value="must-have">🔴 Must have</option>
                            <option value="nice-to-have">🟡 Nice to have</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-white font-medium mb-2">What are you NOT building in v1?</label>
                <textarea
                  value={roadmap.notBuilding}
                  onChange={(e) => setRoadmap({ ...roadmap, notBuilding: e.target.value })}
                  placeholder="List features you'll say 'no' to. This is as important as what you'll build."
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 h-28"
                />
              </div>
              
              <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                <p className="text-purple-300 text-sm">
                  💡 <strong>The 6-Week Rule:</strong> If you can&apos;t build your MVP in 6 weeks, your scope is too big. Cut features until it fits.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Tech Stack */}
        {step === 4 && (
          <div className="bg-gray-800 rounded-2xl p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-xl font-bold text-white">
                4
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">AI & Tech Stack</h2>
                <p className="text-gray-400">Choose technologies that let you move fast</p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white font-medium mb-2">LLM / Language Model</label>
                  <select
                    value={roadmap.llmChoice}
                    onChange={(e) => setRoadmap({ ...roadmap, llmChoice: e.target.value })}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="">Select...</option>
                    <option value="openai">OpenAI (GPT-4)</option>
                    <option value="anthropic">Anthropic (Claude)</option>
                    <option value="google">Google (Gemini)</option>
                    <option value="llama">Meta (Llama)</option>
                    <option value="mistral">Mistral</option>
                    <option value="other">Other / Custom</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-white font-medium mb-2">Vector Database</label>
                  <select
                    value={roadmap.vectorDb}
                    onChange={(e) => setRoadmap({ ...roadmap, vectorDb: e.target.value })}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="">Select...</option>
                    <option value="pinecone">Pinecone</option>
                    <option value="weaviate">Weaviate</option>
                    <option value="pgvector">pgvector</option>
                    <option value="qdrant">Qdrant</option>
                    <option value="chroma">Chroma</option>
                    <option value="none">Not needed</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-white font-medium mb-2">Frontend</label>
                  <select
                    value={roadmap.frontend}
                    onChange={(e) => setRoadmap({ ...roadmap, frontend: e.target.value })}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="">Select...</option>
                    <option value="nextjs">Next.js</option>
                    <option value="react">React</option>
                    <option value="vue">Vue</option>
                    <option value="svelte">Svelte</option>
                    <option value="mobile">Mobile (React Native / Flutter)</option>
                    <option value="none">API only / No UI</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-white font-medium mb-2">Backend</label>
                  <select
                    value={roadmap.backend}
                    onChange={(e) => setRoadmap({ ...roadmap, backend: e.target.value })}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="">Select...</option>
                    <option value="python">Python (FastAPI / Django)</option>
                    <option value="node">Node.js (Express / Fastify)</option>
                    <option value="go">Go</option>
                    <option value="serverless">Serverless Functions</option>
                  </select>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-white font-medium mb-2">Hosting / Infrastructure</label>
                  <select
                    value={roadmap.hosting}
                    onChange={(e) => setRoadmap({ ...roadmap, hosting: e.target.value })}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="">Select...</option>
                    <option value="vercel">Vercel</option>
                    <option value="aws">AWS</option>
                    <option value="gcp">Google Cloud</option>
                    <option value="railway">Railway</option>
                    <option value="render">Render</option>
                    <option value="fly">Fly.io</option>
                  </select>
                </div>
              </div>
              
              <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                <p className="text-purple-300 text-sm">
                  💡 <strong>Speed Over Perfection:</strong> For MVP, use managed services everywhere. Build custom only where it&apos;s your core differentiator.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Timeline */}
        {step === 5 && (
          <div className="bg-gray-800 rounded-2xl p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-xl font-bold text-white">
                5
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">6-Week MVP Timeline</h2>
                <p className="text-gray-400">Your sprint structure to launch</p>
              </div>
            </div>
            
            <div className="space-y-4">
              {[
                { week: 'Week 1', title: 'Discovery & Design', desc: 'Finalize scope, wireframes, set up dev environment', deliverables: 'PRD, wireframes, tech architecture' },
                { week: 'Week 2', title: 'Core AI Pipeline', desc: 'Build AI backbone — data ingestion, model integration', deliverables: 'Working AI pipeline (CLI or API)' },
                { week: 'Week 3', title: 'Frontend & Integration', desc: 'Build UI, connect to AI backend, core user flows', deliverables: 'Functional prototype' },
                { week: 'Week 4', title: 'Feature Completion', desc: 'Complete remaining features, add auth, edge cases', deliverables: 'Feature-complete MVP' },
                { week: 'Week 5', title: 'Polish & Testing', desc: 'UI polish, bug fixes, user testing with beta users', deliverables: 'Beta-ready product' },
                { week: 'Week 6', title: 'Launch', desc: 'Final fixes, deploy to production, launch marketing', deliverables: 'LIVE PRODUCT 🚀' },
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <span className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                      {item.week}
                    </span>
                  </div>
                  <div className="flex-1 bg-gray-700 rounded-lg p-4 border-l-4 border-purple-500">
                    <h4 className="text-white font-semibold">{item.title}</h4>
                    <p className="text-gray-400 text-sm mt-1">{item.desc}</p>
                    <p className="text-purple-400 text-sm mt-2">📦 {item.deliverables}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 6: Success Metrics */}
        {step === 6 && (
          <div className="bg-gray-800 rounded-2xl p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-xl font-bold text-white">
                6
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Success Metrics</h2>
                <p className="text-gray-400">Define what success looks like</p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-white font-medium mb-2">Primary Success Metric (North Star)</label>
                <input
                  type="text"
                  value={roadmap.northStar}
                  onChange={(e) => setRoadmap({ ...roadmap, northStar: e.target.value })}
                  placeholder="The ONE number that tells you if you're winning. E.g., 'Weekly active users' or 'Revenue'"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                />
              </div>
              
              <div>
                <label className="block text-white font-medium mb-2">30-Day Launch Goals</label>
                <textarea
                  value={roadmap.thirtyDayGoals}
                  onChange={(e) => setRoadmap({ ...roadmap, thirtyDayGoals: e.target.value })}
                  placeholder="E.g., 100 signups, 20% week-1 retention, 5 paying customers, NPS > 40"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 h-28"
                />
              </div>
              
              <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                <p className="text-purple-300 text-sm">
                  💡 <strong>The Only Metrics That Matter:</strong> 1) Are people using it? (Engagement) 2) Are they coming back? (Retention) 3) Will they pay? (Revenue intent)
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        {step > 0 && (
          <div className="flex justify-between mt-8">
            <button
              onClick={() => setStep(step - 1)}
              className="text-gray-400 hover:text-white transition flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
            
            {step < totalSteps - 1 ? (
              <button
                onClick={() => setStep(step + 1)}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition flex items-center gap-2"
              >
                Continue
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ) : (
              <button
                onClick={handleFinalSubmit}
                disabled={isSubmitting}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50"
              >
                {isSubmitting ? 'Saving...' : 'Complete My Roadmap 🚀'}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="text-center py-8 text-gray-500 text-sm">
        <p>Built by <span className="text-purple-400">1Labs AI</span> — Ship AI Products 10× Faster</p>
      </footer>
    </main>
  );
}
