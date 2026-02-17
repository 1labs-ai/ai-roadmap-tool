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
    hosting: '', northStar: '', thirtyDayGoals: '',
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
      <main className="min-h-screen bg-white flex items-center justify-center p-6">
        <div className="max-w-lg text-center">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl" style={{ background: 'linear-gradient(135deg, #A855F7, #EC4899)' }}>
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-4xl font-medium text-gray-900 mb-4 tracking-tight">Your Roadmap is Ready! 🚀</h1>
          <p className="text-lg text-gray-500 mb-10 leading-relaxed">
            Want help executing it? We&apos;ve helped 50+ founders ship AI products in 6 weeks.
          </p>
          <a 
            href="https://calendly.com/heemang-1labs/30min"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-gray-900 text-white px-10 py-4 rounded-full font-medium hover:bg-black transition-all shadow-lg"
          >
            Book a Free Strategy Call →
          </a>
          <p className="text-gray-400 text-sm mt-8">
            <a href="https://1labs.ai" className="hover:text-purple-600 transition">1labs.ai</a>
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Background Gradient */}
      <div className="fixed inset-0 -z-10 pointer-events-none" style={{ background: 'linear-gradient(to bottom, #ffffff, #faf5ff 50%, #ffffff)' }} />
      
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <a href="https://1labs.ai" className="flex items-center gap-2 bg-white/80 backdrop-blur-xl border border-gray-200 px-4 py-2 rounded-full shadow-sm hover:shadow-md transition-shadow">
            <svg width="28" height="28" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#7C3AED"/>
                  <stop offset="40%" stopColor="#EC4899"/>
                  <stop offset="100%" stopColor="#FDF2F8"/>
                </linearGradient>
              </defs>
              <rect width="80" height="80" rx="18" fill="#0A0A0A"/>
              <g transform="translate(10, 13)">
                <path d="M2 27 C2 12, 15 12, 30 27 C45 42, 58 42, 58 27 C58 12, 45 12, 30 27 C15 42, 2 42, 2 27 Z" fill="none" stroke="url(#logoGrad)" strokeWidth="5" strokeLinecap="round"/>
                <rect x="26" y="0" width="8" height="54" rx="4" fill="url(#logoGrad)"/>
              </g>
            </svg>
            <span className="font-semibold text-base">
              <span style={{ background: 'linear-gradient(90deg, #7C3AED, #EC4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>1</span>
              <span className="text-gray-900">Labs</span>
              <span className="text-pink-500">.ai</span>
            </span>
          </a>
          
          {step > 0 && (
            <div className="bg-white/80 backdrop-blur-xl border border-gray-200 px-4 py-2 rounded-full shadow-sm flex items-center gap-3">
              <span className="text-gray-500 text-sm font-medium">{step} / {totalSteps - 1}</span>
              <div className="w-20 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all" style={{ width: `${(step / (totalSteps - 1)) * 100}%`, background: 'linear-gradient(90deg, #A855F7, #EC4899)' }} />
              </div>
            </div>
          )}
        </div>
      </header>

      <div className="max-w-xl mx-auto px-6 pt-28 pb-20">
        {/* Step 0: Lead Capture */}
        {step === 0 && (
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-xl border border-gray-200 px-4 py-2 rounded-full shadow-sm mb-8">
              <span className="text-gray-500 text-xs font-medium">Free Tool from</span>
              <span className="text-xs font-bold" style={{ background: 'linear-gradient(90deg, #A855F7, #EC4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>ProductOS</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-medium text-gray-900 mb-4 tracking-tight leading-tight">
              AI Product<br />
              <span style={{ background: 'linear-gradient(90deg, #A855F7, #EC4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Roadmap</span>
            </h1>
            <p className="text-xl text-gray-500 mb-10 max-w-md mx-auto leading-relaxed">
              The framework we use to take AI products from idea to MVP in 6 weeks.
            </p>
            
            {/* Form Card */}
            <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-xl shadow-purple-500/5 text-left">
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Your name"
                  value={lead.name}
                  onChange={(e) => setLead({ ...lead, name: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all"
                />
                <input
                  type="email"
                  placeholder="Work email"
                  value={lead.email}
                  onChange={(e) => setLead({ ...lead, email: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all"
                />
                <input
                  type="text"
                  placeholder="Company name"
                  value={lead.company}
                  onChange={(e) => setLead({ ...lead, company: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all"
                />
                <input
                  type="text"
                  placeholder="Your role (optional)"
                  value={lead.role}
                  onChange={(e) => setLead({ ...lead, role: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all"
                />
                <button
                  onClick={handleLeadSubmit}
                  disabled={!lead.name || !lead.email || !lead.company}
                  className="w-full py-4 rounded-xl text-white font-medium flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
                  style={{ background: 'linear-gradient(90deg, #A855F7, #EC4899)' }}
                >
                  Start Building My Roadmap
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              </div>
              <p className="text-gray-400 text-sm mt-6 text-center">
                Free forever. No credit card required.
              </p>
            </div>
          </div>
        )}

        {/* Step 1-6: Form Steps */}
        {step >= 1 && step <= 6 && (
          <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-xl shadow-purple-500/5">
            {/* Step Header */}
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-bold text-white shadow-lg" style={{ background: 'linear-gradient(135deg, #A855F7, #EC4899)' }}>
                {step}
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 tracking-tight">
                  {step === 1 && 'Product Vision & Problem'}
                  {step === 2 && 'Target Users & Validation'}
                  {step === 3 && 'MVP Scope'}
                  {step === 4 && 'AI & Tech Stack'}
                  {step === 5 && '6-Week Timeline'}
                  {step === 6 && 'Success Metrics'}
                </h2>
                <p className="text-gray-500">
                  {step === 1 && "Define what you're building and why"}
                  {step === 2 && 'Define your ICP and validate demand'}
                  {step === 3 && 'Do ONE thing exceptionally well'}
                  {step === 4 && 'Choose for speed, not perfection'}
                  {step === 5 && 'Your sprint structure to launch'}
                  {step === 6 && 'Define what winning looks like'}
                </p>
              </div>
            </div>

            {/* Step 1 Content */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-gray-900 font-medium mb-2">What problem are you solving?</label>
                  <textarea value={roadmap.problem} onChange={(e) => setRoadmap({ ...roadmap, problem: e.target.value })} placeholder="Be specific. 'Reduce support tickets by 60% with AI' not 'Help with AI'" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-purple-400 h-28 resize-none" />
                </div>
                <div>
                  <label className="block text-gray-900 font-medium mb-2">Who experiences this problem?</label>
                  <textarea value={roadmap.targetAudience} onChange={(e) => setRoadmap({ ...roadmap, targetAudience: e.target.value })} placeholder="E.g., E-commerce companies with 10-50 employees" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-purple-400 h-20 resize-none" />
                </div>
                <div>
                  <label className="block text-gray-900 font-medium mb-2">How do they solve it today?</label>
                  <textarea value={roadmap.currentSolution} onChange={(e) => setRoadmap({ ...roadmap, currentSolution: e.target.value })} placeholder="Current solutions, workarounds, competitors" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-purple-400 h-20 resize-none" />
                </div>
                <div>
                  <label className="block text-gray-900 font-medium mb-2">Why is AI the right approach?</label>
                  <textarea value={roadmap.whyAI} onChange={(e) => setRoadmap({ ...roadmap, whyAI: e.target.value })} placeholder="What's your unfair advantage with AI?" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-purple-400 h-28 resize-none" />
                </div>
                <div className="bg-purple-50 border border-purple-100 rounded-xl p-4">
                  <p className="text-purple-700 text-sm">💡 If you can&apos;t explain the problem in one sentence, you don&apos;t understand it well enough.</p>
                </div>
              </div>
            )}

            {/* Step 2 Content */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-gray-900 font-medium mb-2">Ideal Customer Profile</label>
                  <textarea value={roadmap.icp} onChange={(e) => setRoadmap({ ...roadmap, icp: e.target.value })} placeholder="Industry, company size, role, budget, urgency" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-purple-400 h-28 resize-none" />
                </div>
                <div>
                  <label className="block text-gray-900 font-medium mb-2">Where do they hang out?</label>
                  <textarea value={roadmap.whereTheyHangout} onChange={(e) => setRoadmap({ ...roadmap, whereTheyHangout: e.target.value })} placeholder="LinkedIn, Slack communities, Twitter, conferences" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-purple-400 h-20 resize-none" />
                </div>
                <div>
                  <label className="block text-gray-900 font-medium mb-3">Validation evidence</label>
                  <div className="space-y-3">
                    {[
                      { id: 'interviews', label: 'Customer interviews (10+)', desc: 'Talked to potential users' },
                      { id: 'landing', label: 'Landing page signups', desc: 'Collected interested emails' },
                      { id: 'loi', label: 'Letters of intent', desc: 'Commitment to pay' },
                      { id: 'competitors', label: 'Competitor analysis', desc: 'Know the landscape' },
                    ].map((item) => (
                      <button key={item.id} onClick={() => toggleValidation(item.id)} className={`w-full flex items-start gap-4 p-4 rounded-xl border transition-all text-left ${roadmap.validationEvidence.includes(item.id) ? 'bg-purple-50 border-purple-300' : 'bg-gray-50 border-gray-200 hover:border-gray-300'}`}>
                        <div className={`w-5 h-5 rounded border-2 flex-shrink-0 mt-0.5 flex items-center justify-center ${roadmap.validationEvidence.includes(item.id) ? 'bg-purple-500 border-purple-500' : 'border-gray-300'}`}>
                          {roadmap.validationEvidence.includes(item.id) && <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                        </div>
                        <div><p className="text-gray-900 font-medium">{item.label}</p><p className="text-gray-500 text-sm">{item.desc}</p></div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3 Content */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-gray-900 font-medium mb-2">Core value (one sentence)</label>
                  <input type="text" value={roadmap.coreValue} onChange={(e) => setRoadmap({ ...roadmap, coreValue: e.target.value })} placeholder="The ONE thing your MVP must do perfectly" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-purple-400" />
                </div>
                <div>
                  <label className="block text-gray-900 font-medium mb-3">Key features (max 3)</label>
                  <div className="space-y-3">
                    {roadmap.features.map((feature, i) => (
                      <div key={i} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-purple-500 font-bold">{i + 1}.</span>
                          <input type="text" value={feature.name} onChange={(e) => updateFeature(i, 'name', e.target.value)} placeholder="Feature name" className="flex-1 bg-transparent text-gray-900 placeholder-gray-400 focus:outline-none font-medium" />
                          <select value={feature.priority} onChange={(e) => updateFeature(i, 'priority', e.target.value)} className="bg-white border border-gray-200 rounded-lg px-3 py-1 text-sm focus:outline-none">
                            <option value="must-have">🔴 Must</option>
                            <option value="nice-to-have">🟡 Nice</option>
                          </select>
                        </div>
                        <input type="text" value={feature.userStory} onChange={(e) => updateFeature(i, 'userStory', e.target.value)} placeholder="As a [user], I want to [action] so that [benefit]" className="w-full bg-transparent text-gray-500 placeholder-gray-400 text-sm focus:outline-none" />
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-gray-900 font-medium mb-2">What are you NOT building?</label>
                  <textarea value={roadmap.notBuilding} onChange={(e) => setRoadmap({ ...roadmap, notBuilding: e.target.value })} placeholder="Features you'll say no to" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-purple-400 h-24 resize-none" />
                </div>
                <div className="bg-purple-50 border border-purple-100 rounded-xl p-4">
                  <p className="text-purple-700 text-sm">💡 <strong>6-Week Rule:</strong> If you can&apos;t build it in 6 weeks, scope is too big.</p>
                </div>
              </div>
            )}

            {/* Step 4 Content */}
            {step === 4 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'LLM / AI Model', key: 'llmChoice', options: ['', 'OpenAI GPT-4', 'Anthropic Claude', 'Google Gemini', 'Llama', 'Mistral'] },
                    { label: 'Vector Database', key: 'vectorDb', options: ['', 'Pinecone', 'Weaviate', 'pgvector', 'Qdrant', 'Not needed'] },
                    { label: 'Frontend', key: 'frontend', options: ['', 'Next.js', 'React', 'Vue', 'Mobile', 'API only'] },
                    { label: 'Backend', key: 'backend', options: ['', 'Python/FastAPI', 'Node.js', 'Go', 'Serverless'] },
                  ].map((field) => (
                    <div key={field.key}>
                      <label className="block text-gray-900 font-medium mb-2 text-sm">{field.label}</label>
                      <select value={roadmap[field.key as keyof RoadmapData] as string} onChange={(e) => setRoadmap({ ...roadmap, [field.key]: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-purple-400">
                        {field.options.map((opt) => <option key={opt} value={opt}>{opt || 'Select...'}</option>)}
                      </select>
                    </div>
                  ))}
                </div>
                <div>
                  <label className="block text-gray-900 font-medium mb-2 text-sm">Hosting</label>
                  <select value={roadmap.hosting} onChange={(e) => setRoadmap({ ...roadmap, hosting: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-purple-400">
                    {['', 'Vercel', 'AWS', 'GCP', 'Railway', 'Render'].map((opt) => <option key={opt} value={opt}>{opt || 'Select...'}</option>)}
                  </select>
                </div>
                <div className="bg-purple-50 border border-purple-100 rounded-xl p-4">
                  <p className="text-purple-700 text-sm">💡 Use managed services. Build custom only for core differentiators.</p>
                </div>
              </div>
            )}

            {/* Step 5 Content */}
            {step === 5 && (
              <div className="space-y-3">
                {[
                  { week: '1', title: 'Discovery & Design', desc: 'Scope, wireframes, architecture', del: 'PRD + Prototypes' },
                  { week: '2', title: 'Core AI Pipeline', desc: 'Data ingestion, model integration', del: 'Working AI' },
                  { week: '3', title: 'Frontend + Integration', desc: 'UI, connect to AI, core flows', del: 'Prototype' },
                  { week: '4', title: 'Feature Complete', desc: 'Auth, edge cases, polish', del: 'Complete MVP' },
                  { week: '5', title: 'Polish & Test', desc: 'Bugs, beta testing', del: 'Beta-ready' },
                  { week: '6', title: 'Launch 🚀', desc: 'Deploy, go-to-market', del: 'LIVE' },
                ].map((item) => (
                  <div key={item.week} className="flex gap-3 items-start">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold flex-shrink-0" style={{ background: 'linear-gradient(135deg, #A855F7, #EC4899)' }}>W{item.week}</div>
                    <div className="flex-1 bg-gray-50 rounded-xl p-3 border-l-4 border-purple-500">
                      <p className="text-gray-900 font-medium text-sm">{item.title}</p>
                      <p className="text-gray-500 text-xs">{item.desc}</p>
                      <p className="text-purple-600 text-xs mt-1">📦 {item.del}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Step 6 Content */}
            {step === 6 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-gray-900 font-medium mb-2">North Star Metric</label>
                  <input type="text" value={roadmap.northStar} onChange={(e) => setRoadmap({ ...roadmap, northStar: e.target.value })} placeholder="The ONE number that tells you if you're winning" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-purple-400" />
                </div>
                <div>
                  <label className="block text-gray-900 font-medium mb-2">30-Day Launch Goals</label>
                  <textarea value={roadmap.thirtyDayGoals} onChange={(e) => setRoadmap({ ...roadmap, thirtyDayGoals: e.target.value })} placeholder="E.g., 100 signups, 20% retention, 5 paying customers" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-purple-400 h-28 resize-none" />
                </div>
                <div className="bg-purple-50 border border-purple-100 rounded-xl p-4">
                  <p className="text-purple-700 text-sm">💡 <strong>Only 3 metrics matter:</strong> Using it? Coming back? Willing to pay?</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Navigation */}
        {step > 0 && (
          <div className="flex justify-between mt-8">
            <button onClick={() => setStep(step - 1)} className="text-gray-500 hover:text-gray-900 transition flex items-center gap-2 font-medium">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              Back
            </button>
            
            {step < totalSteps - 1 ? (
              <button onClick={() => setStep(step + 1)} className="px-8 py-3 rounded-xl text-white font-medium flex items-center gap-2 hover:opacity-90 transition-all" style={{ background: 'linear-gradient(90deg, #A855F7, #EC4899)' }}>
                Continue
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </button>
            ) : (
              <button onClick={handleFinalSubmit} disabled={isSubmitting} className="px-10 py-3 rounded-xl text-white font-medium hover:opacity-90 transition-all disabled:opacity-50" style={{ background: 'linear-gradient(90deg, #A855F7, #EC4899)' }}>
                {isSubmitting ? 'Saving...' : 'Complete Roadmap 🚀'}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="text-center py-8 text-gray-400 text-sm border-t border-gray-100">
        <a href="https://1labs.ai" className="hover:text-purple-600 transition">
          Built by <span style={{ background: 'linear-gradient(90deg, #A855F7, #EC4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>1Labs.ai</span> — Ship AI Products 10× Faster
        </a>
      </footer>
    </main>
  );
}
