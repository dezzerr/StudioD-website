# StudioD - Vercel Backend Documentation

StudioD is deployed as a Vite site on Vercel. Image storage and delivery remain
with ImageKit, while Cal.com remains the authoritative booking provider.

## Architecture

```text
Browser → Vercel static Vite site
       → Vercel API routes → ImageKit
       → Cal.com embed
       → Decap CMS → GitHub OAuth → GitHub repository
```

## Vercel project

Connect the `dezzerr/StudioD-website` repository to Vercel.

```text
Build command: npm run build
Output directory: dist
Production branch: main
Node.js: 20 or newer
```

`vercel.json` contains the SPA rewrite, security headers, and asset caching
rules. The project root is the repository root.

## API routes

| Route | Purpose |
| --- | --- |
| `GET /api/gallery-feed` | Reads hero and collection metadata from ImageKit |
| `GET /api/list-images` | Lists approved ImageKit folders |
| `GET /api/imagekit-auth` | Creates short-lived direct-upload parameters |
| `POST /api/upload-image` | Compatibility upload route for small files |
| `POST /api/delete-image` | Deletes an ImageKit file |
| `POST /api/form-submission` | Validates and logs contact submissions |
| `GET /api/auth` | Starts Decap GitHub OAuth |
| `GET /api/callback` | Completes Decap GitHub OAuth |

The browser uploads large photographs directly to ImageKit after requesting
short-lived parameters from `/api/imagekit-auth`. This avoids sending the
photograph through a Vercel Function.

## Environment variables

Public variables are exposed to the Vite browser bundle and must not contain
secrets:

```text
VITE_SITE_URL=https://studiod.com
VITE_IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/YOUR_ENDPOINT
VITE_IMAGEKIT_PUBLIC_KEY=YOUR_PUBLIC_KEY
VITE_CAL_EVENT_PORTRAIT_URL=https://cal.com/derrick-rfm57g/portrait-session
VITE_CAL_EVENT_EVENT_URL=https://cal.com/derrick-rfm57g/event-shoot
VITE_CAL_EVENT_WEDDING_URL=https://cal.com/derrick-rfm57g/wedding-shoot
VITE_CAL_EVENT_ENGAGEMENT_URL=https://cal.com/derrick-rfm57g/engagement-shoot
```

Server-only variables belong in Vercel's environment settings:

```text
IMAGEKIT_PRIVATE_KEY=YOUR_PRIVATE_KEY
GITHUB_REPO=dezzerr/StudioD-website
GITHUB_OAUTH_CLIENT_ID=YOUR_CLIENT_ID
GITHUB_OAUTH_CLIENT_SECRET=YOUR_CLIENT_SECRET
STUDIO_ADMIN_SESSION_SECRET=YOUR_LONG_RANDOM_SESSION_SECRET
CONTACT_EMAIL=hello@studiod.com
```

The contact form currently validates and logs submissions. It does not send
email until an email provider such as Resend is deliberately configured.

## ImageKit setup

Create these folders in ImageKit:

- `/studio-d/hero`
- `/studio-d/collections/studio-portraits`
- `/studio-d/collections/family-sessions`
- `/studio-d/collections/event-photography`

Keep the ImageKit private key server-side. The public endpoint and public key
may be used by the browser for image delivery and direct uploads.

## Decap CMS setup

The CMS is available at `/admin/` and uses the GitHub backend configured in
`public/admin/config.yml`.

Create a GitHub OAuth App with this callback URL:

```text
https://studiod.com/api/callback
```

Add the client ID and secret to Vercel. Admin users must have write access to
`dezzerr/StudioD-website`.

The OAuth callback validates a signed state cookie, exchanges the authorization
code server-side, and returns the token to Decap through its popup handshake.

## Local development

Run the browser app with:

```bash
npm install
npm run dev
```

The Vite development server serves the frontend. For local Vercel Function and
OAuth testing, use the Vercel CLI after linking the project:

```bash
npx vercel dev
```

Use a separate GitHub OAuth App for local development. Never use the production
OAuth secret in a local `.env.local` file.

## Deployment checklist

- Add all Preview and Production variables in Vercel.
- Verify the build with `npm run build`.
- Test gallery feed and Cal.com booking routes on a Vercel preview.
- Test `/admin/` with the GitHub OAuth application.
- Add `studiod.com` and `www.studiod.com` to Vercel.
- Point DNS to the records provided by Vercel.
- Verify SSL, SPA routes, CSP, ImageKit, booking, contact validation, and admin.
- Keep the existing Netlify project available until the Vercel deployment is stable.
