# habby-org.github.io

The habby website. Two things live here:

| Path     | What it is                     | Where it comes from                        |
|----------|--------------------------------|--------------------------------------------|
| `/`      | **habby itself**, in a browser | built from `habby-org/app` by the workflow |
| `/intro` | the landing page               | `intro/` in this repository                |

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

Two secrets:

| Secret           | What it is                                                                                                             |
|------------------|------------------------------------------------------------------------------------------------------------------------|
| `APP_REPO_TOKEN` | fine-grained PAT with **Contents: Read** on `habby-org/app`. That repository is private, and the default `GITHUB_TOKEN` is scoped to this one. |
| `HABBY_LIFF_ID`  | the LIFF app LINE Login redirects back to. A LIFF app is registered against one endpoint URL, so it belongs to this deployment, not to the app's source. |

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
