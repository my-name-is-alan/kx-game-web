# client_release Packaging README Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or **superpowers:executing-plans** to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a complete, accurate Chinese README for building the Cocos client as Web Mobile, Android, or iOS while documenting OAuth callback ownership and resource/update behavior.

**Architecture:** Documentation-only change. The README will describe the current client contract: `project` is the Cocos Creator 3.8.1 entry point, packaged assets are loaded locally, `config/update.json` is fetched remotely, and native ZIP patches are optional. Android/iOS Deep Link and Native-to-JS callback code remain explicitly user-owned and are not implemented here.

**Tech Stack:** Markdown, Cocos Creator 3.8.1, npm, Android Studio/JDK 17/Android SDK/NDK, Xcode, the existing TypeScript/Lua tooling.

---

### Task 1: Write the complete packaging README

**Files:**
- Create: `README.md`
- Reference: `project/package.json`
- Reference: `project/.gitignore`
- Reference: `project/assets/Script/Kernel/PlatformAPI.ts`
- Reference: `project/assets/Script/Kernel/SdkImpl.ts`
- Reference: `project/assets/Script/Views/LyLogoUpdate.ts`
- Reference: `project/tools/bat使用文档.txt`

- [ ] **Step 1: Add project orientation and prerequisites**

Document that users must open `client_release/project`, use Cocos Creator 3.8.1, install dependencies from `project/package.json`, and keep generated `build`, `library`, `native`, `profiles`, `temp`, and `node_modules` artifacts out of ordinary source commits. Link to official Cocos 3.8 native-environment and publishing documentation.

- [ ] **Step 2: Add the first-run and data-generation commands**

Include the exact first-run commands `cd project` and `npm install`. Explain that `project/tools/bat_autoquick_3in1.bat` is only needed when XML data, error codes, or proto definitions change, and that the bundled Perl/Lua tooling must be available for those scripts.

- [ ] **Step 3: Add a safe `config/update.json` example**

Include a placeholder-only JSON example with `selectBins`, absolute `loginUrl`, `hdhivePublicUrl`, `hdhiveBaseUrl`, `hdhiveClientId`, `hdhiveRedirectUri`, `versions`, and `patchUrl`. Do not include `localhost`, `127.0.0.1`, private test hosts, real credentials, or a real client ID. Explain that `loginUrl` fronts `auth/hdhive/state`, `auth/hdhive/login`, and `getLoginGameServer`, and that the server-list response must provide a game-server `url` for the client WebSocket connection.

- [ ] **Step 4: Document OAuth callback behavior and native ownership**

State that `redirect_uri` is an exact registered value and must be identical during authorization and code exchange. Document separate Web HTTPS and native custom-scheme/App-Link examples. State that this repository does not implement Android/iOS Intent handling or Native-to-JS callback injection; the app integrator must receive the callback URL, preserve `code` and `state`, and deliver it to the game runtime in a way compatible with the existing `PlatformAPI` flow.

- [ ] **Step 5: Document local assets, remote configuration, and patches**

Explain three layers: Cocos `resources` assets are packaged into the built application and loaded by `resources.load`; `config/update.json` is fetched from a server at startup for service routing and version policy; native builds may download `patchUrl/<platform>/<old>_<new>.zip`, verify its MD5, and extract it into the native save root. State that Web builds do not use the native patch downloader path.

- [ ] **Step 6: Add platform build procedures**

Document Web Mobile static deployment, HTTPS, `config/update.json`, `/api/` routing, and CORS. Document Android JDK 17, Android Studio 2022.2.1/2022.3.1, Android SDK, compatible NDK, Cocos Build/Make, package name, ABI, orientation, debug/release keystores, and APK output locations. Document iOS macOS/Xcode prerequisites, Cocos iOS build, Xcode signing, URL Scheme or Universal Link handling, and archive/export.

- [ ] **Step 7: Add troubleshooting and security guidance**

Cover missing `update.json`, native SDK initialization not returning `URL_UPDATE`, callback `state` mismatch, OAuth callback not reopening the app, CORS/HTTPS failures, missing local assets, patch MD5/ZIP failures, WebSocket URL failures, and accidental publication of keystores or private endpoints.

### Task 2: Verify README against repository truth

**Files:**
- Verify: `README.md`
- Verify: `project/package.json`
- Verify: `project/assets/Script/Kernel/PlatformAPI.ts`
- Verify: `project/assets/Script/Kernel/SdkImpl.ts`
- Verify: `project/assets/Script/Views/LyLogoUpdate.ts`

- [ ] **Step 1: Check required sections and forbidden local addresses**

Run `rg -n "Cocos Creator|update\\.json|redirect_uri|Deep Link|resources\\.load|patchUrl|Web Mobile|Android|iOS|keystore|WebSocket" README.md`. Expected: all required topics are found. Run `rg -n "localhost|127\\.0\\.0\\.1|xxhd-tech|tf_download" README.md`. Expected: no output.

- [ ] **Step 2: Check Markdown and diff hygiene**

Run `git diff --check -- README.md`, `git diff -- README.md`, and `git status --short --branch`. Expected: no whitespace errors; only README content is added by this task; all pre-existing user-modified frontend files (including `GameServerData.ts`, `LySetting.ts`, `LySettingMsgBox.ts`, `resources/proto/sp.bin`, and `characterproto.lua`) remain unchanged and unstaged.

- [ ] **Step 3: Verify scope**

Run `git diff --name-only`. Expected: no TypeScript, Lua, Android, or iOS source file is modified by this task.

### Task 3: Hand off the completed documentation

**Files:**
- Final: `README.md`

- [ ] **Step 1: Report the README path and validation evidence**

Summarize the supported targets, fixed OAuth callback requirement, user-owned native callback code, and local-versus-remote asset behavior. Explicitly state that the existing user code and generated proto changes were not included.
