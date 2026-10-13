import { createRandom, between } from '@/lib/art';

/**
 * Atmospheric page background: charcoal wash, faint technical grid, drifting
 * light blooms and slow dust particles. Purely decorative and very light —
 * it is one fixed layer behind all content.
 */
export function Atmosphere() {
  const random = createRandom('abnormal-atmosphere-v1');
  const dust = Array.from({ length: 34 }, () => ({
    x: between(random, 0, 100),
    y: between(random, 0, 100),
    size: between(random, 1, 2.6),
    delay: between(random, 0, 18),
    duration: between(random, 22, 44),
    opacity: between(random, 0.08, 0.4),
    violet: random() > 0.72,
  }));

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* base */}
      <div className="absolute inset-0 bg-ink-950" />

      {/* light blooms */}
      <div className="absolute -left-40 -top-32 h-[38rem] w-[38rem] rounded-full bg-[radial-gradient(circle,rgba(232,16,47,0.16),transparent_68%)] blur-3xl animate-drift" />
      <div className="absolute -right-32 top-24 h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(circle,rgba(124,92,255,0.13),transparent_70%)] blur-3xl animate-drift-reverse" />
      <div className="absolute bottom-[-14rem] left-1/3 h-[40rem] w-[40rem] rounded-full bg-[radial-gradient(circle,rgba(232,16,47,0.09),transparent_72%)] blur-3xl animate-float-slower" />

      {/* grid + fade */}
      <div className="bg-grid absolute inset-0 opacity-[0.55] [mask-image:radial-gradient(120%_80%_at_50%_0%,black,transparent_75%)]" />

      {/* dust */}
      <div className="absolute inset-0">
        {dust.map((particle, index) => (
          <span
            key={index}
            className="absolute rounded-full animate-float-slow"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              background: particle.violet ? '#c6b8fd' : '#ff8a99',
              opacity: particle.opacity,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${particle.duration}s`,
              boxShadow: particle.violet
                ? '0 0 12px rgba(167,139,250,0.6)'
                : '0 0 12px rgba(255,80,100,0.6)',
            }}
          />
        ))}
      </div>

      {/* film grain */}
      <div className="bg-noise absolute inset-0 opacity-[0.035] mix-blend-soft-light" />

      {/* top and bottom grade */}
      <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-ink-950 via-ink-950/60 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-72 bg-gradient-to-t from-ink-950 via-ink-950/70 to-transparent" />
    </div>
  );
}
