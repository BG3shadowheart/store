# Deploy ABNORMAL online — step by step

**Nothing to install.** No Node.js, no Git, no terminal. Everything below happens in your web browser.

You will go from the ZIP file on your computer to a public link like
`https://abnormal-store.vercel.app` (or `https://abnormal-store.pages.dev` on Cloudflare)
that **anyone** can open — no login, no invite, no protection.

Total time: **10–15 minutes**.

---

## Which host should I pick?

| | **Vercel** (recommended) | **Cloudflare Pages** |
| --- | --- | --- |
| Setup difficulty | Easiest — nothing to configure | Easy — two build fields to fill |
| Builds your project | Yes, automatically | Yes, automatically |
| Free plan | Yes | Yes |
| Auto-rebuild when you edit products | Yes | Yes |
| Best for | Getting online fastest | If you already use Cloudflare, or want their CDN |

Both are free and both give you a public URL. **Pick one and follow its path in Step 4** — you can always add the other later.

---

## What you need

1. The project ZIP file: `abnormal-store.zip`
2. A free [GitHub](https://github.com/signup) account — this stores your project
3. A free [Vercel](https://vercel.com/signup) **or** [Cloudflare](https://dash.cloudflare.com/sign-up) account

> **Why GitHub in the middle?** It is what lets your host rebuild the website automatically every time you change a price or add a product — you edit one file on the GitHub website and the live site updates itself. No re-uploading, no terminal.

> **Already have the project on GitHub and just want the host settings?** Jump to Step 4.

---

## Step 1 — Unzip the project

1. Find `abnormal-store.zip`.
2. Right-click it → **Extract All…** → **Extract**.
3. You now have a folder called **`abnormal-store`**. Open it — you should see:

```
abnormal-store
├─ src
├─ public
├─ docs
├─ scripts
├─ package.json
├─ next.config.mjs
├─ tsconfig.json
├─ README.md
└─ DEPLOYMENT.md   ← this file
```

> **Do not** upload `node_modules` or `.next` if you ever see them appear — they are generated automatically and are huge. (They are not in your ZIP, so you are fine.)

---

## Step 2 — Create the GitHub repository

1. Sign in to [github.com](https://github.com).
2. Click the **+** button (top-right) → **New repository**.
3. Fill in:
   - **Repository name:** `abnormal-store`
   - **Description:** anything you like, or leave empty
   - **Public** or **Private** — both work with Vercel and Cloudflare
   - **Do NOT** tick "Add a README file", "Add .gitignore" or "Choose a license"
4. Click **Create repository**.
5. On the next page, click the link **uploading an existing file**.
   *(Direct link: `https://github.com/YOUR-USERNAME/abnormal-store/upload/main`)*

---

## Step 3 — Upload your files

1. Open your extracted `abnormal-store` folder in File Explorer.
2. Select **everything inside it** (press `Ctrl + A`), then drag it into the GitHub upload area in your browser.
   - Make sure you drag the **contents** (`src`, `public`, `package.json`, …), **not** the `abnormal-store` folder itself. If you drag the folder, GitHub may create a nested folder and the host will not find `package.json`.
   - 52 files — one drag-and-drop is enough.
3. Wait until every file finishes uploading (the list appears at the bottom).
4. In **Commit changes** type: `Initial store` → click **Commit changes**.

Your repository should now show `src`, `public`, `package.json` and the rest at the top level. If you see a single folder instead, delete it and repeat with the files selected inside the folder.

---

## Step 4A — Deploy on Vercel (recommended)

1. Go to [vercel.com/signup](https://vercel.com/signup) → **Continue with GitHub** → authorise.
2. On the dashboard click **Add New…** → **Project**.
3. Under *Import Git Repository*, find **abnormal-store** → click **Import**.
   - Not listed? Click **Adjust GitHub App Permissions** → give Vercel access to the repository → come back and refresh.
4. Leave everything at the defaults — Vercel detects Next.js by itself:
   - Framework Preset: **Next.js**
   - Build Command: `next build`
   - Output Directory: `.next`
   - Environment Variables: **none needed**
   - Root Directory: leave empty
5. Click **Deploy** and wait 1–3 minutes.
6. You get a confetti screen with your public URL:

```
https://abnormal-store.vercel.app
```

7. Click **Visit** — the store is online. Share that link with anyone.

**Now do Step 5 (make sure it is public).**

---

## Step 4B — Deploy on Cloudflare Pages

Your project is already prepared for this: `npm run build:static` exports the whole store as plain HTML into an `out` folder, and I verified all 37 pages, prices, images and the 404 page work when served that way.

1. Sign in to the [Cloudflare dashboard](https://dash.cloudflare.com).
2. In the left sidebar: **Workers & Pages** → **Create** → **Pages** tab → **Connect to Git**.
3. Authorise Cloudflare to see your GitHub account, then pick **abnormal-store** → **Begin setup**.
4. Fill in the build settings **exactly** like this:

   | Field | Value |
   | --- | --- |
   | Project name | `abnormal-store` |
   | Production branch | `main` |
   | Framework preset | **Next.js (Static HTML Export)** |
   | Build command | `npm run build:static` |
   | Build output directory | `out` |

   > If the preset fills in `npx next build`, replace it with `npm run build:static` — that is the command that turns on static export for this project.

   > Alternative: keep the build command as `npm run build` and add an environment variable `STATIC_EXPORT` = `true` under *Environment variables (advanced)*. Both ways work.

5. (Only if the build complains about Node) scroll to **Environment variables (advanced)** and add `NODE_VERSION` = `22`.
6. Click **Save and Deploy**. The first build takes 1–3 minutes.
7. When it finishes you get your public URL:

```
https://abnormal-store.pages.dev
```

Cloudflare Pages sites are public by default — there is no login screen to disable. Open the link in a private window to be sure.

---

## Step 5 — Make sure the site is public (Vercel only)

Cloudflare Pages is already public; on Vercel, check this:

1. Open your project on Vercel → **Settings** → **Deployment Protection**.
2. Set **Vercel Authentication** to **Disabled** (at least for *Production*).
3. Click **Save**.
4. Test in an **incognito/private window**. If you get a Vercel login screen instead of the store, protection is still on.

---

## Step 6 — Put your real URL into the site (30 seconds, optional but nice)

This only affects the sitemap and link previews — the store works without it.

1. In your GitHub repository, open `src/data/store.ts`.
2. Click the **pencil** icon (Edit).
3. Change this line to your real address:

```ts
export const STORE_URL = 'https://your-store.vercel.app';   // ← paste your URL here
```

4. Scroll down → **Commit changes**. Your host rebuilds automatically in 1–2 minutes.

---

## Step 7 — Updating products later (no tools needed)

This is the part you will use most:

1. Open your repository on GitHub → `src/data/products.ts`.
2. Click the **pencil** icon.
3. Copy an existing product block, paste it, and edit the name, slug, platform and prices.
4. Scroll down → **Commit changes**.
5. Wait 1–2 minutes. Your host rebuilds and the live site updates — same URL, no re-uploading.

To change a price, just edit the number in that same file. To remove a product, delete its whole block (`{ … },`).

**Rolling back:** Vercel → **Deployments** → pick an older one → **⋯** → **Promote to Production**. Cloudflare → **Deployments** → **Rollback**.

---

## Post-deploy checklist

Open your new URL and click through:

- [ ] Home page loads with the ABNORMAL logo and the crimson hero
- [ ] `Home`, `PC`, `Android`, `iOS`, `Payments`, `Support` in the navigation all open
- [ ] The catalog search finds something (type `pato`) and the platform buttons filter
- [ ] Sorting by price works
- [ ] A product page shows every duration with its exact price
- [ ] The **Copy** buttons on the Payments page copy `+880 1629-835648` and `1220374728`
- [ ] **Discord** and **Telegram** buttons open `discord.gg/abnormal` and `t.me/ARAFATMODZ`
- [ ] On your phone: the hamburger menu opens and cards stack in one column
- [ ] `your-url/sitemap.xml` opens

---

## Optional — your own domain

1. Buy a domain (Namecheap, Cloudflare, GoDaddy…).
2. **Vercel:** project → **Settings** → **Domains** → **Add** → follow the DNS instructions.
   **Cloudflare Pages:** project → **Custom domains** → **Set up a domain** → follow the instructions.
3. HTTPS is issued automatically and free.
4. Update `STORE_URL` in `src/data/store.ts` to the new domain.

---

## Troubleshooting

| Symptom | Fix |
| --- | --- |
| Host says "No Next.js version detected" / "package.json not found" | `package.json` is not at the repository root. You uploaded the folder instead of its contents — re-upload the files inside `abnormal-store`. |
| Vercel build fails | Open the build log, find the first red line. Usually a typo in `src/data/products.ts` (a missing `,` or `}`). Fix on GitHub and commit. |
| Cloudflare build fails with "output directory not found" | Build command must be `npm run build:static` and output directory `out`. |
| Cloudflare build fails about Node version | Add environment variable `NODE_VERSION` = `22`. |
| Visitors see a Vercel login page | *Settings → Deployment Protection → Vercel Authentication → Disabled*. |
| A product link 404s | Its `slug` has capitals, spaces or symbols. Use lowercase-with-dashes only (`my-new-product`). |
| Prices look outdated | The latest build has not finished, or your browser cached the old page — hard-refresh with `Ctrl + Shift + R`. |
| Images look soft | Your logo file is 32×32 px. Replace `public/brand/logo.png` with a larger PNG of the same artwork for a sharper header logo. |

---

## Keep it honest (please)

The storefront never fakes a cart or a "payment received" screen — payments are confirmed by your team on Discord or Telegram, exactly as the site describes. If you change that workflow, update `ORDER_STEPS` and `PAYMENT_SAFETY_NOTE` in `src/data/store.ts` so the site keeps telling visitors the truth.
