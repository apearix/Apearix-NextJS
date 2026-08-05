import { ImageResponse } from 'next/og';

export const alt = 'Apearix | Software Engineering Company | AI-Powered Solutions & Automation';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #0F172A 0%, #1E1B4B 50%, #0F172A 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: '80px',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            fontSize: 24,
            fontWeight: 700,
            color: '#6D28F5',
            background: 'rgba(109, 40, 245, 0.15)',
            padding: '8px 20px',
            borderRadius: '50px',
            border: '1px solid rgba(109, 40, 245, 0.3)',
            marginBottom: '32px',
            textTransform: 'uppercase',
            letterSpacing: '2px',
          }}
        >
          Apearix
        </div>
        <div
          style={{
            fontSize: 64,
            fontWeight: 800,
            color: '#FFFFFF',
            lineHeight: 1.1,
            marginBottom: '24px',
            maxWidth: '900px',
          }}
        >
          We build software that moves businesses forward.
        </div>
        <div
          style={{
            fontSize: 28,
            color: '#94A3B8',
            maxWidth: '800px',
            lineHeight: 1.4,
          }}
        >
          Web Development • SaaS Applications • AI Automation • Mobile Apps
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
