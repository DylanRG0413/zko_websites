# ZKO Website

A fast, dependency-free static website (HTML, CSS, JavaScript) for ZKO. No build step, no paid APIs, no secret keys.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | The whole single-page site |
| `styles.css` | All styling and responsive rules |
| `script.js` | Menu, scroll animations, form validation and submission |
| `privacy.html`, `terms.html` | Legal page templates (fill in the `[brackets]`) |
| `favicon.svg` | Browser tab icon |
| `netlify.toml` | Netlify settings and security headers |

## Run it locally

Open `index.html` in your browser, or serve the folder:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

Note: the contact form only works once deployed on Netlify (or with another form service configured). Locally, submitting will show an error message instead of a fake success. That is intentional.

## Before you publish: fill in the placeholders

Search the project for `placeholder` and `[` brackets:

1. `index.html`: contact section and footer: add your business email and social links (turn the placeholder text into real `<a href="...">` links).
2. `privacy.html` and `terms.html`: add dates, your email, and review the wording.
3. Optional: add a `<link rel="canonical">` and Open Graph tags once you have your domain.

## Publish with GitHub + Netlify

1. **Create a GitHub repo.** On github.com click **New repository**, name it `zko-website`, and create it.
2. **Upload the project.** Either use **Add file > Upload files** and drag in everything from this folder, or from a terminal inside the folder:
   ```bash
   git init
   git add .
   git commit -m "Initial ZKO website"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/zko-website.git
   git push -u origin main
   ```
3. **Connect Netlify.** Sign in at netlify.com (free plan works), choose **Add new site > Import an existing project**, pick GitHub, and select `zko-website`.
4. **Deploy settings.** Leave the build command empty and the publish directory as `.` (already set in `netlify.toml`), then click **Deploy**.
5. **Turn on form detection.** In Netlify go to **Project configuration > Forms** and make sure form detection is enabled. If the form doesn't appear after the first deploy, trigger a redeploy.
6. **Choose where submissions go.** Under **Forms > Form notifications > Add notification > Email notification**, enter the address that should receive requests. Submissions are also stored in the Netlify dashboard under **Forms > contact**.
7. **Test it.** Open your live URL, submit the form, and confirm the entry appears in Netlify and the email arrives. Only then tell customers it's live.
8. **Custom domain (optional).** **Domain management > Add a domain.** Domains are paid separately by the registrar.

Netlify's free plan includes a limited number of monthly form submissions; check their current limits on their pricing page.

## Using a different form service

Netlify Forms is the default. To use Formspree or similar, create a form there and paste its endpoint URL into `FORM_ENDPOINT` at the top of `script.js`. It's a public URL, not a secret, which is fine. Never paste secret API keys into any file in this project.

## Customizing

- Colors live at the top of `styles.css` in `:root` (`--accent` is the neon green).
- Text lives in `index.html`; edit it directly.
- Keep the site honest: only list services and claims you can deliver.
