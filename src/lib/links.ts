/**
 * Support link helpers.
 *
 * The store ships with placeholder URLs (YOUR_DISCORD_INVITE_URL /
 * YOUR_TELEGRAM_SUPPORT_URL). Until they are replaced we must NOT render a
 * link that pretends to work — instead the button is disabled and shows a
 * short hint, so a visitor is never sent to a broken page.
 */

export type ResolvedSupportLink = {
  /** Usable href, or undefined while the placeholder is still in place. */
  href?: string;
  /** True when a real URL has been configured. */
  configured: boolean;
};

const PLACEHOLDER_HINTS = ['your_', 'your-', 'example.com', 'changeme', 'replace-me'];

export function resolveSupportLink(url: string | undefined): ResolvedSupportLink {
  if (!url) return { configured: false };

  const trimmed = url.trim();
  const lower = trimmed.toLowerCase();

  const looksLikePlaceholder = PLACEHOLDER_HINTS.some((hint) => lower.includes(hint));
  const isValidUrl = /^https?:\/\/[^\s]+$/i.test(trimmed);

  if (!isValidUrl || looksLikePlaceholder) return { configured: false };
  return { href: trimmed, configured: true };
}
