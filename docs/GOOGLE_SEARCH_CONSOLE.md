# Google Search Console — get Todosh to appear in Google

After deploying Todosh and setting `NEXT_PUBLIC_SITE_URL` to your live domain, use Google Search Console so Google can discover and index your site.

---

## 1. Open Search Console and add a property

1. Go to [Google Search Console](https://search.google.com/search-console).
2. Sign in with the Google account you want to manage the site with.
3. Click **Add property** (or use the property dropdown if you already have others).
4. Choose **URL prefix** and enter your site’s root URL, e.g. `https://todosh.shyss.space` or `https://todosh.app`.
5. Click **Continue** to go to verification.

---

## 2. Verify ownership

You must prove you own the domain. Pick one method:

### Option A: HTML file upload (simple for static/hosted sites)

1. In Search Console, select **HTML file** as the verification method.
2. Download the file Google gives you (e.g. `google1234567890abcdef.html`).
3. Put that file in your app’s **`public/`** folder so it is served at the root, e.g. `https://your-domain.com/google1234567890abcdef.html`.
4. Deploy the app.
5. In Search Console, click **Verify**.

### Option B: HTML meta tag (good if you can edit the root layout)

1. In Search Console, select **HTML tag** as the verification method.
2. Copy the `<meta>` tag they show (e.g. `content="abc123..."`).
3. Add it to the root layout’s `<head>`. In Next.js you can add it via [app/layout.tsx](app/layout.tsx) in the `metadata` object using the `verification` key, for example:
   ```ts
   export const metadata = {
     // ... existing metadata
     verification: {
       google: "your-verification-code-here",
     },
   };
   ```
4. Deploy, then click **Verify** in Search Console.

### Option C: DNS record (for root domain verification, e.g. `todosh.app`)

1. In Search Console, select **Domain name** or **DNS** verification (if you use “Domain” property type).
2. Add the TXT record they give you at your DNS provider (e.g. Vercel, Cloudflare, your registrar).
3. Wait for DNS to propagate (minutes to hours), then click **Verify**.

#### Subdomains (e.g. todosh.shyss.space)

- **If you added a URL prefix** `https://todosh.shyss.space` in Search Console: DNS TXT is not used. Use **Option A** (HTML file in `public/`) or **Option B** (HTML meta tag in the app) to verify the subdomain.
- **If you added a Domain** `shyss.space` in Search Console: the TXT record goes on the **parent domain**, not the subdomain. Add it to the DNS for **shyss.space** (the root). In Vercel that means: go to **Domains** → click **shyss.space** (not `todosh.shyss.space`) → add the TXT there with **Name** `@` (root of shyss.space) and **Value** as Google gives you. That verifies the whole domain and all subdomains, including `todosh.shyss.space`.

#### Adding the TXT record in Vercel (DNS on Vercel)

Your domain must be using [Vercel’s nameservers](https://vercel.com/docs/domains/managing-nameservers) so Vercel can manage DNS.

1. Open your [Vercel dashboard](https://vercel.com/dashboard) and go to **Domains** in the sidebar (under your team).
2. Click the **domain** you need to add the record to:
   - For a **subdomain** like `todosh.shyss.space` with a **Domain** property: click the **parent** domain **shyss.space** (the TXT goes at the root of the parent).
   - For a **root domain** like `todosh.app`: click **todosh.app**.
3. Open the **Advanced** / DNS settings for that domain. If you see **Enable Vercel DNS**, turn it on so you can add records.
4. **Add a record** and set:
   - **Name:** For the root of that domain use `@` or leave blank. For `shyss.space` this is `@` (root of shyss.space). Use exactly what Search Console shows if it specifies a host.
   - **Type:** `TXT`
   - **Value:** Paste the verification string Google gives you (e.g. `google-site-verification=abc123...`).
   - **TTL:** Default (e.g. 60) is fine.
5. Save the record. Propagation can take from a few minutes up to 24 hours; then in Search Console click **Verify**.

Use the method that matches how you host and manage the domain.

---

## 3. Submit your sitemap

1. In Search Console, open your property.
2. In the left sidebar, go to **Sitemaps** (under “Indexing”).
3. In “Add a new sitemap”, enter: `sitemap.xml` (the full URL will be `https://your-domain.com/sitemap.xml`).
4. Click **Submit**.

Google will start crawling the URLs listed in [app/sitemap.ts](app/sitemap.ts) (landing, login, signup). Status may show “Success” or “Couldn’t fetch” until the first crawl; give it a few hours.

---

## 4. Request indexing for the homepage (optional but useful)

1. In the left sidebar, go to **URL inspection** (under “Indexing”).
2. Enter your homepage URL, e.g. `https://your-domain.com/`.
3. Click **Enter**. Search Console will show whether the URL is on Google or not.
4. If it says “URL is not on Google”, click **Request indexing** to ask Google to crawl it soon.

You can repeat URL inspection for `/login` and `/signup` if you want, but the sitemap submission is usually enough for discovery.

---

## 5. What to expect

- **Indexing** can take from a few days to a few weeks. New or low-traffic sites often take longer.
- **Coverage** and **Pages** reports in Search Console will show which URLs Google has indexed and any errors.
- **Performance** will start showing queries and clicks once the site is indexed and gets traffic.

Technical SEO (metadata, sitemap, robots, canonicals, landing content) is already in place; Search Console is what tells Google your site exists and which URLs to crawl.
