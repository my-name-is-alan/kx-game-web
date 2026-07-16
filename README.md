# 江湖大侠客户端

这是江湖大侠的 Cocos Creator 客户端源码仓库。仓库只包含前端工程，不包含登录服、游戏服、数据库、Redis、OAuth 服务或生产部署配置。

## 先看结论

- 项目入口是 [`project`](project)。不要把仓库根目录直接当成 Cocos 项目打开。
- 项目使用 Cocos Creator `3.8.1`。
- 首次构建时，Cocos 会把项目资源编译并打包到 Web、Android、iOS 等目标平台。
- APK/原生包的初始游戏资源通常来自本地安装包，运行时通过 Cocos `resources` 加载。
- `config/update.json`、登录接口、OAuth 授权、服务器列表、游戏服 WebSocket 地址仍然需要从服务器获取。
- Android/iOS 的 Deep Link、Intent、URL Scheme、Universal Link 和 Native-to-JS 回传代码由最终打包者自己实现，本仓库不提供对应平台适配代码。
- 仅有前端源码不能独立运行完整游戏。必须准备兼容的后端和游戏服。

## 支持平台

| 平台 | 构建工具 | 结果 | 说明 |
| --- | --- | --- | --- |
| Web Mobile | Cocos Creator | H5 静态文件 | 需要部署到 HTTPS Web 服务器 |
| Android | Cocos Creator + Android Studio | APK/AAB | 需要自己处理原生 SDK 和 OAuth 回跳 |
| iOS | Cocos Creator + Xcode | iOS 工程/IPA | 只能在 macOS 上签名和发布 |

官方参考：

- [Cocos Creator 3.8 文档](https://docs.cocos.com/creator/3.8/manual/zh/)
- [原生开发环境](https://docs.cocos.com/creator/3.8/manual/zh/editor/publish/setup-native-development.html)
- [Android 发布](https://docs.cocos.com/creator/3.8/manual/zh/editor/publish/android/build-example-android.html)
- [Web Mobile 发布](https://docs.cocos.com/creator/3.8/manual/zh/editor/publish/publish-web.html)

## 仓库结构

```text
client_release/
├─ project/                         # Cocos Creator 项目入口
│  ├─ assets/                       # 场景、脚本、UI、音频、数据和协议资源
│  ├─ settings/                     # 项目设置
│  ├─ tools/                        # XML、错误码、协议等生成工具
│  ├─ package.json                  # Creator 版本和 npm 依赖
│  └─ .gitignore                    # Cocos 生成目录忽略规则
├─ FGUIProject/                     # FairyGUI 源工程
├─ FairyGUI-cocoscreator-ccc3.0/    # FairyGUI Cocos 运行时源码
└─ engine/                          # 项目使用的引擎源码
```

以下目录通常是构建生成物，不建议提交：

```text
project/build/
project/library/
project/temp/
project/profiles/
project/node_modules/
```

如果你对原生 Android/iOS 工程进行了定制，必须自行保存并维护对应的 `project/native` 或独立 Native 模板。当前仓库不包含可直接复用的 Android Deep Link 实现。

## 环境要求

### 所有平台

- Cocos Creator `3.8.1`
- Git
- Node.js/npm，或 Cocos Creator 自带的 Node 运行环境
- 能访问 npm 依赖和后端服务的网络环境

### Android

Cocos Creator 3.8 原生 Android 构建通常需要：

- JDK 17
- Android Studio 2022.2.1 或 2022.3.1
- Android SDK
- Android NDK，优先使用与当前 Cocos/项目兼容的版本
- Android SDK Build-Tools、Platform-Tools、CMake

在 Cocos Creator 的“偏好设置 → 程序管理器/外部程序”中配置 Android SDK 和 NDK 路径。

### iOS

- macOS
- Xcode
- Apple Developer 签名证书和 Provisioning Profile
- 如果使用 Universal Link，还需要配置 Associated Domains 和 HTTPS 域名

## 首次打开和安装依赖

在仓库根目录执行：

```powershell
cd project
npm install
```

当前 [`project/package.json`](project/package.json) 声明的主要运行时依赖包括：

- `fairygui-cc`
- `jszip`

然后使用 Cocos Creator 3.8.1 打开 `project` 目录，等待资源导入完成，再打开 `assets/Scene/LoginScene.scene` 检查登录场景。

不要直接打开 `client_release` 根目录作为 Cocos 项目。

## 修改数据后生成资源

如果只修改 TypeScript、UI 或普通资源，通常可以直接回到 Cocos Creator 构建。

如果修改以下内容，需要按实际情况运行生成脚本：

- `project/tools/common/xmls/*.xml`
- `project/tools/common/errorcode.lua`
- `project/tools/common/protos/*.lua`

一键生成脚本：

```powershell
cd project\tools
bat_autoquick_3in1.bat
```

该脚本会生成或更新：

- 错误码和错误提示 TypeScript
- sproto 二进制文件
- XML 对应的 JSON 数据

脚本使用 `project/tools/libs` 中的 Lua/Perl 等工具。若 Windows 环境没有可用的 `perl` 命令，先安装 Perl，或分别按 [`bat使用文档.txt`](project/tools/bat使用文档.txt) 执行需要的脚本。

## 服务端配置

客户端启动后会读取 `config/update.json`。Web 版本默认从当前站点读取：

```text
https://your-game.example.com/config/update.json
```

Android/iOS 原生版本没有可靠的浏览器 `origin`，应由原生 SDK 参数或你自己的 Native 适配层提供一个绝对地址。不要把 `localhost` 或 `127.0.0.1` 作为手机生产配置。

### 配置示例

下面是脱敏示例，不能直接使用：

```json
{
  "schemaVersion": "1",
  "copyright": "YOUR_GAME_NAME",
  "selectBins": [
    {
      "sdkb": "*",
      "sdks": "*",
      "bver": "*",
      "loginUrl": "https://game.example.com/api/",
      "payUrl": "",
      "isExpire": false,
      "isUpdate": false,
      "isPayTest": false,
      "isAdTest": false,
      "isExamine": false,
      "isDebug": false
    }
  ],
  "exceptionUrl": "",
  "asdkTrackUrl": "",
  "ipAddressUrl": "",
  "linkAgreement": "https://game.example.com/agreement",
  "linkPolicy": "https://game.example.com/privacy",
  "images": [],
  "kfid": "",
  "patchUrl": "https://cdn.example.com/game-patches/",
  "versions": [
    {
      "ver": "1000",
      "md5": "0"
    }
  ],
  "list": {
    "isOpenWhite": "0",
    "isOpenBlack": "0",
    "whites": [],
    "blacks": []
  },
  "hdhivePublicUrl": "https://auth.example.com",
  "hdhiveBaseUrl": "https://auth.example.com",
  "hdhiveClientId": "REPLACE_WITH_YOUR_CLIENT_ID",
  "hdhiveRedirectUri": "https://game.example.com/oauth/callback"
}
```

注意：

- `loginUrl` 建议以 `/` 结尾，客户端会在后面拼接接口名。
- `patchUrl` 建议以 `/` 结尾，客户端会在后面拼接平台目录和补丁文件名。
- `hdhiveClientId` 必须和 OAuth 平台登记的回调地址配套。
- 每个部署环境可以有自己的域名、Client ID 和回调地址。
- 不要把生产密码、签名文件、私钥或真实服务器密钥写进前端仓库。

## 后端接口约定

`loginUrl` 对应的服务至少需要与客户端当前调用保持一致：

1. `POST auth/hdhive/state`

   创建一次 OAuth 授权会话，返回服务端生成的 `state`。

2. `POST auth/hdhive/login`

   接收授权回调的 `code`、`state`、`redirect_uri` 和 `platform`，返回游戏会话，例如 `accessToken`、`userId`、`expiresIn`。

3. `POST getLoginGameServer`

   使用 Bearer 会话返回服务器列表。列表项至少需要包含服务器 ID、名称、状态和可连接的 `url`。

4. 游戏服 WebSocket

   `getLoginGameServer` 返回的 `url` 必须是客户端设备可以访问的地址。公网环境优先使用 `wss://`，不要把容器名、`127.0.0.1` 或内网地址返回给公网客户端。

后端还需要按当前项目实际接口提供会话刷新、登出、公告、绑定状态等接口。前端仓库不包含这些服务端实现。

## OAuth 回调和 App 跳转

### 回调地址必须固定

是的，OAuth 的 `redirect_uri` 不是每次临时生成的普通跳转地址，而是需要在 OAuth 平台登记，并且授权时与换取会话时保持完全一致的地址。

例如 Web 环境可以登记：

```text
https://game.example.com/oauth/callback
```

如果部署到另一个域名，应该为另一个 Client ID 登记另一个固定地址，而不是运行时随意改字符串。

### Web Mobile 流程

Web 版本的流程是：

```text
游戏页面
  → 请求后端创建 state
  → 跳转 HDHive authorize
  → HDHive 回跳 https://game.example.com/oauth/callback?code=...&state=...
  → 游戏读取 code/state
  → 请求后端 auth/hdhive/login 换取会话
  → 获取游戏服务器列表
```

当前脚本会从浏览器 URL 的 query/hash 中读取 `code` 和 `state`，并校验之前保存的 state。回调页面不要丢失这两个参数，也不要在前端先替换或清除 URL。

### Android/iOS 流程

原生 App 需要由打包者自己选择并实现一种回跳方式：

- 自定义 Scheme，例如 `yourgame://oauth/callback`
- Android App Link，例如 `https://game.example.com/oauth/callback`
- iOS Universal Link，例如 `https://game.example.com/oauth/callback`

使用者需要自行完成：

1. 在 OAuth 平台登记最终使用的精确 `redirect_uri`。
2. 在 Android Manifest 或 iOS 工程中注册 Scheme/Link。
3. 在 Activity、AppDelegate 或 SceneDelegate 中接收回跳 URL。
4. 将 URL 中的 `code` 和 `state` 传给 Cocos JavaScript 运行时。
5. 保证换取会话时传给后端的 `redirect_uri` 与授权时完全相同。

本仓库不实现上述 Native 代码，也不假设所有 App 使用同一个 Scheme。仅仅在浏览器中执行 `window.location.href` 不等于 Android/iOS 已经完成回跳接入。

如果使用中间 HTTPS 回调页再跳转到自定义 Scheme，必须保证后端 OAuth 交换使用的 `redirect_uri` 仍然符合 OAuth 平台登记规则，并且 `state`、`code` 不被中间页丢失。

## 资源在哪里加载

打包后不是所有内容都从网络下载，当前项目分成三层：

### 1. 首包本地资源

`project/assets` 中参与构建的场景、脚本、UI、字体、音频、Spine、JSON、协议等资源会被 Cocos 编译进构建产物。代码通过 `resources.load(...)` 加载资源，因此 Android APK 初次安装时可以从本地资源运行。

### 2. 启动远程配置

`config/update.json` 不是普通游戏资源，而是启动时从服务器请求的配置。它决定：

- 登录服地址
- OAuth/HDHive 地址
- 版本状态
- 是否允许更新
- 补丁版本列表
- 补丁下载地址
- 公告、协议链接等运行参数

因此，APK 首包资源在本地，并不代表游戏可以完全离线运行。登录、服务器列表、OAuth 和 WebSocket 仍然需要网络和后端。

### 3. 原生资源热更新

当原生版本允许资源更新，并且 `versions` 中存在比当前资源版本更高的版本时，客户端会按平台下载 ZIP 补丁。平台目录约定为：

```text
<patchUrl>/and/<oldVersion>_<newVersion>.zip
<patchUrl>/ios/<oldVersion>_<newVersion>.zip
<patchUrl>/win/<oldVersion>_<newVersion>.zip
```

例如：

```text
https://cdn.example.com/game-patches/and/1000_1001.zip
```

客户端会下载补丁、校验 MD5，然后解压到原生可写目录。补丁包内的相对路径必须与客户端资源路径一致。Web Mobile 不走这套原生 `native.Downloader` 热更新流程，Web 版本通常直接重新构建并重新部署静态文件。

## 构建 Web Mobile

1. 用 Cocos Creator 3.8.1 打开 `project`。
2. 选择“项目 → 构建”。
3. 平台选择 `Web Mobile`。
4. 选择需要的场景，确认启动场景为 `LoginScene`。
5. 点击 Build。
6. 将生成目录整体部署到静态 Web 服务器。
7. 在同一站点提供 `config/update.json`。

建议的 Web 部署结构：

```text
/index.html
/assets/...
/cocos-js/...
/config/update.json
```

反向代理需要保证：

- `/config/update.json` 可以被 GET 访问。
- `/api/` 能转发到登录/网关服务。
- OAuth 回调路径能回到游戏页面或你的回调处理页面。
- WebSocket 地址可以从用户浏览器访问。
- 全站使用 HTTPS，避免 OAuth、Cookie 和 WebSocket 被浏览器拦截。

## 构建 Android APK/AAB

### Cocos Creator 构建

1. 配置 JDK、Android SDK、Android NDK。
2. 打开项目，选择“项目 → 构建”。
3. 平台选择 `Android`。
4. 设置游戏包名，例如 `com.example.yourgame`。
5. 按需要选择 `arm64-v8a` 等 ABI。
6. 按项目设计选择竖屏或横屏；当前项目设计分辨率为 `750x1334`，默认偏向竖屏。
7. 测试包可以使用 Debug Keystore。
8. 发布包必须使用自己的 Release Keystore，并妥善保存密码。
9. 点击 Build 生成原生工程，再点击 Make，或使用 Android Studio 打开生成的 `proj` 工程编译。

Cocos/Android Studio 的输出目录以实际构建任务为准，常见位置包括：

```text
build/android/proj/app/build/outputs/apk/
build/android/build/app/publish/
```

### Android 原生回跳

Android APK 能编译出来，不代表 OAuth 回跳已经完成。打包者还需要把自己的 Native 适配层放入/应用到原生工程，完成：

- `Intent Filter` 或 App Link 配置
- Activity 的 `onCreate`/`onNewIntent` 回跳接收
- Cocos Native Bridge 调用
- `code`、`state` 转发到 JavaScript
- 返回授权失败、取消和重复回跳的处理

这些代码与包名、Scheme、OAuth Client ID 和后端域名强相关，因此不由本仓库统一提供。

## 构建 iOS

1. 在 macOS 上安装 Xcode 和 Cocos Creator 3.8.1。
2. 在 Cocos Creator 的 Build 面板选择 iOS。
3. 构建并打开生成的 Xcode 工程。
4. 配置 Bundle Identifier、Team、签名证书和 Provisioning Profile。
5. 如果使用 URL Scheme 或 Universal Link，补充 iOS 工程的 Associated Domains/URL Types 配置。
6. 自行实现 App 回跳 URL 传给 Cocos JavaScript 的桥接。
7. 用 Xcode Archive、导出测试包或提交 App Store Connect。

Windows 不能直接完成 iOS 签名和发布。

## 常见问题

### 启动卡在初始化或更新配置

检查：

- `config/update.json` 是否能直接 GET 返回合法 JSON。
- 原生 `doSdkParams` 是否返回了可访问的绝对 `URL_UPDATE`。
- JSON 是否包含 `selectBins`。
- `loginUrl` 是否以 `/` 结尾。
- Web 服务器是否返回了正确的 `Content-Type` 和 HTTPS 证书。

### OAuth 回跳后提示授权会话失效

通常是以下原因之一：

- 授权时和换 token 时的 `redirect_uri` 不一致。
- `state` 被中间页面丢失或修改。
- App 重新启动后没有保留待处理的 state。
- Native 回跳 URL 没有转发给 Cocos JavaScript。
- Web 环境的 `sessionStorage` 被清空。

### 能打开登录页但进不了服务器列表

检查：

- `auth/hdhive/login` 是否返回有效 `accessToken`、`userId`、`expiresIn`。
- `getLoginGameServer` 是否接受 `Authorization: Bearer <token>`。
- 返回的 `servers[].url` 是否是设备可访问的 `ws://`/`wss://` 地址。
- 服务器列表里的状态、服务器 ID 和登录服 token 是否有效。

### APK 启动后资源缺失

检查：

- 是否打开了正确的 `project` 目录。
- 资源是否放在构建会收集的目录中。
- 是否在修改 XML/proto 后重新生成了 JSON/sp.bin。
- Cocos 构建是否成功，且没有误删 `assets`、`resources` 或 `cocos-js`。
- 如果是热更新资源，检查 `patchUrl`、平台目录、补丁文件名、ZIP 内部路径和 MD5。

### Web 页面请求被浏览器拦截

检查 HTTPS、CORS、反向代理路径、OAuth 回调路径和 WebSocket 升级配置。Web Mobile 建议让游戏页面、`config/update.json` 和 `/api/` 使用同一域名，减少跨域问题。

## 发布安全

- 不要把生产数据库密码、JWT 密钥、OAuth Client Secret、Android Keystore 或 iOS 私钥提交到前端仓库。
- `hdhiveClientId` 可以作为客户端配置使用，但 Client Secret 必须只放在后端。
- 不要把 `localhost`、`127.0.0.1`、Docker 服务名或内网 IP 写进面向用户的 `update.json`。
- 发布前检查 APK/AAB 中是否包含调试地址、测试支付地址和调试日志。
- 发布前锁定包名、Bundle ID、OAuth 回调地址和服务器域名，后续变更需要同步平台登记和后端配置。
- 生产 WebSocket 优先使用 `wss://`，并在网关层限制不必要的跨域来源。

## 许可证和第三方组件

本仓库包含 Cocos 引擎源码、FairyGUI Cocos 运行时和其他第三方代码。重新发布、修改或分发客户端时，请同时遵守各自目录中的许可证和上游项目要求。
