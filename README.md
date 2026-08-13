# wocaro-front

Static Next.js frontend for Wocaro. Content comes from your API-enabled WordPress theme at **build time**. The `out/` folder is plain HTML/CSS/JS uploaded to `public_html`.

## Hosting layout

| Path | What lives there |
| --- | --- |
| `public_html/` | This Next.js `out/` build (main domain) |
| `public_html/wp/` | WordPress API (subdomain, e.g. `wp.yourdomain.com`) |

FTP deploy **ignores `wp/`** and will not upload into it or delete it. `cgi-bin` and `.well-known` are also left alone.

## Scripts

```bash
npm install
npm run dev      # local development (talks to WP API live)
npm run build    # writes static site to out/
```

Copy `.env.example` to `.env` for local development.

## Staging deploy (FTP)

Push to `staging` or `main`, or run **Actions → Deploy Staging (FTP)**. CI builds `out/` from WordPress, then FTPs only changed files into `public_html`.

### One GitHub secret: `STAGING_ENV`

Repo → **Settings** → **Secrets and variables** → **Actions** → create **`STAGING_ENV`**.

Paste the full contents of `.env.example` (site URLs + FTP) into that single secret and edit values there. Update this one secret whenever anything changes.

If FTP TLS fails, set `STAGING_FTP_PROTOCOL=ftp` inside `STAGING_ENV`.

After WordPress page/content changes, run the workflow again (or push) so the static HTML is rebuilt.
