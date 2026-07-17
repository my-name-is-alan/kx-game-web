# 1.0.18 production static cache namespace design

## Problem

Production can retain an older Cocos entry/chunk batch at the browser or CDN edge while the origin already serves a newer batch. The gateway currently turns missing static paths into `index.html`, so a stale request continues as malformed or mixed JavaScript and later fails in FairyGUI with missing `CCommon_atlas*` resources and a null mask component.

## Design

- Force `CCommon` into the startup FairyGUI preload set so common masks and shared currency icons are ready before feature packages construct UI.
- Delete only the validated `project/build/web-mobile` Creator output before each release build. Keep Creator dependency and import caches so release builds remain fast.
- Serve `/`, `/index.html`, and the OAuth callback with `no-cache, no-store, must-revalidate`.
- Serve existing hashed assets with a one-year immutable cache policy.
- Return a non-cacheable 404 for missing static assets instead of the SPA shell.
- Publish as immutable release `1.0.18`; use `/?v=1.0.18` for the first production load when Cloudflare purge permission is unavailable.

## Safety and verification

The cleanup routine accepts only the exact Creator Web output path and rejects reparse points. Repository contracts assert the preload, cleanup, cache, and 404 behavior. The final build must contain one current `bundle.*.js` batch, and production validation must confirm both response headers and the loaded hash.
