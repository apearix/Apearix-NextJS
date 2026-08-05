import { ImageResponse } from 'next/og';

export const alt = 'Apearix | Software Engineering & AI Solutions';
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
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '70px 80px',
          backgroundColor: '#050711',
          position: 'relative',
          overflow: 'hidden',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Background Grid Pattern */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `
              linear-gradient(to right, rgba(255, 255, 255, 0.04) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255, 255, 255, 0.04) 1px, transparent 1px)
            `,
            backgroundSize: '48px 48px',
            opacity: 0.8,
          }}
        />

        {/* Ambient Radial Glows */}
        <div
          style={{
            position: 'absolute',
            top: '-15%',
            left: '30%',
            width: '600px',
            height: '600px',
            background: 'radial-gradient(circle, rgba(124, 58, 237, 0.35) 0%, rgba(59, 130, 246, 0.15) 50%, rgba(0,0,0,0) 70%)',
            borderRadius: '50%',
            filter: 'blur(80px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-20%',
            right: '-10%',
            width: '500px',
            height: '500px',
            background: 'radial-gradient(circle, rgba(79, 70, 229, 0.25) 0%, rgba(0, 0, 0, 0) 70%)',
            borderRadius: '50%',
            filter: 'blur(60px)',
          }}
        />

        {/* Header: Brand Logo & Tag */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            zIndex: 10,
          }}
        >
          {/* Logo Brandmark */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #A855F7 0%, #4F46E5 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 20px rgba(168, 85, 247, 0.4)',
              }}
            >
              <div
                style={{
                  width: '18px',
                  height: '18px',
                  borderRadius: '4px',
                  backgroundColor: '#FFFFFF',
                }}
              />
            </div>
            <span
              style={{
                fontSize: 30,
                fontWeight: 900,
                color: '#FFFFFF',
                letterSpacing: '-0.5px',
              }}
            >
              Apearix
            </span>
          </div>

          {/* Capsule Badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '9999px',
              padding: '8px 18px',
              backdropFilter: 'blur(12px)',
            }}
          >
            <div
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#A855F7',
                boxShadow: '0 0 10px #A855F7',
              }}
            />
            <span
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: '#CBD5E1',
                textTransform: 'uppercase',
                letterSpacing: '1.5px',
              }}
            >
              Software Engineering Studio
            </span>
          </div>
        </div>

        {/* Main Hero Content */}
        <div style={{ display: 'flex', flexDirection: 'column', zIndex: 10, marginTop: '20px' }}>
          <h1
            style={{
              fontSize: 78,
              fontWeight: 900,
              color: '#FFFFFF',
              lineHeight: 1.0,
              letterSpacing: '-2.5px',
              margin: 0,
            }}
          >
            Engineering <span style={{ color: '#A855F7' }}>Intelligence.</span>
          </h1>
          <p
            style={{
              fontSize: 28,
              fontWeight: 500,
              color: '#94A3B8',
              lineHeight: 1.3,
              marginTop: '18px',
              maxWidth: '850px',
              letterSpacing: '-0.5px',
            }}
          >
            Building high-performance SaaS applications, custom AI agents, and enterprise software platforms.
          </p>
        </div>

        {/* Footer: Service Badges & Domain */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            zIndex: 10,
          }}
        >
          {/* Glassmorphic Chips */}
          <div style={{ display: 'flex', gap: '12px' }}>
            {['AI Agents', 'Enterprise SaaS', 'Automation', 'Cloud & Mobile'].map((service) => (
              <div
                key={service}
                style={{
                  backgroundColor: 'rgba(124, 58, 237, 0.12)',
                  border: '1px solid rgba(168, 85, 247, 0.25)',
                  borderRadius: '10px',
                  padding: '10px 18px',
                  fontSize: 15,
                  fontWeight: 600,
                  color: '#E2E8F0',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                }}
              >
                {service}
              </div>
            ))}
          </div>

          {/* Domain Name */}
          <span
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: '#64748B',
              letterSpacing: '0.5px',
            }}
          >
            apearix.com
          </span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}