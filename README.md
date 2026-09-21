# habby-org.github.io

The habby website. Two things live here:

| Path     | What it is                     | Where it comes from                        |
|----------|--------------------------------|--------------------------------------------|
| `/`      | **habby itself**, in a browser | built from `habby-org/app` by the workflow |
| `/intro` | the landing page               | `intro/` in this repository                |
| `/invite?code=…` | invitation fallback | verified App/Universal Link, or an OS-aware store redirect |

The app is the front door. `/` is the Compose Multiplatform build of habby's `wasmJs` target — the
same app as on Android and iOS, drawn onto a canvas — and it is *not* committed here: the deploy
workflow checks out `habby-org/app`, runs `:composeApp:wasmJsBrowserDistribution`, and lays the
result at the root. The landing page beneath `intro/` is a dependency-free static page and is
committed.

## Deploying

`.github/workflows/pages.yml` runs on a push to `main`, on `workflow_dispatch`, and on a
`repository_dispatch` of type `app-updated` — that last one is how a release of the app publishes
itself without a commit here:

```bash
gh api repos/habby-org/habby-org.github.io/dispatches -f event_type=app-updated
```

Four secrets:

| Secret           | What it is                                                                                                             |
|------------------|------------------------------------------------------------------------------------------------------------------------|
| `APP_REPO_TOKEN` | fine-grained PAT with **Contents: Read** on `habby-org/app`. That repository is private, and the default `GITHUB_TOKEN` is scoped to this one. |
| `HABBY_LIFF_ID`  | the LIFF app LINE Login redirects back to. A LIFF app is registered against one endpoint URL, so it belongs to this deployment, not to the app's source. |
| `ANDROID_APP_SIGNING_CERT_SHA256` | The **App signing key certificate** SHA-256 from Play Console → App integrity. It is injected into `/.well-known/assetlinks.json`; do not use the local upload-key fingerprint. |
| `ANDROID_DEBUG_SIGNING_CERT_SHA256` | Optional SHA-256 of the private certificate used to sign locally installed debug builds. It is added alongside the Play certificate so those builds can also verify App Links. |

Without `HABBY_LIFF_ID` the site still builds and still shows the LINE button; tapping it reports
that this build was not configured for login.

## Local preview

The landing page needs nothing but a static server:

```bash
python3 -m http.server 4173
```

Then open `http://localhost:4173/intro/`.

For the app, build it from the app repository and serve that output instead:

```bash
cd ../habby && ./gradlew :composeApp:wasmJsBrowserDistribution
python3 -m http.server 4173 -d composeApp/build/dist/wasmJs/productionExecutable
```

## Store links

Both store controls link directly to the published habby listings in `intro/index.html`.

## Invitation links

Invitations use `https://habby-org.github.io/invite/?code=<invite-code>`. Android App Links and iOS
Universal Links claim this exact endpoint when the app is installed. If an in-app browser consumes
the verified link and reaches the web page, `invite/index.html` offers an explicit app-only
`habby://invite?code=<invite-code>` handoff and a separate platform-store link. The app handoff is
also attempted automatically, but the page deliberately has no timed store redirect: iOS keeps the
page visible while its open-app alert is shown, so that timer could race the accepted app launch.

`/.well-known/apple-app-site-association` is committed with the iOS app identifier. Android's
`/.well-known/assetlinks.json` is generated at deployment time from the Play signing certificate
and, when configured, the development signing certificate. Until at least one of those GitHub
Actions secrets is configured, the workflow deliberately serves an empty Android association file
rather than publishing the wrong certificate.

For a local debug install, add `ANDROID_DEBUG_SIGNING_CERT_SHA256` using the SHA-256 for the
certificate that signs that build. Do not publish Android's default shared debug certificate in a
production association file; use a private development keystore instead.
