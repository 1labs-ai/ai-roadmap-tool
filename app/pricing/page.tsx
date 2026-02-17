'use client';

import { useUser, SignIn, PricingTable, UserButton } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useState } from 'react';
import Link from 'next/link';

export default function PricingPage() {
  const { user, isSignedIn, isLoaded } = useUser();
  const [showSignIn, setShowSignIn] = useState(false);
  
  const userPlan = useQuery(
    api.users.getUserPlan,
    isSignedIn && user?.id ? { clerkId: user.id } : 'skip'
  );

  const formatCredits = (credits: number | undefined) => {
    if (credits === undefined) return '...';
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
    <div style={{ minHeight: '100vh', background: '#fff', fontFamily: "'Inter Tight', system-ui, sans-serif" }}>
      {/* Header */}
      <header style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        zIndex: 50, 
        padding: '16px 24px', 
        background: 'rgba(255,255,255,0.9)', 
        backdropFilter: 'blur(20px)', 
        borderBottom: '1px solid rgba(0,0,0,0.05)' 
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
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
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {isSignedIn ? (
              <>
                {userPlan && (
                  <>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 6, 
                      padding: '8px 14px', 
                      background: 'linear-gradient(135deg, #faf5ff 0%, #fdf2f8 100%)', 
                      border: '1px solid #e9d5ff', 
                      borderRadius: 9999, 
                      fontSize: 14, 
                      fontWeight: 500, 
                      color: '#7c3aed' 
                    }}>
                      <span style={{ fontSize: 16 }}>✨</span>
                      <span>{formatCredits(userPlan.credits)} credits</span>
                    </div>
                    <div style={{
                      padding: '6px 12px',
                      background: getPlanBadgeStyle(userPlan.plan).bg,
                      color: getPlanBadgeStyle(userPlan.plan).text,
                      border: `1px solid ${getPlanBadgeStyle(userPlan.plan).border}`,
                      borderRadius: 9999,
                      fontSize: 12,
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}>
                      {userPlan.plan}
                    </div>
                  </>
                )}
                <UserButton appearance={{ elements: { avatarBox: { width: 36, height: 36 } } }} />
              </>
            ) : (
              <button 
                onClick={() => setShowSignIn(true)} 
                style={{ 
                  padding: '8px 16px', 
                  background: '#131314', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: 9999, 
                  fontSize: 14, 
                  fontWeight: 500, 
                  cursor: 'pointer' 
                }}
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '120px 24px 80px' }}>
        {/* Hero */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: 6, 
            background: 'rgba(255,255,255,0.6)', 
            backdropFilter: 'blur(20px)', 
            border: '1px solid rgba(255,255,255,0.2)', 
            padding: '8px 12px', 
            borderRadius: 9999, 
            marginBottom: 24, 
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)' 
          }}>
            <span style={{ fontSize: 16 }}>💳</span>
            <span style={{ color: '#58585a', fontSize: 12, fontWeight: 500 }}>Simple, transparent pricing</span>
          </div>

          <h1 style={{ 
            fontSize: 48, 
            fontWeight: 500, 
            color: '#131314', 
            marginBottom: 16, 
            lineHeight: 1.1, 
            letterSpacing: '-2px' 
          }}>
            Choose Your Plan
          </h1>
          <p style={{ 
            fontSize: 18, 
            color: '#6e6d73', 
            marginBottom: 40, 
            lineHeight: 1.5, 
            maxWidth: 600, 
            marginLeft: 'auto', 
            marginRight: 'auto' 
          }}>
            Get access to all our AI tools. Start free, upgrade when you need more.
          </p>
        </div>

        {/* Clerk Pricing Table */}
        <div style={{ 
          background: 'white', 
          borderRadius: 24, 
          padding: 32, 
          boxShadow: '0 0 0 1px rgba(0,0,0,0.05), 0 4px 16px rgba(0,0,0,0.08)' 
        }}>
          {!isLoaded ? (
            <div style={{ textAlign: 'center', padding: 48 }}>
              <div style={{ 
                width: 48, 
                height: 48, 
                border: '3px solid #e5e7eb', 
                borderTopColor: '#a855f7', 
                borderRadius: '50%', 
                margin: '0 auto 16px', 
                animation: 'spin 1s linear infinite' 
              }} />
              <p style={{ color: '#6e6d73', fontSize: 15 }}>Loading pricing...</p>
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
          ) : (
            <PricingTable
              appearance={{
                elements: {
                  rootBox: {
                    boxShadow: 'none',
                  },
                  card: {
                    borderRadius: '16px',
                    border: '1px solid #e5e7eb',
                  },
                  cardHeader: {
                    borderBottom: '1px solid #f3f4f6',
                  },
                },
              }}
              newSubscriptionRedirectUrl="/"
            />
          )}
        </div>

        {/* Features Comparison */}
        <div style={{ marginTop: 64, textAlign: 'center' }}>
          <h2 style={{ fontSize: 28, fontWeight: 500, color: '#131314', marginBottom: 24 }}>
            What's included
          </h2>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: 24, 
            maxWidth: 800, 
            margin: '0 auto' 
          }}>
            {[
              { icon: '🎯', title: 'AI Roadmap Generator', desc: 'Create 6-week product roadmaps' },
              { icon: '⚡', title: 'Instant Results', desc: 'Get your roadmap in seconds' },
              { icon: '📊', title: 'Detailed Planning', desc: 'Week-by-week task breakdown' },
              { icon: '🛠️', title: 'Tech Stack Recommendations', desc: 'Tailored technology suggestions' },
            ].map((feature, i) => (
              <div key={i} style={{ 
                padding: 24, 
                background: '#f9fafb', 
                borderRadius: 16, 
                textAlign: 'left' 
              }}>
                <div style={{ fontSize: 28, marginBottom: 12 }}>{feature.icon}</div>
                <h3 style={{ fontSize: 16, fontWeight: 600, color: '#131314', marginBottom: 8 }}>
                  {feature.title}
                </h3>
                <p style={{ fontSize: 14, color: '#6e6d73', lineHeight: 1.5 }}>
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div style={{ marginTop: 64, maxWidth: 700, marginLeft: 'auto', marginRight: 'auto' }}>
          <h2 style={{ fontSize: 28, fontWeight: 500, color: '#131314', marginBottom: 24, textAlign: 'center' }}>
            Frequently Asked Questions
          </h2>
          
          {[
            { 
              q: 'How do credits work?', 
              a: 'Each AI generation costs credits. The roadmap generator uses 5 credits per generation. Free users get 50 credits as a one-time signup bonus. Paid plans get monthly credits that reset automatically.' 
            },
            { 
              q: 'Can I upgrade or downgrade anytime?', 
              a: 'Yes! You can change your plan at any time. Upgrades take effect immediately with full credits. Downgrades take effect at the end of your billing cycle.' 
            },
            { 
              q: 'What happens if I run out of credits?', 
              a: 'You won\'t be able to generate new content until your credits reset (for paid plans) or you upgrade to a higher plan.' 
            },
            { 
              q: 'Is there a free trial?', 
              a: 'The Free plan lets you try our tools with 50 credits. No credit card required to get started!' 
            },
          ].map((faq, i) => (
            <div key={i} style={{ 
              padding: 20, 
              borderBottom: i < 3 ? '1px solid #f3f4f6' : 'none' 
            }}>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: '#131314', marginBottom: 8 }}>
                {faq.q}
              </h3>
              <p style={{ fontSize: 14, color: '#6e6d73', lineHeight: 1.6 }}>
                {faq.a}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ marginTop: 64, textAlign: 'center' }}>
          <p style={{ color: '#6e6d73', marginBottom: 16 }}>
            Questions? We're here to help.
          </p>
          <a 
            href="https://calendly.com/heemang-1labs/30min" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ 
              display: 'inline-block', 
              padding: '14px 28px', 
              background: '#131314', 
              color: 'white', 
              borderRadius: 9999, 
              fontSize: 15, 
              fontWeight: 500, 
              textDecoration: 'none' 
            }}
          >
            Talk to Us →
          </a>
        </div>
      </main>

      {/* Footer */}
      <footer style={{ 
        textAlign: 'center', 
        padding: 24, 
        borderTop: '1px solid #f3f4f6', 
        color: '#9ca3af', 
        fontSize: 13 
      }}>
        Built by <a href="https://1labs.ai" style={{ color: '#a855f7', textDecoration: 'none', fontWeight: 500 }}>1Labs.ai</a> — Ship AI Products 10× Faster
      </footer>

      {/* Sign In Modal */}
      {showSignIn && (
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
            if (e.target === e.currentTarget) setShowSignIn(false);
          }}
        >
          <div style={{ 
            position: 'relative', 
            background: 'white', 
            borderRadius: 16, 
            overflow: 'hidden',
            maxWidth: '95vw',
            maxHeight: '95vh',
          }}>
            <button
              onClick={() => setShowSignIn(false)}
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
            <SignIn
              appearance={{
                elements: {
                  rootBox: { margin: 0 },
                  card: { boxShadow: 'none', border: 'none' },
                },
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
