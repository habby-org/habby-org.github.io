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

One secret, and one optional override:

| Secret           | What it is                                                                                                             |
|------------------|------------------------------------------------------------------------------------------------------------------------|
| `APP_REPO_TOKEN` | fine-grained PAT with **Contents: Read** on `habby-org/app`. That repository is private, and the default `GITHUB_TOKEN` is scoped to this one. |
| `HABBY_LIFF_ID`  | **optional.** The app already defaults to the LIFF app registered against this site's URL. Set this only to point a deployment at a different one. |

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
