import { ImageResponse } from 'next/og';
import { COURSE } from '@/lessons/summary';

export const runtime = 'edge';
export const alt = 'Terminal Mastery: learn the terminal by using it';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          background: '#0d1117',
          fontFamily: 'monospace',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: 960,
            borderRadius: 14,
            overflow: 'hidden',
            border: '1px solid #30363d',
            boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
          }}
        >
          {/* title bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              background: '#161b22',
              padding: '16px 20px',
              borderBottom: '1px solid #30363d',
            }}
          >
            <div style={{ width: 14, height: 14, borderRadius: 7, background: '#ff5f57' }} />
            <div style={{ width: 14, height: 14, borderRadius: 7, background: '#febc2e' }} />
            <div style={{ width: 14, height: 14, borderRadius: 7, background: '#28c840' }} />
            <div style={{ marginLeft: 18, color: '#8b949e', fontSize: 20 }}>
              student@terminal-mastery: ~
            </div>
          </div>

          {/* body */}
          <div style={{ display: 'flex', flexDirection: 'column', padding: '40px 44px', background: '#0d1117' }}>
            <div style={{ display: 'flex', color: '#8b949e', fontSize: 26, marginBottom: 10 }}>
              <span style={{ color: '#28a745' }}>$</span>
              <span style={{ marginLeft: 12, color: '#e6edf3' }}>learn terminal</span>
            </div>

            <div style={{ display: 'flex', color: '#e6edf3', fontSize: 62, fontWeight: 700, lineHeight: 1.15, marginTop: 14 }}>
              Learn the terminal
            </div>
            <div style={{ display: 'flex', fontSize: 62, fontWeight: 700, lineHeight: 1.15 }}>
              <span style={{ color: '#2188ff' }}>by using it</span>
            </div>

            <div style={{ display: 'flex', color: '#8b949e', fontSize: 27, marginTop: 28 }}>
              {COURSE.lessons} lessons &nbsp;·&nbsp; about {COURSE.hours} hours &nbsp;·&nbsp; free, no account
            </div>
          </div>
        </div>
      </div>
    ),
    size
  );
}
