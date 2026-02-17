'use client';

import { useState } from 'react';

interface LeadData {
  name: string;
  email: string;
  company: string;
  role: string;
}

interface RoadmapData {
  problem: string;
  targetAudience: string;
  currentSolution: string;
  whyAI: string;
  icp: string;
  whereTheyHangout: string;
  validationEvidence: string[];
  coreValue: string;
  features: { name: string; userStory: string; priority: string }[];
  notBuilding: string;
  llmChoice: string;
  vectorDb: string;
  frontend: string;
  backend: string;
  hosting: string;
  timeline: string;
  northStar: string;
  thirtyDayGoals: string;
}

export default function Home() {
  const [step, setStep] = useState(0);
  const [lead, setLead] = useState<LeadData>({ name: '', email: '', company: '', role: '' });
  const [roadmap, setRoadmap] = useState<RoadmapData>({
    problem: '', targetAudience: '', currentSolution: '', whyAI: '',
    icp: '', whereTheyHangout: '', validationEvidence: [],
    coreValue: '',
    features: [
      { name: '', userStory: '', priority: 'must-have' },
      { name: '', userStory: '', priority: 'must-have' },
      { name: '', userStory: '', priority: 'nice-to-have' },
    ],
    notBuilding: '', llmChoice: '', vectorDb: '', frontend: '', backend: '',
    hosting: '', timeline: '6-weeks', northStar: '', thirtyDayGoals: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const totalSteps = 7;

  const handleLeadSubmit = async () => {
    if (!lead.name || !lead.email || !lead.company) return;
    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lead, timestamp: new Date().toISOString() }),
      });
    } catch (e) { console.error('Failed to save lead:', e); }
    setStep(1);
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lead, roadmap, timestamp: new Date().toISOString(), complete: true }),
      });
      setIsComplete(true);
    } catch (e) { console.error('Failed to save:', e); }
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

  // Completion Screen
  if (isComplete) {
    return (
      <main className="min-h-screen bg-[#0a0a0a] bg-grid flex items-center justify-center p-6">
        <div className="max-w-lg text-center animate-fade-in">
          <div className="w-20 h-20 btn-gradient rounded-full flex items-center justify-center mx-auto mb-8">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Your Roadmap is Ready! 🚀</h1>
          <p className="text-[#a1a1aa] text-lg mb-10 leading-relaxed">
            Want help executing it? We&apos;ve helped 50+ founders ship AI products in 6 weeks.
          </p>
          <a 
            href="https://calendly.com/heemang-1labs/30min"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block btn-gradient px-10 py-4 rounded-full text-lg"
          >
            Book a Free Strategy Call
          </a>
          <p className="text-[#52525b] text-sm mt-8">1labs.ai</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] bg-grid">
      {/* Header */}
      <header className="border-b border-[#27272a] bg-[#0a0a0a]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="https://1labs.ai" className="flex items-center gap-1.5">
            <span className="text-xl font-bold gradient-text">1Labs</span>
            <span className="text-white/90 text-xl font-semibold">.ai</span>
          </a>
          {step > 0 && (
            <div className="flex items-center gap-4">
              <span className="text-[#a1a1aa] text-sm">{step} / {totalSteps - 1}</span>
              <div className="w-28 h-1.5 progress-bar">
                <div className="progress-fill" style={{ width: `${(step / (totalSteps - 1)) * 100}%` }} />
              </div>
            </div>
          )}
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-6 py-16">
        {/* Step 0: Lead Capture */}
        {step === 0 && (
          <div className="text-center animate-fade-in">
            <span className="badge mb-8 inline-block">Free Tool</span>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              AI Product<br />
              <span className="gradient-text">Roadmap</span>
            </h1>
            <p className="text-xl text-[#a1a1aa] mb-12 max-w-md mx-auto leading-relaxed">
              The framework we use to take AI products from idea to MVP in 6 weeks.
            </p>
            
            <div className="card p-8 glow max-w-md mx-auto">
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Your name"
                  value={lead.name}
                  onChange={(e) => setLead({ ...lead, name: e.target.value })}
                  className="input"
                />
                <input
                  type="email"
                  placeholder="Work email"
                  value={lead.email}
                  onChange={(e) => setLead({ ...lead, email: e.target.value })}
                  className="input"
                />
                <input
                  type="text"
                  placeholder="Company name"
                  value={lead.company}
                  onChange={(e) => setLead({ ...lead, company: e.target.value })}
                  className="input"
                />
                <input
                  type="text"
                  placeholder="Your role (optional)"
                  value={lead.role}
                  onChange={(e) => setLead({ ...lead, role: e.target.value })}
                  className="input"
                />
                <button
                  onClick={handleLeadSubmit}
                  disabled={!lead.name || !lead.email || !lead.company}
                  className="w-full btn-gradient py-4 rounded-xl text-base mt-2"
                >
                  Start Building My Roadmap →
                </button>
              </div>
              <p className="text-[#52525b] text-sm mt-6">
                Free forever. No credit card required.
              </p>
            </div>
          </div>
        )}

        {/* Step 1: Product Vision */}
        {step === 1 && (
          <div className="card p-8 animate-fade-in">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 btn-gradient rounded-xl flex items-center justify-center text-xl font-bold">1</div>
              <div>
                <h2 className="text-2xl font-bold text-white">Product Vision & Problem</h2>
                <p className="text-[#a1a1aa]">Define what you&apos;re building and why</p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-white font-medium mb-2">What problem are you solving?</label>
                <textarea
                  value={roadmap.problem}
                  onChange={(e) => setRoadmap({ ...roadmap, problem: e.target.value })}
                  placeholder="Be specific. 'Reduce support tickets by 60% with AI' not 'Help with AI'"
                  className="input h-28 resize-none"
                />
              </div>
              <div>
                <label className="block text-white font-medium mb-2">Who experiences this problem?</label>
                <textarea
                  value={roadmap.targetAudience}
                  onChange={(e) => setRoadmap({ ...roadmap, targetAudience: e.target.value })}
                  placeholder="E.g., E-commerce companies with 10-50 employees, 500+ tickets/month"
                  className="input h-20 resize-none"
                />
              </div>
              <div>
                <label className="block text-white font-medium mb-2">How do they solve it today?</label>
                <textarea
                  value={roadmap.currentSolution}
                  onChange={(e) => setRoadmap({ ...roadmap, currentSolution: e.target.value })}
                  placeholder="Current solutions, workarounds, competitors"
                  className="input h-20 resize-none"
                />
              </div>
              <div>
                <label className="block text-white font-medium mb-2">Why is AI the right approach?</label>
                <textarea
                  value={roadmap.whyAI}
                  onChange={(e) => setRoadmap({ ...roadmap, whyAI: e.target.value })}
                  placeholder="What's your unfair advantage with AI?"
                  className="input h-28 resize-none"
                />
              </div>
              <div className="bg-[#a855f7]/10 border border-[#a855f7]/20 rounded-xl p-4">
                <p className="text-[#c084fc] text-sm">
                  💡 If you can&apos;t explain the problem in one sentence, you don&apos;t understand it well enough.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Target Users */}
        {step === 2 && (
          <div className="card p-8 animate-fade-in">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 btn-gradient rounded-xl flex items-center justify-center text-xl font-bold">2</div>
              <div>
                <h2 className="text-2xl font-bold text-white">Target Users & Validation</h2>
                <p className="text-[#a1a1aa]">Define your ICP and validate demand</p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-white font-medium mb-2">Ideal Customer Profile</label>
                <textarea
                  value={roadmap.icp}
                  onChange={(e) => setRoadmap({ ...roadmap, icp: e.target.value })}
                  placeholder="Industry, company size, role, budget, urgency"
                  className="input h-28 resize-none"
                />
              </div>
              <div>
                <label className="block text-white font-medium mb-2">Where do they hang out?</label>
                <textarea
                  value={roadmap.whereTheyHangout}
                  onChange={(e) => setRoadmap({ ...roadmap, whereTheyHangout: e.target.value })}
                  placeholder="LinkedIn, Slack communities, Twitter, conferences"
                  className="input h-20 resize-none"
                />
              </div>
              <div>
                <label className="block text-white font-medium mb-3">Validation evidence</label>
                <div className="space-y-3">
                  {[
                    { id: 'interviews', label: 'Customer interviews (10+)', desc: 'Talked to potential users' },
                    { id: 'landing', label: 'Landing page signups', desc: 'Collected interested emails' },
                    { id: 'loi', label: 'Letters of intent', desc: 'Commitment to pay' },
                    { id: 'competitors', label: 'Competitor analysis', desc: 'Know the landscape' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => toggleValidation(item.id)}
                      className={`w-full flex items-start gap-4 p-4 rounded-xl border transition-all ${
                        roadmap.validationEvidence.includes(item.id)
                          ? 'bg-[#a855f7]/10 border-[#a855f7]'
                          : 'bg-[#18181b] border-[#27272a] hover:border-[#3f3f46]'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded border-2 flex-shrink-0 mt-0.5 flex items-center justify-center transition-all ${
                        roadmap.validationEvidence.includes(item.id) ? 'bg-[#a855f7] border-[#a855f7]' : 'border-[#52525b]'
                      }`}>
                        {roadmap.validationEvidence.includes(item.id) && (
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <div className="text-left">
                        <p className="text-white font-medium">{item.label}</p>
                        <p className="text-[#71717a] text-sm">{item.desc}</p>
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
          <div className="card p-8 animate-fade-in">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 btn-gradient rounded-xl flex items-center justify-center text-xl font-bold">3</div>
              <div>
                <h2 className="text-2xl font-bold text-white">MVP Scope</h2>
                <p className="text-[#a1a1aa]">Do ONE thing exceptionally well</p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-white font-medium mb-2">Core value (one sentence)</label>
                <input
                  type="text"
                  value={roadmap.coreValue}
                  onChange={(e) => setRoadmap({ ...roadmap, coreValue: e.target.value })}
                  placeholder="The ONE thing your MVP must do perfectly"
                  className="input"
                />
              </div>
              <div>
                <label className="block text-white font-medium mb-3">Key features (max 3)</label>
                <div className="space-y-3">
                  {roadmap.features.map((feature, i) => (
                    <div key={i} className="bg-[#18181b] rounded-xl p-4 border border-[#27272a]">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-[#a855f7] font-bold">{i + 1}.</span>
                        <input
                          type="text"
                          value={feature.name}
                          onChange={(e) => updateFeature(i, 'name', e.target.value)}
                          placeholder="Feature name"
                          className="flex-1 bg-transparent border-none text-white placeholder-[#52525b] focus:outline-none"
                        />
                        <select
                          value={feature.priority}
                          onChange={(e) => updateFeature(i, 'priority', e.target.value)}
                          className="bg-[#27272a] border-none rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none"
                        >
                          <option value="must-have">🔴 Must</option>
                          <option value="nice-to-have">🟡 Nice</option>
                        </select>
                      </div>
                      <input
                        type="text"
                        value={feature.userStory}
                        onChange={(e) => updateFeature(i, 'userStory', e.target.value)}
                        placeholder="As a [user], I want to [action] so that [benefit]"
                        className="w-full bg-transparent border-none text-[#a1a1aa] placeholder-[#52525b] text-sm focus:outline-none"
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-white font-medium mb-2">What are you NOT building?</label>
                <textarea
                  value={roadmap.notBuilding}
                  onChange={(e) => setRoadmap({ ...roadmap, notBuilding: e.target.value })}
                  placeholder="Features you'll say no to (equally important)"
                  className="input h-24 resize-none"
                />
              </div>
              <div className="bg-[#a855f7]/10 border border-[#a855f7]/20 rounded-xl p-4">
                <p className="text-[#c084fc] text-sm">
                  💡 <strong>6-Week Rule:</strong> If you can&apos;t build it in 6 weeks, scope is too big. Cut until it fits.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Tech Stack */}
        {step === 4 && (
          <div className="card p-8 animate-fade-in">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 btn-gradient rounded-xl flex items-center justify-center text-xl font-bold">4</div>
              <div>
                <h2 className="text-2xl font-bold text-white">AI & Tech Stack</h2>
                <p className="text-[#a1a1aa]">Choose for speed, not perfection</p>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { label: 'LLM / AI Model', key: 'llmChoice', options: ['', 'OpenAI GPT-4', 'Anthropic Claude', 'Google Gemini', 'Llama', 'Mistral', 'Other'] },
                { label: 'Vector Database', key: 'vectorDb', options: ['', 'Pinecone', 'Weaviate', 'pgvector', 'Qdrant', 'Chroma', 'Not needed'] },
                { label: 'Frontend', key: 'frontend', options: ['', 'Next.js', 'React', 'Vue', 'Svelte', 'Mobile', 'API only'] },
                { label: 'Backend', key: 'backend', options: ['', 'Python/FastAPI', 'Node.js', 'Go', 'Serverless'] },
                { label: 'Hosting', key: 'hosting', options: ['', 'Vercel', 'AWS', 'GCP', 'Railway', 'Render', 'Fly.io'] },
              ].map((field) => (
                <div key={field.key}>
                  <label className="block text-white font-medium mb-2">{field.label}</label>
                  <select
                    value={roadmap[field.key as keyof RoadmapData] as string}
                    onChange={(e) => setRoadmap({ ...roadmap, [field.key]: e.target.value })}
                    className="input"
                  >
                    {field.options.map((opt) => (
                      <option key={opt} value={opt}>{opt || 'Select...'}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
            <div className="bg-[#a855f7]/10 border border-[#a855f7]/20 rounded-xl p-4 mt-6">
              <p className="text-[#c084fc] text-sm">
                💡 Use managed services everywhere. Build custom only where it&apos;s your core differentiator.
              </p>
            </div>
          </div>
        )}

        {/* Step 5: Timeline */}
        {step === 5 && (
          <div className="card p-8 animate-fade-in">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 btn-gradient rounded-xl flex items-center justify-center text-xl font-bold">5</div>
              <div>
                <h2 className="text-2xl font-bold text-white">6-Week Timeline</h2>
                <p className="text-[#a1a1aa]">Your sprint structure to launch</p>
              </div>
            </div>
            
            <div className="space-y-4">
              {[
                { week: '1', title: 'Discovery & Design', desc: 'Scope, wireframes, architecture', del: 'PRD + Prototypes' },
                { week: '2', title: 'Core AI Pipeline', desc: 'Data ingestion, model integration', del: 'Working AI (CLI/API)' },
                { week: '3', title: 'Frontend + Integration', desc: 'UI, connect to AI, core flows', del: 'Functional prototype' },
                { week: '4', title: 'Feature Complete', desc: 'Remaining features, auth, edge cases', del: 'Complete MVP' },
                { week: '5', title: 'Polish & Test', desc: 'UI polish, bugs, beta testing', del: 'Beta-ready' },
                { week: '6', title: 'Launch 🚀', desc: 'Deploy, monitoring, go-to-market', del: 'LIVE PRODUCT' },
              ].map((item) => (
                <div key={item.week} className="flex gap-4 items-start">
                  <span className="badge px-3 py-1 text-xs flex-shrink-0">W{item.week}</span>
                  <div className="flex-1 bg-[#18181b] rounded-xl p-4 border-l-2 border-[#a855f7]">
                    <h4 className="text-white font-semibold">{item.title}</h4>
                    <p className="text-[#71717a] text-sm">{item.desc}</p>
                    <p className="text-[#a855f7] text-sm mt-1">📦 {item.del}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 6: Success Metrics */}
        {step === 6 && (
          <div className="card p-8 animate-fade-in">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 btn-gradient rounded-xl flex items-center justify-center text-xl font-bold">6</div>
              <div>
                <h2 className="text-2xl font-bold text-white">Success Metrics</h2>
                <p className="text-[#a1a1aa]">Define what winning looks like</p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-white font-medium mb-2">North Star Metric</label>
                <input
                  type="text"
                  value={roadmap.northStar}
                  onChange={(e) => setRoadmap({ ...roadmap, northStar: e.target.value })}
                  placeholder="The ONE number that tells you if you're winning"
                  className="input"
                />
              </div>
              <div>
                <label className="block text-white font-medium mb-2">30-Day Launch Goals</label>
                <textarea
                  value={roadmap.thirtyDayGoals}
                  onChange={(e) => setRoadmap({ ...roadmap, thirtyDayGoals: e.target.value })}
                  placeholder="E.g., 100 signups, 20% retention, 5 paying customers"
                  className="input h-28 resize-none"
                />
              </div>
              <div className="bg-[#a855f7]/10 border border-[#a855f7]/20 rounded-xl p-4">
                <p className="text-[#c084fc] text-sm">
                  💡 <strong>Only 3 metrics matter:</strong> Are they using it? Coming back? Willing to pay?
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        {step > 0 && (
          <div className="flex justify-between mt-10">
            <button
              onClick={() => setStep(step - 1)}
              className="text-[#a1a1aa] hover:text-white transition flex items-center gap-2 px-4 py-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
            
            {step < totalSteps - 1 ? (
              <button onClick={() => setStep(step + 1)} className="btn-gradient px-8 py-3 rounded-xl flex items-center gap-2">
                Continue
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ) : (
              <button
                onClick={handleFinalSubmit}
                disabled={isSubmitting}
                className="btn-gradient px-10 py-3 rounded-xl"
              >
                {isSubmitting ? 'Saving...' : 'Complete Roadmap 🚀'}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="text-center py-8 text-[#52525b] text-sm border-t border-[#18181b]">
        <a href="https://1labs.ai" className="hover:text-[#a1a1aa] transition">
          Built by <span className="gradient-text">1Labs.ai</span> — Ship AI Products 10× Faster
        </a>
      </footer>
    </main>
  );
}
