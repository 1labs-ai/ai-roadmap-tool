'use client';

// Force dynamic rendering to ensure env vars are available
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { useUser, SignIn, SignUp, UserButton } from '@clerk/nextjs';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../convex/_generated/api';
import Link from 'next/link';

const ROADMAP_COST = 5;

type GateState = 'closed' | 'sign-in' | 'sign-up' | 'no-credits';

export default function Home() {
  const { user, isSignedIn, isLoaded } = useUser();
  const [gateState, setGateState] = useState<GateState>('closed');
  
  // Convex queries/mutations
  const userPlan = useQuery(api.users.getUserPlan, isSignedIn && user?.id ? { clerkId: user.id } : 'skip');
  const getOrCreateUser = useMutation(api.users.getOrCreateUser);
  const deductCredits = useMutation(api.users.deductCredits);

  // Sync user to Convex on sign in
  useEffect(() => {
    if (isSignedIn && user) {
      getOrCreateUser({
        clerkId: user.id,
        email: user.primaryEmailAddress?.emailAddress ?? '',
        name: user.fullName ?? undefined,
      });
    }
  }, [isSignedIn, user, getOrCreateUser]);

  const [roadmap, setRoadmap] = useState({
    productName: '',
    problem: '',
    targetAudience: '',
    coreValue: '',
    llmChoice: '',
    features: [
      { name: '', priority: 'must-have' },
      { name: '', priority: 'must-have' },
      { name: '', priority: 'nice-to-have' },
    ],
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedRoadmap, setGeneratedRoadmap] = useState('');
  const [showResult, setShowResult] = useState(false);

  const credits = userPlan?.credits ?? 0;
  const plan = userPlan?.plan ?? 'free';
  const isUnlimited = plan === 'unlimited';

  const handleGenerate = async () => {
    // Check auth first
    if (!isSignedIn) {
      setGateState('sign-in');
      return;
    }

    // Check credits (unlimited plan bypasses)
    if (!isUnlimited && credits < ROADMAP_COST) {
      setGateState('no-credits');
      return;
    }

    // Generate!
    setIsGenerating(true);
    setShowResult(true);

    try {
      // Deduct credits first (unlimited plan won't actually deduct)
      await deductCredits({
        clerkId: user!.id,
        amount: ROADMAP_COST,
        reason: 'roadmap_generation',
        toolName: 'roadmap',
      });

      // Call generation API
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName: roadmap.productName,
          problem: roadmap.problem,
          targetAudience: roadmap.targetAudience,
          coreValue: roadmap.coreValue,
          llmChoice: roadmap.llmChoice,
          features: roadmap.features.filter(f => f.name),
        }),
      });

      const data = await response.json();
      if (data.roadmap) {
        setGeneratedRoadmap(data.roadmap);
      }
    } catch (error) {
      console.error('Generation failed:', error);
    }

    setIsGenerating(false);
  };

  const closeGate = () => setGateState('closed');

  const formatCredits = (credits: number) => {
    if (credits >= 999999) return '∞';
    return credits.toLocaleString();
  };

  // Auth Gate Modal
  const AuthGate = () => {
    if (gateState === 'closed') return null;

    return (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(4px)',
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) closeGate();
        }}
      >
        <div
          style={{
            position: 'relative',
            background: 'white',
            borderRadius: 16,
            overflow: 'hidden',
            maxWidth: '95vw',
            maxHeight: '95vh',
          }}
        >
          <button
            onClick={closeGate}
            style={{
              position: 'absolute',
              top: 12,
              right: 12,
              zIndex: 10,
              width: 32,
              height: 32,
              borderRadius: '50%',
              border: 'none',
              background: 'rgba(0,0,0,0.1)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 18,
            }}
          >
            ×
          </button>

          {gateState === 'sign-in' && (
            <SignIn
              appearance={{
                elements: {
                  rootBox: { margin: 0 },
                  card: { boxShadow: 'none', border: 'none' },
                },
              }}
            />
          )}

          {gateState === 'sign-up' && (
            <SignUp
              appearance={{
                elements: {
                  rootBox: { margin: 0 },
                  card: { boxShadow: 'none', border: 'none' },
                },
              }}
            />
          )}

          {gateState === 'no-credits' && (
            <div style={{ padding: 40, textAlign: 'center', maxWidth: 420 }}>
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #faf5ff 0%, #fdf2f8 100%)',
                  margin: '0 auto 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 28,
                }}
              >
                💳
              </div>
              <h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: 8, color: '#131314' }}>
                Need more credits
              </h2>
              <p style={{ color: '#6e6d73', marginBottom: 8, lineHeight: 1.5 }}>
                You have <strong>{formatCredits(credits)} credits</strong> on the <strong style={{ textTransform: 'capitalize' }}>{plan}</strong> plan.
              </p>
              <p style={{ color: '#6e6d73', marginBottom: 24, lineHeight: 1.5 }}>
                Generating a roadmap costs <strong>{ROADMAP_COST} credits</strong>.
              </p>
              
              {/* Plan comparison mini */}
              <div style={{ 
                background: '#f9fafb', 
                borderRadius: 12, 
                padding: 16, 
                marginBottom: 24,
                textAlign: 'left',
              }}>
                <p style={{ fontSize: 12, color: '#6e6d73', marginBottom: 12, fontWeight: 500 }}>
                  UPGRADE OPTIONS:
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 14, color: '#131314' }}>Starter</span>
                    <span style={{ fontSize: 14, color: '#7c3aed', fontWeight: 600 }}>100 credits/mo • $9</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 14, color: '#131314' }}>Pro</span>
                    <span style={{ fontSize: 14, color: '#7c3aed', fontWeight: 600 }}>500 credits/mo • $29</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 14, color: '#131314' }}>Unlimited</span>
                    <span style={{ fontSize: 14, color: '#db2777', fontWeight: 600 }}>∞ credits • $79</span>
                  </div>
                </div>
              </div>
              
              <Link
                href="/pricing"
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '14px 24px',
                  background: 'linear-gradient(135deg, #7C3AED 0%, #EC4899 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: 9999,
                  fontSize: 15,
                  fontWeight: 500,
                  cursor: 'pointer',
                  marginBottom: 12,
                  textDecoration: 'none',
                  textAlign: 'center',
                }}
              >
                View Pricing Plans →
              </Link>
              <button
                onClick={closeGate}
                style={{
                  width: '100%',
                  padding: '12px 24px',
                  background: 'transparent',
                  color: '#6e6d73',
                  border: '1px solid #e5e7eb',
                  borderRadius: 9999,
                  fontSize: 14,
                  cursor: 'pointer',
                }}
              >
                Maybe later
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Result Screen
  if (showResult) {
    return (
      <div style={{ minHeight: '100vh', background: '#fff', fontFamily: "'Inter Tight', system-ui, sans-serif" }}>
        <Header credits={credits} plan={plan} isSignedIn={isSignedIn ?? false} setGateState={setGateState} />

        <main style={{ maxWidth: 800, margin: '0 auto', padding: '100px 24px 80px' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#131314', margin: '0 auto 24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="28" height="28" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
            </div>
            <h1 style={{ fontSize: 32, fontWeight: 500, color: '#131314', marginBottom: 12 }}>Your AI Roadmap for {roadmap.productName || 'Your Product'}</h1>
          </div>

          <div style={{ background: 'white', borderRadius: 24, padding: 32, boxShadow: '0 0 0 1px rgba(0,0,0,0.05), 0 4px 16px rgba(0,0,0,0.08)', marginBottom: 32 }}>
            {isGenerating ? (
              <div style={{ textAlign: 'center', padding: 48 }}>
                <div style={{ width: 48, height: 48, border: '3px solid #e5e7eb', borderTopColor: '#a855f7', borderRadius: '50%', margin: '0 auto 16px', animation: 'spin 1s linear infinite' }} />
                <p style={{ color: '#6e6d73', fontSize: 15 }}>Generating your personalized roadmap...</p>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              </div>
            ) : generatedRoadmap ? (
              <div style={{ color: '#131314', fontSize: 15, lineHeight: 1.8 }}>
                {generatedRoadmap.split('\n').map((line, i) => {
                  if (line.startsWith('# ') && !line.startsWith('## ')) {
                    return <h1 key={i} style={{ fontSize: 24, fontWeight: 700, color: '#131314', marginTop: 32, marginBottom: 16, paddingBottom: 8, borderBottom: '3px solid #a855f7' }}>{line.replace('# ', '')}</h1>;
                  } else if (line.startsWith('## ')) {
                    return <h2 key={i} style={{ fontSize: 20, fontWeight: 600, color: '#131314', marginTop: 28, marginBottom: 12, paddingBottom: 8, borderBottom: '2px solid #f3f4f6' }}>{line.replace('## ', '')}</h2>;
                  } else if (line.startsWith('### ')) {
                    return <h3 key={i} style={{ fontSize: 17, fontWeight: 600, color: '#131314', marginTop: 20, marginBottom: 8 }}>{line.replace('### ', '')}</h3>;
                  } else if (line.startsWith('- ') || line.startsWith('* ')) {
                    const content = line.replace(/^[-*]\s*/, '');
                    const parts = content.split('**');
                    return (
                      <div key={i} style={{ margin: '10px 0', paddingLeft: 20, position: 'relative' }}>
                        <span style={{ position: 'absolute', left: 0, color: '#a855f7', fontWeight: 'bold' }}>•</span>
                        {parts.map((part, j) => j % 2 === 1 ? <strong key={j} style={{ fontWeight: 600 }}>{part}</strong> : part)}
                      </div>
                    );
                  } else if (/^\d+\.\s/.test(line)) {
                    const num = line.match(/^(\d+)\./)?.[1];
                    const content = line.replace(/^\d+\.\s*/, '');
                    return (
                      <div key={i} style={{ margin: '10px 0', paddingLeft: 28, position: 'relative' }}>
                        <span style={{ position: 'absolute', left: 0, color: '#a855f7', fontWeight: 600, fontSize: 14 }}>{num}.</span>
                        {content}
                      </div>
                    );
                  } else if (line.includes('**')) {
                    const parts = line.split('**');
                    return (
                      <p key={i} style={{ margin: '8px 0' }}>
                        {parts.map((part, j) => j % 2 === 1 ? <strong key={j} style={{ fontWeight: 600 }}>{part}</strong> : part)}
                      </p>
                    );
                  } else if (line.trim()) {
                    return <p key={i} style={{ margin: '8px 0' }}>{line}</p>;
                  }
                  return <div key={i} style={{ height: 8 }} />;
                })}
              </div>
            ) : (
              <p style={{ color: '#6e6d73', textAlign: 'center' }}>Your roadmap will appear here...</p>
            )}
          </div>

          <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
            <button onClick={() => setShowResult(false)} style={{ padding: '14px 28px', background: 'transparent', color: '#131314', border: '1px solid #e5e7eb', borderRadius: 9999, fontWeight: 500, cursor: 'pointer' }}>
              ← Generate Another
            </button>
            <a href="https://calendly.com/heemang-1labs/30min" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', background: '#131314', color: 'white', padding: '14px 32px', borderRadius: 9999, fontWeight: 500, textDecoration: 'none', fontSize: 15 }}>
              Book a Strategy Call →
            </a>
          </div>
        </main>

        <Footer />
        <AuthGate />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#fff', fontFamily: "'Inter Tight', system-ui, sans-serif" }}>
      <Header credits={credits} plan={plan} isSignedIn={isSignedIn ?? false} setGateState={setGateState} />

      <main style={{ maxWidth: 640, margin: '0 auto', padding: '100px 24px 80px', textAlign: 'center' }}>
        {/* Hero */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.2)', padding: '8px 12px', borderRadius: 9999, marginBottom: 24, boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
          <span style={{ fontSize: 16 }}>✨</span>
          <span style={{ color: '#58585a', fontSize: 12, fontWeight: 500 }}>Free AI Tool from</span>
          <span style={{ fontSize: 12, fontWeight: 700, background: 'linear-gradient(90deg,#A855F7,#EC4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>1Labs.ai</span>
        </div>

        <h1 style={{ fontSize: 52, fontWeight: 500, color: '#131314', marginBottom: 16, lineHeight: 1.1, letterSpacing: '-2px' }}>
          AI Product<br/>
          <span style={{ background: 'linear-gradient(90deg,#A855F7,#EC4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Roadmap Generator</span>
        </h1>
        <p style={{ fontSize: 18, color: '#6e6d73', marginBottom: 40, lineHeight: 1.5, maxWidth: 480, marginLeft: 'auto', marginRight: 'auto' }}>
          Get a complete 6-week roadmap for your AI product in seconds. The same framework we use to ship MVPs.
        </p>

        {/* Form */}
        <div style={{ background: 'white', borderRadius: 24, padding: 32, boxShadow: '0 0 0 1px rgba(0,0,0,0.05), 0 4px 16px rgba(0,0,0,0.08)', textAlign: 'left' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontWeight: 500, marginBottom: 8, color: '#131314', fontSize: 14 }}>Product Name</label>
              <input
                type="text"
                value={roadmap.productName}
                onChange={(e) => setRoadmap({ ...roadmap, productName: e.target.value })}
                placeholder="e.g., AI Writing Assistant"
                style={{ width: '100%', padding: '14px 16px', border: '1px solid #e5e7eb', borderRadius: 12, fontSize: 15, color: '#131314', outline: 'none', background: '#f9fafb' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: 500, marginBottom: 8, color: '#131314', fontSize: 14 }}>What problem are you solving?</label>
              <textarea
                value={roadmap.problem}
                onChange={(e) => setRoadmap({ ...roadmap, problem: e.target.value })}
                placeholder="Describe the pain point your product addresses..."
                style={{ width: '100%', padding: '14px 16px', border: '1px solid #e5e7eb', borderRadius: 12, fontSize: 15, color: '#131314', outline: 'none', background: '#f9fafb', resize: 'none', height: 100 }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: 500, marginBottom: 8, color: '#131314', fontSize: 14 }}>Target Audience</label>
              <input
                type="text"
                value={roadmap.targetAudience}
                onChange={(e) => setRoadmap({ ...roadmap, targetAudience: e.target.value })}
                placeholder="e.g., Content marketers at SaaS companies"
                style={{ width: '100%', padding: '14px 16px', border: '1px solid #e5e7eb', borderRadius: 12, fontSize: 15, color: '#131314', outline: 'none', background: '#f9fafb' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: 500, marginBottom: 8, color: '#131314', fontSize: 14 }}>Core Value Proposition</label>
              <input
                type="text"
                value={roadmap.coreValue}
                onChange={(e) => setRoadmap({ ...roadmap, coreValue: e.target.value })}
                placeholder="The ONE thing your product does better than anything else"
                style={{ width: '100%', padding: '14px 16px', border: '1px solid #e5e7eb', borderRadius: 12, fontSize: 15, color: '#131314', outline: 'none', background: '#f9fafb' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: 500, marginBottom: 8, color: '#131314', fontSize: 14 }}>Preferred LLM</label>
              <select
                value={roadmap.llmChoice}
                onChange={(e) => setRoadmap({ ...roadmap, llmChoice: e.target.value })}
                style={{ width: '100%', padding: '14px 16px', border: '1px solid #e5e7eb', borderRadius: 12, fontSize: 15, color: '#131314', outline: 'none', background: '#f9fafb' }}
              >
                <option value="">Select...</option>
                <option value="OpenAI GPT-4">OpenAI GPT-4</option>
                <option value="Claude">Claude</option>
                <option value="Gemini">Gemini</option>
                <option value="Llama">Llama (Open Source)</option>
                <option value="Not sure yet">Not sure yet</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: 500, marginBottom: 10, color: '#131314', fontSize: 14 }}>Key Features (up to 3)</label>
              {roadmap.features.map((f, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                  <input
                    type="text"
                    value={f.name}
                    onChange={(e) => {
                      const nf = [...roadmap.features];
                      nf[i].name = e.target.value;
                      setRoadmap({ ...roadmap, features: nf });
                    }}
                    placeholder={`Feature ${i + 1}`}
                    style={{ flex: 1, padding: '12px 14px', border: '1px solid #e5e7eb', borderRadius: 10, fontSize: 14, background: '#f9fafb', outline: 'none' }}
                  />
                  <select
                    value={f.priority}
                    onChange={(e) => {
                      const nf = [...roadmap.features];
                      nf[i].priority = e.target.value;
                      setRoadmap({ ...roadmap, features: nf });
                    }}
                    style={{ padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: 10, fontSize: 13, background: '#f9fafb' }}
                  >
                    <option value="must-have">🔴 Must</option>
                    <option value="nice-to-have">🟡 Nice</option>
                  </select>
                </div>
              ))}
            </div>

            <button
              onClick={handleGenerate}
              disabled={!roadmap.productName || !roadmap.problem}
              style={{
                width: '100%',
                padding: '16px 24px',
                background: (!roadmap.productName || !roadmap.problem) ? '#e5e7eb' : '#131314',
                color: (!roadmap.productName || !roadmap.problem) ? '#9ca3af' : 'white',
                border: 'none',
                borderRadius: 9999,
                fontSize: 16,
                fontWeight: 600,
                cursor: (!roadmap.productName || !roadmap.problem) ? 'not-allowed' : 'pointer',
                marginTop: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              Generate My Roadmap
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
            </button>

            <p style={{ color: '#9ca3af', fontSize: 13, textAlign: 'center', marginTop: 4 }}>
              {isSignedIn ? (
                isUnlimited ? (
                  <>Unlimited plan • Generate all you want!</>
                ) : (
                  <>Uses {ROADMAP_COST} credits • You have {formatCredits(credits)} credits</>
                )
              ) : (
                <>Sign up free to get 50 credits</>
              )}
            </p>
          </div>
        </div>
      </main>

      <Footer />
      <AuthGate />
    </div>
  );
}

// Header Component
function Header({ credits, plan, isSignedIn, setGateState }: { credits: number; plan: string; isSignedIn: boolean; setGateState: (s: GateState) => void }) {
  const formatCredits = (credits: number) => {
    if (credits >= 999999) return '∞';
    return credits.toLocaleString();
  };

  const getPlanBadgeStyle = (plan: string) => {
    const styles: Record<string, { bg: string; text: string; border: string }> = {
      free: { bg: '#f3f4f6', text: '#374151', border: '#e5e7eb' },
      starter: { bg: '#dbeafe', text: '#1e40af', border: '#93c5fd' },
      pro: { bg: '#faf5ff', text: '#7c3aed', border: '#c4b5fd' },
      unlimited: { bg: 'linear-gradient(135deg, #faf5ff 0%, #fdf2f8 100%)', text: '#db2777', border: '#f9a8d4' },
    };
    return styles[plan] || styles.free;
  };

  return (
    <header style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, padding: '16px 24px', background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <a href="https://1labs.ai" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <svg width="36" height="36" viewBox="0 0 80 80">
            <defs><linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#7C3AED"/><stop offset="40%" stopColor="#EC4899"/><stop offset="100%" stopColor="#FDF2F8"/></linearGradient></defs>
            <rect width="80" height="80" rx="18" fill="#0A0A0A"/>
            <g transform="translate(10,13)"><path d="M2 27 C2 12,15 12,30 27 C45 42,58 42,58 27 C58 12,45 12,30 27 C15 42,2 42,2 27 Z" fill="none" stroke="url(#g1)" strokeWidth="5" strokeLinecap="round"/><rect x="26" y="0" width="8" height="54" rx="4" fill="url(#g1)"/></g>
          </svg>
          <span style={{ fontSize: 19, fontWeight: 600 }}>
            <span style={{ background: 'linear-gradient(135deg,#7C3AED,#EC4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>1</span>
            <span style={{ color: '#090221' }}>Labs</span>
            <span style={{ color: '#EC4899' }}>.ai</span>
          </span>
        </a>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {isSignedIn ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', background: 'linear-gradient(135deg, #faf5ff 0%, #fdf2f8 100%)', border: '1px solid #e9d5ff', borderRadius: 9999, fontSize: 14, fontWeight: 500, color: '#7c3aed' }}>
                <span style={{ fontSize: 16 }}>✨</span>
                <span>{formatCredits(credits)} credits</span>
              </div>
              <Link 
                href="/pricing"
                style={{
                  padding: '6px 12px',
                  background: getPlanBadgeStyle(plan).bg,
                  color: getPlanBadgeStyle(plan).text,
                  border: `1px solid ${getPlanBadgeStyle(plan).border}`,
                  borderRadius: 9999,
                  fontSize: 12,
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  textDecoration: 'none',
                }}
              >
                {plan}
              </Link>
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: { width: 36, height: 36 },
                  },
                }}
              />
            </>
          ) : (
            <>
              <button onClick={() => setGateState('sign-in')} style={{ padding: '8px 16px', background: 'transparent', color: '#131314', border: '1px solid #e5e7eb', borderRadius: 9999, fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>
                Sign In
              </button>
              <button onClick={() => setGateState('sign-up')} style={{ padding: '8px 16px', background: '#131314', color: 'white', border: 'none', borderRadius: 9999, fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>
                Sign Up Free
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

// Footer Component
function Footer() {
  return (
    <footer style={{ textAlign: 'center', padding: 24, borderTop: '1px solid #f3f4f6', color: '#9ca3af', fontSize: 13 }}>
      Built by <a href="https://1labs.ai" style={{ color: '#a855f7', textDecoration: 'none', fontWeight: 500 }}>1Labs.ai</a> — Ship AI Products 10× Faster
    </footer>
  );
}
