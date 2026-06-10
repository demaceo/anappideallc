# Google Search Console — verify, submit sitemap, request indexing

A step-by-step runbook for getting `anappidea.llc` discovered and indexed by
Google. This is the off-page half of SEO — the on-page structured data
(`sameAs`, sitemap, JSON-LD) is already handled in the codebase, but Google
still has to be told the site exists and asked to crawl it.

Recommended path: a **Domain property** verified via DNS. It covers `www` +
non-`www` and `http`/`https` in one property. (A URL-prefix alternative is in
step 2.)

---

## 1. Create the property

1. Go to <https://search.google.com/search-console> and sign in with the
   account that should own this (e.g. `hdemaceo@gmail.com`).
2. Open the property dropdown (top-left) → **Add property**.
3. Choose **Domain** (the left box).
4. Enter `anappidea.llc` — no `https://`, no `www`, no trailing slash.
   Click **Continue**.

## 2. Verify

### Option A — DNS TXT record (Domain property, recommended)

1. Search Console shows a `TXT` record like `google-site-verification=AbC123…`.
   Copy the full string.
2. Open your DNS manager (domain registrar, or Vercel dashboard → your domain →
   **DNS Records** if your nameservers point to Vercel).
3. Add a record:
   - **Type:** `TXT`
   - **Name / Host:** `@` (root domain; some registrars want this left blank)
   - **Value:** the full `google-site-verification=…` string
   - **TTL:** default / `3600`
4. Save, return to Search Console, click **Verify**.
   - DNS propagation can take minutes to a few hours. If it reports "not
     found," wait and click **Verify** again — nothing needs redoing.

### Option B — HTML meta tag (URL-prefix property, no DNS needed)

1. In step 1, choose the **URL prefix** box instead and enter
   `https://www.anappidea.llc`.
2. Pick the **HTML tag** method; copy the
   `<meta name="google-site-verification" content="…">` tag.
3. Add it to `index.html` `<head>` (and it will propagate to every prerendered
   page). Deploy, then click **Verify**.

> Domain property (Option A) is the better long-term choice; use Option B only
> if you can't touch DNS.

## 3. Submit the sitemap

1. First sanity-check that it's live: open
   <https://www.anappidea.llc/sitemap.xml> in a browser. The build generates it
   automatically (`scripts/sitemap.mjs`).
2. In Search Console, left sidebar → **Sitemaps**.
3. Under "Add a new sitemap," enter `https://www.anappidea.llc/sitemap.xml`
   (a Domain property prefills the host — just type `sitemap.xml`).
4. Click **Submit**. Status should reach **Success** within minutes to a day,
   listing **6 discovered URLs**: `/`, `/about`, `/work`, `/services`,
   `/process`, `/contact`.

## 4. Request indexing on the homepage

1. Click the **URL inspection** bar at the top.
2. Paste `https://www.anappidea.llc` and press Enter.
3. Wait for "Retrieving data from Google index" to finish.
4. Click **Request Indexing** (runs a ~30–60s live test, then queues the URL).
5. Repeat for the highest-value pages — at minimum
   `https://www.anappidea.llc/work` and `https://www.anappidea.llc/services`.
   There's a daily quota of ~10–12 manual requests, so prioritize.

---

## What to expect & gotchas

- **Timing:** indexing a brand-new domain usually takes **a few days to ~2
  weeks**, even after requesting. Knowledge Graph / AI Overview recognition
  lags further. This is normal — there's no faster lever.
- **Keep `www` canonical.** The code canonicalizes to
  `https://www.anappidea.llc`. Confirm in **Vercel → Domains** that
  `www.anappidea.llc` is **primary** and bare `anappidea.llc` **redirects** to
  it. Serving both without a redirect splits ranking signals.
- **The `.llc` TLD is fully supported** by Google — no special handling needed.
- **Strengthen `sameAs`:** add `https://www.anappidea.llc` to the bio of each
  linked profile (Facebook, Instagram, Threads, TikTok). `sameAs` is a
  bidirectional trust signal — Google weights it far more when the profile
  links back to the domain.
- **Track progress** under **Pages** (indexed vs. not) and **Performance**
  (impressions/clicks) over the following weeks.
