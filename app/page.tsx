'use client';

import { useState } from 'react';

export default function Home() {
  const [step, setStep] = useState(0);
  const [lead, setLead] = useState({ name: '', email: '', company: '', role: '' });
  const [roadmap, setRoadmap] = useState({
    problem: '', targetAudience: '', currentSolution: '', whyAI: '',
    icp: '', whereTheyHangout: '', validationEvidence: [] as string[],
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
    try { await fetch('/api/leads', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ lead, timestamp: new Date().toISOString() }) }); } catch (e) { console.error(e); }
    setStep(1);
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    try { await fetch('/api/leads', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ lead, roadmap, timestamp: new Date().toISOString(), complete: true }) }); setIsComplete(true); } catch (e) { console.error(e); }
    setIsSubmitting(false);
  };

  const inputStyle = "w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100";
  const textareaStyle = inputStyle + " resize-none";
  const cardStyle = "bg-white border border-gray-200 rounded-3xl p-8 shadow-xl";
  const btnPrimary = "px-8 py-3.5 rounded-xl text-white font-medium hover:opacity-90 transition-all";
  const gradientBg = { background: 'linear-gradient(135deg, #A855F7, #EC4899)' };
  const gradientText = { background: 'linear-gradient(90deg, #A855F7, #EC4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' };

  if (isComplete) {
    return (
      <div style={{ minHeight: '100vh', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div style={{ maxWidth: '480px', textAlign: 'center' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', margin: '0 auto 32px', display: 'flex', alignItems: 'center', justifyContent: 'center', ...gradientBg }}>
            <svg style={{ width: '40px', height: '40px', color: 'white' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
          </div>
          <h1 style={{ fontSize: '36px', fontWeight: 500, color: '#111', marginBottom: '16px' }}>Your Roadmap is Ready! 🚀</h1>
          <p style={{ fontSize: '18px', color: '#666', marginBottom: '40px', lineHeight: 1.6 }}>Want help executing it? We&apos;ve helped 50+ founders ship AI products in 6 weeks.</p>
          <a href="https://calendly.com/heemang-1labs/30min" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', padding: '16px 40px', borderRadius: '12px', color: 'white', fontWeight: 500, textDecoration: 'none', ...gradientBg }}>Book a Free Strategy Call →</a>
          <p style={{ color: '#999', fontSize: '14px', marginTop: '32px' }}>1labs.ai</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom, #fff, #faf5ff 50%, #fff)' }}>
      {/* Header */}
      <header style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, padding: '16px 24px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <a href="https://1labs.ai" style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(20px)', border: '1px solid #e5e7eb', padding: '8px 16px', borderRadius: '9999px', textDecoration: 'none', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <svg width="28" height="28" viewBox="0 0 80 80"><defs><linearGradient id="lg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#7C3AED"/><stop offset="40%" stopColor="#EC4899"/><stop offset="100%" stopColor="#FDF2F8"/></linearGradient></defs><rect width="80" height="80" rx="18" fill="#0A0A0A"/><g transform="translate(10, 13)"><path d="M2 27 C2 12, 15 12, 30 27 C45 42, 58 42, 58 27 C58 12, 45 12, 30 27 C15 42, 2 42, 2 27 Z" fill="none" stroke="url(#lg)" strokeWidth="5" strokeLinecap="round"/><rect x="26" y="0" width="8" height="54" rx="4" fill="url(#lg)"/></g></svg>
            <span style={{ fontWeight: 600, fontSize: '16px' }}><span style={gradientText}>1</span><span style={{ color: '#111' }}>Labs</span><span style={{ color: '#EC4899' }}>.ai</span></span>
          </a>
          {step > 0 && (
            <div style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(20px)', border: '1px solid #e5e7eb', padding: '8px 16px', borderRadius: '9999px', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <span style={{ color: '#666', fontSize: '14px', fontWeight: 500 }}>{step} / {totalSteps - 1}</span>
              <div style={{ width: '80px', height: '6px', background: '#e5e7eb', borderRadius: '9999px', overflow: 'hidden' }}>
                <div style={{ height: '100%', borderRadius: '9999px', transition: 'width 0.3s', width: `${(step / (totalSteps - 1)) * 100}%`, ...gradientBg }} />
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: '520px', margin: '0 auto', padding: '120px 24px 80px' }}>
        {/* Step 0: Lead Capture */}
        {step === 0 && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(20px)', border: '1px solid #e5e7eb', padding: '8px 16px', borderRadius: '9999px', marginBottom: '32px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <span style={{ color: '#666', fontSize: '12px', fontWeight: 500 }}>Free Tool from</span>
              <span style={{ fontSize: '12px', fontWeight: 700, ...gradientText }}>ProductOS</span>
            </div>
            
            <h1 style={{ fontSize: '48px', fontWeight: 500, color: '#111', marginBottom: '16px', lineHeight: 1.1 }}>
              AI Product<br /><span style={gradientText}>Roadmap</span>
            </h1>
            <p style={{ fontSize: '20px', color: '#666', marginBottom: '40px', lineHeight: 1.5 }}>
              The framework we use to take AI products from idea to MVP in 6 weeks.
            </p>
            
            <div className={cardStyle} style={{ textAlign: 'left' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <input type="text" placeholder="Your name" value={lead.name} onChange={(e) => setLead({ ...lead, name: e.target.value })} className={inputStyle} />
                <input type="email" placeholder="Work email" value={lead.email} onChange={(e) => setLead({ ...lead, email: e.target.value })} className={inputStyle} />
                <input type="text" placeholder="Company name" value={lead.company} onChange={(e) => setLead({ ...lead, company: e.target.value })} className={inputStyle} />
                <input type="text" placeholder="Your role (optional)" value={lead.role} onChange={(e) => setLead({ ...lead, role: e.target.value })} className={inputStyle} />
                <button onClick={handleLeadSubmit} disabled={!lead.name || !lead.email || !lead.company} className={btnPrimary} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '8px', opacity: (!lead.name || !lead.email || !lead.company) ? 0.5 : 1, cursor: (!lead.name || !lead.email || !lead.company) ? 'not-allowed' : 'pointer', ...gradientBg }}>
                  Start Building My Roadmap
                  <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </button>
              </div>
              <p style={{ color: '#999', fontSize: '14px', marginTop: '24px', textAlign: 'center' }}>Free forever. No credit card required.</p>
            </div>
          </div>
        )}

        {/* Steps 1-6 */}
        {step >= 1 && step <= 6 && (
          <div className={cardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: 700, color: 'white', boxShadow: '0 4px 12px rgba(168,85,247,0.3)', ...gradientBg }}>{step}</div>
              <div>
                <h2 style={{ fontSize: '24px', fontWeight: 600, color: '#111', margin: 0 }}>
                  {step === 1 && 'Product Vision & Problem'}
                  {step === 2 && 'Target Users & Validation'}
                  {step === 3 && 'MVP Scope'}
                  {step === 4 && 'AI & Tech Stack'}
                  {step === 5 && '6-Week Timeline'}
                  {step === 6 && 'Success Metrics'}
                </h2>
                <p style={{ color: '#666', margin: 0 }}>
                  {step === 1 && "Define what you're building and why"}
                  {step === 2 && 'Define your ICP and validate demand'}
                  {step === 3 && 'Do ONE thing exceptionally well'}
                  {step === 4 && 'Choose for speed, not perfection'}
                  {step === 5 && 'Your sprint structure to launch'}
                  {step === 6 && 'Define what winning looks like'}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {step === 1 && (<>
                <div><label style={{ display: 'block', fontWeight: 500, marginBottom: '8px', color: '#111' }}>What problem are you solving?</label><textarea value={roadmap.problem} onChange={(e) => setRoadmap({ ...roadmap, problem: e.target.value })} placeholder="Be specific. 'Reduce support tickets by 60% with AI'" className={textareaStyle} style={{ height: '112px' }} /></div>
                <div><label style={{ display: 'block', fontWeight: 500, marginBottom: '8px', color: '#111' }}>Who experiences this problem?</label><textarea value={roadmap.targetAudience} onChange={(e) => setRoadmap({ ...roadmap, targetAudience: e.target.value })} placeholder="E.g., E-commerce companies with 10-50 employees" className={textareaStyle} style={{ height: '80px' }} /></div>
                <div><label style={{ display: 'block', fontWeight: 500, marginBottom: '8px', color: '#111' }}>How do they solve it today?</label><textarea value={roadmap.currentSolution} onChange={(e) => setRoadmap({ ...roadmap, currentSolution: e.target.value })} placeholder="Current solutions, workarounds, competitors" className={textareaStyle} style={{ height: '80px' }} /></div>
                <div><label style={{ display: 'block', fontWeight: 500, marginBottom: '8px', color: '#111' }}>Why is AI the right approach?</label><textarea value={roadmap.whyAI} onChange={(e) => setRoadmap({ ...roadmap, whyAI: e.target.value })} placeholder="What's your unfair advantage?" className={textareaStyle} style={{ height: '112px' }} /></div>
                <div style={{ background: '#faf5ff', border: '1px solid #e9d5ff', borderRadius: '12px', padding: '16px' }}><p style={{ color: '#7c3aed', fontSize: '14px', margin: 0 }}>💡 If you can&apos;t explain the problem in one sentence, you don&apos;t understand it well enough.</p></div>
              </>)}

              {step === 2 && (<>
                <div><label style={{ display: 'block', fontWeight: 500, marginBottom: '8px', color: '#111' }}>Ideal Customer Profile</label><textarea value={roadmap.icp} onChange={(e) => setRoadmap({ ...roadmap, icp: e.target.value })} placeholder="Industry, company size, role, budget, urgency" className={textareaStyle} style={{ height: '112px' }} /></div>
                <div><label style={{ display: 'block', fontWeight: 500, marginBottom: '8px', color: '#111' }}>Where do they hang out?</label><textarea value={roadmap.whereTheyHangout} onChange={(e) => setRoadmap({ ...roadmap, whereTheyHangout: e.target.value })} placeholder="LinkedIn, Slack communities, Twitter" className={textareaStyle} style={{ height: '80px' }} /></div>
                <div><label style={{ display: 'block', fontWeight: 500, marginBottom: '12px', color: '#111' }}>Validation evidence</label>
                  {[{ id: 'interviews', label: 'Customer interviews (10+)' }, { id: 'landing', label: 'Landing page signups' }, { id: 'loi', label: 'Letters of intent' }, { id: 'competitors', label: 'Competitor analysis' }].map((item) => (
                    <button key={item.id} onClick={() => { const c = roadmap.validationEvidence; setRoadmap({ ...roadmap, validationEvidence: c.includes(item.id) ? c.filter(i => i !== item.id) : [...c, item.id] }); }} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '12px', border: roadmap.validationEvidence.includes(item.id) ? '2px solid #a855f7' : '1px solid #e5e7eb', background: roadmap.validationEvidence.includes(item.id) ? '#faf5ff' : '#f9fafb', marginBottom: '8px', cursor: 'pointer', textAlign: 'left' }}>
                      <div style={{ width: '20px', height: '20px', borderRadius: '4px', border: roadmap.validationEvidence.includes(item.id) ? 'none' : '2px solid #d1d5db', background: roadmap.validationEvidence.includes(item.id) ? '#a855f7' : 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{roadmap.validationEvidence.includes(item.id) && <svg style={{ width: '12px', height: '12px', color: 'white' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}</div>
                      <span style={{ color: '#111', fontWeight: 500 }}>{item.label}</span>
                    </button>
                  ))}
                </div>
              </>)}

              {step === 3 && (<>
                <div><label style={{ display: 'block', fontWeight: 500, marginBottom: '8px', color: '#111' }}>Core value (one sentence)</label><input type="text" value={roadmap.coreValue} onChange={(e) => setRoadmap({ ...roadmap, coreValue: e.target.value })} placeholder="The ONE thing your MVP must do perfectly" className={inputStyle} /></div>
                <div><label style={{ display: 'block', fontWeight: 500, marginBottom: '12px', color: '#111' }}>Key features (max 3)</label>
                  {roadmap.features.map((f, i) => (
                    <div key={i} style={{ background: '#f9fafb', borderRadius: '12px', padding: '16px', marginBottom: '12px', border: '1px solid #e5e7eb' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        <span style={{ color: '#a855f7', fontWeight: 700 }}>{i + 1}.</span>
                        <input type="text" value={f.name} onChange={(e) => { const nf = [...roadmap.features]; nf[i] = { ...nf[i], name: e.target.value }; setRoadmap({ ...roadmap, features: nf }); }} placeholder="Feature name" style={{ flex: 1, background: 'transparent', border: 'none', color: '#111', fontWeight: 500, outline: 'none' }} />
                        <select value={f.priority} onChange={(e) => { const nf = [...roadmap.features]; nf[i] = { ...nf[i], priority: e.target.value }; setRoadmap({ ...roadmap, features: nf }); }} style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '4px 8px', fontSize: '13px' }}>
                          <option value="must-have">🔴 Must</option><option value="nice-to-have">🟡 Nice</option>
                        </select>
                      </div>
                      <input type="text" value={f.userStory} onChange={(e) => { const nf = [...roadmap.features]; nf[i] = { ...nf[i], userStory: e.target.value }; setRoadmap({ ...roadmap, features: nf }); }} placeholder="As a [user], I want..." style={{ width: '100%', background: 'transparent', border: 'none', color: '#666', fontSize: '14px', outline: 'none' }} />
                    </div>
                  ))}
                </div>
                <div><label style={{ display: 'block', fontWeight: 500, marginBottom: '8px', color: '#111' }}>What are you NOT building?</label><textarea value={roadmap.notBuilding} onChange={(e) => setRoadmap({ ...roadmap, notBuilding: e.target.value })} placeholder="Features you'll say no to" className={textareaStyle} style={{ height: '96px' }} /></div>
              </>)}

              {step === 4 && (<>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  {[{ label: 'LLM', key: 'llmChoice', opts: ['', 'OpenAI GPT-4', 'Anthropic Claude', 'Google Gemini', 'Llama'] }, { label: 'Vector DB', key: 'vectorDb', opts: ['', 'Pinecone', 'Weaviate', 'pgvector', 'Not needed'] }, { label: 'Frontend', key: 'frontend', opts: ['', 'Next.js', 'React', 'Vue', 'Mobile'] }, { label: 'Backend', key: 'backend', opts: ['', 'Python/FastAPI', 'Node.js', 'Go', 'Serverless'] }].map((f) => (
                    <div key={f.key}><label style={{ display: 'block', fontWeight: 500, marginBottom: '8px', color: '#111', fontSize: '14px' }}>{f.label}</label><select value={(roadmap as Record<string, string>)[f.key]} onChange={(e) => setRoadmap({ ...roadmap, [f.key]: e.target.value })} className={inputStyle} style={{ cursor: 'pointer' }}>{f.opts.map((o) => <option key={o} value={o}>{o || 'Select...'}</option>)}</select></div>
                  ))}
                </div>
                <div><label style={{ display: 'block', fontWeight: 500, marginBottom: '8px', color: '#111', fontSize: '14px' }}>Hosting</label><select value={roadmap.hosting} onChange={(e) => setRoadmap({ ...roadmap, hosting: e.target.value })} className={inputStyle} style={{ cursor: 'pointer' }}>{['', 'Vercel', 'AWS', 'GCP', 'Railway', 'Render'].map((o) => <option key={o} value={o}>{o || 'Select...'}</option>)}</select></div>
              </>)}

              {step === 5 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {[{ w: '1', t: 'Discovery & Design', d: 'PRD + Prototypes' }, { w: '2', t: 'Core AI Pipeline', d: 'Working AI' }, { w: '3', t: 'Frontend + Integration', d: 'Prototype' }, { w: '4', t: 'Feature Complete', d: 'MVP' }, { w: '5', t: 'Polish & Test', d: 'Beta-ready' }, { w: '6', t: 'Launch 🚀', d: 'LIVE' }].map((item) => (
                    <div key={item.w} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '13px', fontWeight: 700, flexShrink: 0, ...gradientBg }}>W{item.w}</div>
                      <div style={{ flex: 1, background: '#f9fafb', borderRadius: '12px', padding: '12px 16px', borderLeft: '4px solid #a855f7' }}>
                        <p style={{ margin: 0, fontWeight: 600, color: '#111', fontSize: '14px' }}>{item.t}</p>
                        <p style={{ margin: 0, color: '#a855f7', fontSize: '13px' }}>📦 {item.d}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {step === 6 && (<>
                <div><label style={{ display: 'block', fontWeight: 500, marginBottom: '8px', color: '#111' }}>North Star Metric</label><input type="text" value={roadmap.northStar} onChange={(e) => setRoadmap({ ...roadmap, northStar: e.target.value })} placeholder="The ONE number that tells you if you're winning" className={inputStyle} /></div>
                <div><label style={{ display: 'block', fontWeight: 500, marginBottom: '8px', color: '#111' }}>30-Day Launch Goals</label><textarea value={roadmap.thirtyDayGoals} onChange={(e) => setRoadmap({ ...roadmap, thirtyDayGoals: e.target.value })} placeholder="E.g., 100 signups, 20% retention, 5 paying customers" className={textareaStyle} style={{ height: '112px' }} /></div>
                <div style={{ background: '#faf5ff', border: '1px solid #e9d5ff', borderRadius: '12px', padding: '16px' }}><p style={{ color: '#7c3aed', fontSize: '14px', margin: 0 }}>💡 <strong>Only 3 metrics matter:</strong> Using it? Coming back? Willing to pay?</p></div>
              </>)}
            </div>
          </div>
        )}

        {/* Navigation */}
        {step > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '32px' }}>
            <button onClick={() => setStep(step - 1)} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#666', background: 'none', border: 'none', fontWeight: 500, cursor: 'pointer', padding: '12px 16px' }}>
              <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              Back
            </button>
            {step < totalSteps - 1 ? (
              <button onClick={() => setStep(step + 1)} className={btnPrimary} style={{ display: 'flex', alignItems: 'center', gap: '8px', ...gradientBg }}>
                Continue
                <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </button>
            ) : (
              <button onClick={handleFinalSubmit} disabled={isSubmitting} className={btnPrimary} style={{ opacity: isSubmitting ? 0.5 : 1, ...gradientBg }}>
                {isSubmitting ? 'Saving...' : 'Complete Roadmap 🚀'}
              </button>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={{ textAlign: 'center', padding: '32px', borderTop: '1px solid #f3f4f6', color: '#999', fontSize: '14px' }}>
        Built by <a href="https://1labs.ai" style={{ textDecoration: 'none' }}><span style={gradientText}>1Labs.ai</span></a> — Ship AI Products 10× Faster
      </footer>
    </div>
  );
}
