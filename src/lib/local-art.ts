import fs from 'node:fs';
import path from 'node:path';
import { THEME_IDS, type ThemeId } from '@/lib/themes';

/**
 * Your own character art wins over the online pictures: save
 * public/art/characters/<theme>.png (anemo, geo, electro, dendro, hydro, pyro,
 * cryo — .jpg/.webp/.avif work too) and it is used for that section.
 */
export function findLocalCharacters(): Partial<Record<ThemeId, string>> {
  const found: Partial<Record<ThemeId, string>> = {};
  for (const theme of THEME_IDS) {
    for (const ext of ['png', 'webp', 'avif', 'jpg', 'jpeg']) {
      if (fs.existsSync(path.join(process.cwd(), 'public', 'art', 'characters', `${theme}.${ext}`))) {
        found[theme] = `/art/characters/${theme}.${ext}`;
        break;
      }
    }
  }
  return found;
}
