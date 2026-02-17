'use client';

import { useState } from 'react';

export default function Home() {
  const [step, setStep] = useState(0);
  const [lead, setLead] = useState({ name: '', email: '', company: '', role: '' });
  const [roadmap, setRoadmap] = useState({
    problem: '', targetAudience: '', currentSolution: '', whyAI: '',
    icp: '', whereTheyHangout: '', validationEvidence: [] as string[],
    coreValue: '',
    features: [{ name: '', userStory: '', priority: 'must-have' }, { name: '', userStory: '', priority: 'must-have' }, { name: '', userStory: '', priority: 'nice-to-have' }],
    notBuilding: '', llmChoice: '', vectorDb: '', frontend: '', backend: '', hosting: '', northStar: '', thirtyDayGoals: '',
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

  // Completion Screen
  if (isComplete) {
    return (
      <div style={{ minHeight: '100vh', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, fontFamily: "'Inter Tight', system-ui, sans-serif" }}>
        <div style={{ maxWidth: 440, textAlign: 'center' }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#131314', margin: '0 auto 24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="28" height="28" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 500, color: '#131314', marginBottom: 12 }}>Your Roadmap is Ready!</h1>
          <p style={{ fontSize: 17, color: '#6e6d73', marginBottom: 32, lineHeight: 1.5 }}>Want help executing it? We&apos;ve helped 50+ founders ship AI products in 6 weeks.</p>
          <a href="https://calendly.com/heemang-1labs/30min" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', background: '#131314', color: 'white', padding: '14px 32px', borderRadius: 9999, fontWeight: 500, textDecoration: 'none', fontSize: 15 }}>Book a Free Strategy Call →</a>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#fff', fontFamily: "'Inter Tight', system-ui, sans-serif" }}>
      {/* Header */}
      <header style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, padding: '20px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <a href="https://1labs.ai" style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.2)', padding: '8px 16px', borderRadius: 9999, textDecoration: 'none', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
            <svg width="36" height="36" viewBox="0 0 80 80"><defs><linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#7C3AED"/><stop offset="40%" stopColor="#EC4899"/><stop offset="100%" stopColor="#FDF2F8"/></linearGradient></defs><rect width="80" height="80" rx="18" fill="#0A0A0A"/><g transform="translate(10,13)"><path d="M2 27 C2 12,15 12,30 27 C45 42,58 42,58 27 C58 12,45 12,30 27 C15 42,2 42,2 27 Z" fill="none" stroke="url(#g1)" strokeWidth="5" strokeLinecap="round"/><rect x="26" y="0" width="8" height="54" rx="4" fill="url(#g1)"/></g></svg>
            <span style={{ fontSize: 19, fontWeight: 600 }}><span style={{ background: 'linear-gradient(135deg,#7C3AED,#EC4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>1</span><span style={{ color: '#090221' }}>Labs</span><span style={{ color: '#EC4899' }}>.ai</span></span>
          </a>
          {step > 0 && (
            <div style={{ background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.2)', padding: '8px 16px', borderRadius: 9999, display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
              <span style={{ color: '#58585a', fontSize: 14, fontWeight: 500 }}>{step} / {totalSteps - 1}</span>
              <div style={{ width: 80, height: 4, background: '#e5e7eb', borderRadius: 9999, overflow: 'hidden' }}>
                <div style={{ height: '100%', background: 'linear-gradient(90deg,#A855F7,#EC4899)', width: `${(step / (totalSteps - 1)) * 100}%`, transition: 'width 0.3s' }} />
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main */}
      <main style={{ maxWidth: 560, margin: '0 auto', padding: '140px 24px 80px', textAlign: step === 0 ? 'center' : 'left' }}>
        {step === 0 && (
          <>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.2)', padding: '8px 12px', borderRadius: 9999, marginBottom: 32, boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
              <span style={{ color: '#58585a', fontSize: 11, fontWeight: 500 }}>Free Tool from</span>
              <span style={{ fontSize: 11, fontWeight: 700, background: 'linear-gradient(90deg,#A855F7,#EC4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>ProductOS</span>
            </div>
            <h1 style={{ fontSize: 56, fontWeight: 500, color: '#131314', marginBottom: 16, lineHeight: 1.1, letterSpacing: '-2px' }}>AI Product<br/><span style={{ background: 'linear-gradient(90deg,#A855F7,#EC4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Roadmap</span></h1>
            <p style={{ fontSize: 19, color: '#6e6d73', marginBottom: 40, lineHeight: 1.5, maxWidth: 420, marginLeft: 'auto', marginRight: 'auto' }}>The framework we use to take AI products from idea to MVP in 6 weeks.</p>
            
            <div style={{ background: 'white', borderRadius: 24, padding: 32, boxShadow: '0 0 0 1px rgba(0,0,0,0.05), 0 4px 16px rgba(0,0,0,0.08)', textAlign: 'left' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {['Your name', 'Work email', 'Company name', 'Your role (optional)'].map((ph, i) => (
                  <input key={i} type={i === 1 ? 'email' : 'text'} placeholder={ph} value={i === 0 ? lead.name : i === 1 ? lead.email : i === 2 ? lead.company : lead.role} onChange={(e) => setLead({ ...lead, [i === 0 ? 'name' : i === 1 ? 'email' : i === 2 ? 'company' : 'role']: e.target.value })} style={{ width: '100%', padding: '14px 16px', border: '1px solid #e5e7eb', borderRadius: 12, fontSize: 15, color: '#131314', outline: 'none', background: '#f9fafb' }} />
                ))}
                <button onClick={handleLeadSubmit} disabled={!lead.name || !lead.email || !lead.company} style={{ width: '100%', padding: '14px 24px', background: '#131314', color: 'white', border: 'none', borderRadius: 9999, fontSize: 15, fontWeight: 500, cursor: (!lead.name || !lead.email || !lead.company) ? 'not-allowed' : 'pointer', opacity: (!lead.name || !lead.email || !lead.company) ? 0.5 : 1, marginTop: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  Start Building My Roadmap
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
                </button>
              </div>
              <p style={{ color: '#9ca3af', fontSize: 13, marginTop: 20, textAlign: 'center' }}>Free forever. No credit card required.</p>
            </div>
          </>
        )}

        {step >= 1 && step <= 6 && (
          <div style={{ background: 'white', borderRadius: 24, padding: 32, boxShadow: '0 0 0 1px rgba(0,0,0,0.05), 0 4px 16px rgba(0,0,0,0.08)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg,#A855F7,#EC4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 18 }}>{step}</div>
              <div>
                <h2 style={{ fontSize: 22, fontWeight: 600, color: '#131314', margin: 0 }}>{['', 'Product Vision & Problem', 'Target Users & Validation', 'MVP Scope', 'AI & Tech Stack', '6-Week Timeline', 'Success Metrics'][step]}</h2>
                <p style={{ color: '#6e6d73', margin: 0, fontSize: 14 }}>{['', "Define what you're building", 'Define your ICP', 'Do ONE thing well', 'Choose for speed', 'Sprint structure', 'What winning looks like'][step]}</p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {step === 1 && (<>
                <div><label style={{ display: 'block', fontWeight: 500, marginBottom: 8, color: '#131314', fontSize: 14 }}>What problem are you solving?</label><textarea value={roadmap.problem} onChange={(e) => setRoadmap({ ...roadmap, problem: e.target.value })} placeholder="Be specific" style={{ width: '100%', padding: '12px 14px', border: '1px solid #e5e7eb', borderRadius: 12, fontSize: 14, resize: 'none', height: 100, background: '#f9fafb', outline: 'none' }} /></div>
                <div><label style={{ display: 'block', fontWeight: 500, marginBottom: 8, color: '#131314', fontSize: 14 }}>Who has this problem?</label><textarea value={roadmap.targetAudience} onChange={(e) => setRoadmap({ ...roadmap, targetAudience: e.target.value })} placeholder="E.g., E-commerce companies..." style={{ width: '100%', padding: '12px 14px', border: '1px solid #e5e7eb', borderRadius: 12, fontSize: 14, resize: 'none', height: 72, background: '#f9fafb', outline: 'none' }} /></div>
                <div><label style={{ display: 'block', fontWeight: 500, marginBottom: 8, color: '#131314', fontSize: 14 }}>Current solutions?</label><textarea value={roadmap.currentSolution} onChange={(e) => setRoadmap({ ...roadmap, currentSolution: e.target.value })} placeholder="Competitors, workarounds" style={{ width: '100%', padding: '12px 14px', border: '1px solid #e5e7eb', borderRadius: 12, fontSize: 14, resize: 'none', height: 72, background: '#f9fafb', outline: 'none' }} /></div>
                <div><label style={{ display: 'block', fontWeight: 500, marginBottom: 8, color: '#131314', fontSize: 14 }}>Why AI?</label><textarea value={roadmap.whyAI} onChange={(e) => setRoadmap({ ...roadmap, whyAI: e.target.value })} placeholder="Your unfair advantage" style={{ width: '100%', padding: '12px 14px', border: '1px solid #e5e7eb', borderRadius: 12, fontSize: 14, resize: 'none', height: 100, background: '#f9fafb', outline: 'none' }} /></div>
              </>)}

              {step === 2 && (<>
                <div><label style={{ display: 'block', fontWeight: 500, marginBottom: 8, color: '#131314', fontSize: 14 }}>Ideal Customer Profile</label><textarea value={roadmap.icp} onChange={(e) => setRoadmap({ ...roadmap, icp: e.target.value })} placeholder="Industry, size, role, budget" style={{ width: '100%', padding: '12px 14px', border: '1px solid #e5e7eb', borderRadius: 12, fontSize: 14, resize: 'none', height: 100, background: '#f9fafb', outline: 'none' }} /></div>
                <div><label style={{ display: 'block', fontWeight: 500, marginBottom: 8, color: '#131314', fontSize: 14 }}>Where do they hang out?</label><textarea value={roadmap.whereTheyHangout} onChange={(e) => setRoadmap({ ...roadmap, whereTheyHangout: e.target.value })} placeholder="LinkedIn, communities..." style={{ width: '100%', padding: '12px 14px', border: '1px solid #e5e7eb', borderRadius: 12, fontSize: 14, resize: 'none', height: 72, background: '#f9fafb', outline: 'none' }} /></div>
                <div><label style={{ display: 'block', fontWeight: 500, marginBottom: 10, color: '#131314', fontSize: 14 }}>Validation</label>
                  {['Customer interviews (10+)', 'Landing page signups', 'Letters of intent', 'Competitor analysis'].map((label, i) => {
                    const id = ['interviews', 'landing', 'loi', 'competitors'][i];
                    const checked = roadmap.validationEvidence.includes(id);
                    return <button key={id} onClick={() => setRoadmap({ ...roadmap, validationEvidence: checked ? roadmap.validationEvidence.filter(x => x !== id) : [...roadmap.validationEvidence, id] })} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 10, border: checked ? '2px solid #a855f7' : '1px solid #e5e7eb', background: checked ? '#faf5ff' : '#f9fafb', marginBottom: 8, cursor: 'pointer', textAlign: 'left' }}>
                      <div style={{ width: 18, height: 18, borderRadius: 4, border: checked ? 'none' : '2px solid #d1d5db', background: checked ? '#a855f7' : 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{checked && <svg width="12" height="12" fill="none" stroke="white" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>}</div>
                      <span style={{ color: '#131314', fontSize: 14, fontWeight: 500 }}>{label}</span>
                    </button>;
                  })}
                </div>
              </>)}

              {step === 3 && (<>
                <div><label style={{ display: 'block', fontWeight: 500, marginBottom: 8, color: '#131314', fontSize: 14 }}>Core value (one sentence)</label><input type="text" value={roadmap.coreValue} onChange={(e) => setRoadmap({ ...roadmap, coreValue: e.target.value })} placeholder="The ONE thing your MVP must do" style={{ width: '100%', padding: '12px 14px', border: '1px solid #e5e7eb', borderRadius: 12, fontSize: 14, background: '#f9fafb', outline: 'none' }} /></div>
                <div><label style={{ display: 'block', fontWeight: 500, marginBottom: 10, color: '#131314', fontSize: 14 }}>Key features (max 3)</label>
                  {roadmap.features.map((f, i) => (
                    <div key={i} style={{ background: '#f9fafb', borderRadius: 10, padding: '12px 14px', marginBottom: 10, border: '1px solid #e5e7eb' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                        <span style={{ color: '#a855f7', fontWeight: 700 }}>{i + 1}.</span>
                        <input type="text" value={f.name} onChange={(e) => { const nf = [...roadmap.features]; nf[i].name = e.target.value; setRoadmap({ ...roadmap, features: nf }); }} placeholder="Feature name" style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: 14, fontWeight: 500 }} />
                        <select value={f.priority} onChange={(e) => { const nf = [...roadmap.features]; nf[i].priority = e.target.value; setRoadmap({ ...roadmap, features: nf }); }} style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: 6, padding: '4px 8px', fontSize: 12 }}><option value="must-have">🔴 Must</option><option value="nice-to-have">🟡 Nice</option></select>
                      </div>
                      <input type="text" value={f.userStory} onChange={(e) => { const nf = [...roadmap.features]; nf[i].userStory = e.target.value; setRoadmap({ ...roadmap, features: nf }); }} placeholder="As a [user], I want..." style={{ width: '100%', background: 'transparent', border: 'none', outline: 'none', fontSize: 13, color: '#6e6d73' }} />
                    </div>
                  ))}
                </div>
                <div><label style={{ display: 'block', fontWeight: 500, marginBottom: 8, color: '#131314', fontSize: 14 }}>NOT building in v1</label><textarea value={roadmap.notBuilding} onChange={(e) => setRoadmap({ ...roadmap, notBuilding: e.target.value })} placeholder="Features to say no to" style={{ width: '100%', padding: '12px 14px', border: '1px solid #e5e7eb', borderRadius: 12, fontSize: 14, resize: 'none', height: 72, background: '#f9fafb', outline: 'none' }} /></div>
              </>)}

              {step === 4 && (<>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div><label style={{ display: 'block', fontWeight: 500, marginBottom: 6, color: '#131314', fontSize: 13 }}>LLM</label><select value={roadmap.llmChoice} onChange={(e) => setRoadmap({ ...roadmap, llmChoice: e.target.value })} style={{ width: '100%', padding: '10px 12px', border: '1px solid #e5e7eb', borderRadius: 10, fontSize: 14, background: '#f9fafb', outline: 'none' }}>{['', 'OpenAI GPT-4', 'Claude', 'Gemini', 'Llama'].map(o => <option key={o} value={o}>{o || 'Select...'}</option>)}</select></div>
                  <div><label style={{ display: 'block', fontWeight: 500, marginBottom: 6, color: '#131314', fontSize: 13 }}>Vector DB</label><select value={roadmap.vectorDb} onChange={(e) => setRoadmap({ ...roadmap, vectorDb: e.target.value })} style={{ width: '100%', padding: '10px 12px', border: '1px solid #e5e7eb', borderRadius: 10, fontSize: 14, background: '#f9fafb', outline: 'none' }}>{['', 'Pinecone', 'Weaviate', 'pgvector', 'None'].map(o => <option key={o} value={o}>{o || 'Select...'}</option>)}</select></div>
                  <div><label style={{ display: 'block', fontWeight: 500, marginBottom: 6, color: '#131314', fontSize: 13 }}>Frontend</label><select value={roadmap.frontend} onChange={(e) => setRoadmap({ ...roadmap, frontend: e.target.value })} style={{ width: '100%', padding: '10px 12px', border: '1px solid #e5e7eb', borderRadius: 10, fontSize: 14, background: '#f9fafb', outline: 'none' }}>{['', 'Next.js', 'React', 'Vue', 'Mobile'].map(o => <option key={o} value={o}>{o || 'Select...'}</option>)}</select></div>
                  <div><label style={{ display: 'block', fontWeight: 500, marginBottom: 6, color: '#131314', fontSize: 13 }}>Backend</label><select value={roadmap.backend} onChange={(e) => setRoadmap({ ...roadmap, backend: e.target.value })} style={{ width: '100%', padding: '10px 12px', border: '1px solid #e5e7eb', borderRadius: 10, fontSize: 14, background: '#f9fafb', outline: 'none' }}>{['', 'Python', 'Node.js', 'Go', 'Serverless'].map(o => <option key={o} value={o}>{o || 'Select...'}</option>)}</select></div>
                </div>
                <div><label style={{ display: 'block', fontWeight: 500, marginBottom: 6, color: '#131314', fontSize: 13 }}>Hosting</label><select value={roadmap.hosting} onChange={(e) => setRoadmap({ ...roadmap, hosting: e.target.value })} style={{ width: '100%', padding: '10px 12px', border: '1px solid #e5e7eb', borderRadius: 10, fontSize: 14, background: '#f9fafb', outline: 'none' }}>{['', 'Vercel', 'AWS', 'GCP', 'Railway'].map(o => <option key={o} value={o}>{o || 'Select...'}</option>)}</select></div>
              </>)}

              {step === 5 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[['1', 'Discovery & Design', 'PRD'], ['2', 'Core AI Pipeline', 'Working AI'], ['3', 'Frontend', 'Prototype'], ['4', 'Feature Complete', 'MVP'], ['5', 'Polish & Test', 'Beta'], ['6', 'Launch 🚀', 'LIVE']].map(([w, t, d]) => (
                    <div key={w} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                      <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,#A855F7,#EC4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>W{w}</div>
                      <div style={{ flex: 1, background: '#f9fafb', borderRadius: 10, padding: '10px 14px', borderLeft: '3px solid #a855f7' }}>
                        <p style={{ margin: 0, fontWeight: 600, color: '#131314', fontSize: 14 }}>{t}</p>
                        <p style={{ margin: 0, color: '#a855f7', fontSize: 12 }}>📦 {d}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {step === 6 && (<>
                <div><label style={{ display: 'block', fontWeight: 500, marginBottom: 8, color: '#131314', fontSize: 14 }}>North Star Metric</label><input type="text" value={roadmap.northStar} onChange={(e) => setRoadmap({ ...roadmap, northStar: e.target.value })} placeholder="The ONE number" style={{ width: '100%', padding: '12px 14px', border: '1px solid #e5e7eb', borderRadius: 12, fontSize: 14, background: '#f9fafb', outline: 'none' }} /></div>
                <div><label style={{ display: 'block', fontWeight: 500, marginBottom: 8, color: '#131314', fontSize: 14 }}>30-Day Goals</label><textarea value={roadmap.thirtyDayGoals} onChange={(e) => setRoadmap({ ...roadmap, thirtyDayGoals: e.target.value })} placeholder="100 signups, 20% retention..." style={{ width: '100%', padding: '12px 14px', border: '1px solid #e5e7eb', borderRadius: 12, fontSize: 14, resize: 'none', height: 100, background: '#f9fafb', outline: 'none' }} /></div>
              </>)}
            </div>
          </div>
        )}

        {step > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
            <button onClick={() => setStep(step - 1)} style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#6e6d73', background: 'none', border: 'none', fontWeight: 500, cursor: 'pointer', fontSize: 14, padding: '10px 12px' }}>
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>Back
            </button>
            {step < totalSteps - 1 ? (
              <button onClick={() => setStep(step + 1)} style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#131314', color: 'white', padding: '12px 24px', borderRadius: 9999, border: 'none', fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>
                Continue<svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
              </button>
            ) : (
              <button onClick={handleFinalSubmit} disabled={isSubmitting} style={{ background: '#131314', color: 'white', padding: '12px 28px', borderRadius: 9999, border: 'none', fontSize: 14, fontWeight: 500, cursor: isSubmitting ? 'not-allowed' : 'pointer', opacity: isSubmitting ? 0.5 : 1 }}>{isSubmitting ? 'Saving...' : 'Complete Roadmap 🚀'}</button>
            )}
          </div>
        )}
      </main>

      <footer style={{ textAlign: 'center', padding: 24, borderTop: '1px solid #f3f4f6', color: '#9ca3af', fontSize: 13 }}>
        Built by <a href="https://1labs.ai" style={{ color: '#a855f7', textDecoration: 'none', fontWeight: 500 }}>1Labs.ai</a> — Ship AI Products 10× Faster
      </footer>
    </div>
  );
}
