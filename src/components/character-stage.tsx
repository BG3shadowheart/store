'use client';

import { useEffect, useRef, useState } from 'react';
import { CHARACTER_SLOTS, DEFAULT_THEME, THEME_IDS, isTheme, type ThemeId } from '@/lib/themes';

type Item = { url: string; artist_name?: string; artist_href?: string; source_url?: string };
type Art = { url: string; artist?: string; link?: string };

const CACHE_KEY = 'abnormal-characters-v1';
const CACHE_TTL = 12 * 60 * 60 * 1000;

/**
 * Big anime character on the right of every page. The picture follows the
 * active theme, slides in when the theme changes and drifts with the mouse.
 * Pictures come from your own files (public/art/characters) or, if none are
 * there, from the free SFW nekos.best API (cached for 12 h in the browser).
 */
export function CharacterStage({ local }: { local: Partial<Record<ThemeId, string>> }) {
  const [remote, setRemote] = useState<Partial<Record<ThemeId, Art>>>({});
  const [active, setActive] = useState<ThemeId>(DEFAULT_THEME);
  const [armed, setArmed] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  // follow <html data-theme>
  useEffect(() => {
    const html = document.documentElement;
    const read = () => {
      const value = html.dataset.theme;
      if (isTheme(value)) setActive(value);
    };
    read();
    const observer = new MutationObserver(read);
    observer.observe(html, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  // load the other themes' pictures a moment after the first one
  useEffect(() => {
    const id = window.setTimeout(() => setArmed(true), 2500);
    return () => window.clearTimeout(id);
  }, []);

  // fetch pictures
  useEffect(() => {
    let cancelled = false;

    (async () => {
      const needed: Record<string, number> = {};
      for (const theme of THEME_IDS) {
        if (local[theme]) continue;
        const [category, index] = CHARACTER_SLOTS[theme];
        needed[category] = Math.max(needed[category] ?? 0, index + 1);
      }
      if (Object.keys(needed).length === 0) return;

      let data: Record<string, Item[]> | null = null;
      try {
        const raw = window.localStorage.getItem(CACHE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as { t: number; data: Record<string, Item[]> };
          if (Date.now() - parsed.t < CACHE_TTL) data = parsed.data;
        }
      } catch {
        /* ignore */
      }

      if (!data) {
        const fresh: Record<string, Item[]> = {};
        await Promise.all(
          Object.entries(needed).map(async ([category, amount]) => {
            try {
              const res = await fetch(`https://nekos.best/api/v2/${category}?amount=${amount}`);
              if (!res.ok) return;
              const json = (await res.json()) as { results?: Item[] };
              fresh[category] = json.results ?? [];
            } catch {
              /* offline or blocked: the scene still works without a picture */
            }
          }),
        );
        data = fresh;
        if (Object.values(fresh).some((list) => list.length > 0)) {
          try {
            window.localStorage.setItem(CACHE_KEY, JSON.stringify({ t: Date.now(), data: fresh }));
          } catch {
            /* ignore */
          }
        }
      }

      if (cancelled) return;
      const next: Partial<Record<ThemeId, Art>> = {};
      for (const theme of THEME_IDS) {
        if (local[theme]) continue;
        const [category, index] = CHARACTER_SLOTS[theme];
        const item = data[category]?.[index];
        if (item?.url) next[theme] = { url: item.url, artist: item.artist_name, link: item.source_url ?? item.artist_href };
      }
      setRemote(next);
    })();

    return () => {
      cancelled = true;
    };
  }, [local]);

  // mouse parallax (desktop only)
  useEffect(() => {
    if (!window.matchMedia('(min-width: 1024px) and (hover: hover)').matches) return;
    let frame = 0;
    const onMove = (event: MouseEvent) => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        root.current?.style.setProperty('--mx', String((event.clientX / window.innerWidth - 0.5) * 2));
        root.current?.style.setProperty('--my', String((event.clientY / window.innerHeight - 0.5) * 2));
      });
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMove);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={root}>
      {THEME_IDS.map((theme) => {
        const localUrl = local[theme];
        const art: Art | undefined = localUrl ? { url: localUrl } : remote[theme];
        const load = !!art && (theme === active || armed);
        return (
          <div key={theme} className={`stage stage-${theme}`}>
            <div aria-hidden="true" className="stage-aura" />
            <div aria-hidden="true" className="stage-ring" />
            <div aria-hidden="true" className="stage-ring stage-ring--inner" />
            <div aria-hidden="true" className="stage-art">
              {load && art ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img className="stage-img" src={art.url} alt="" decoding="async" referrerPolicy="no-referrer" />
              ) : null}
            </div>
            {art?.artist && theme === active ? (
              <a className="stage-credit" href={art.link} target="_blank" rel="noopener noreferrer">
                Art: {art.artist}
              </a>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
