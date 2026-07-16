# client_release 自行打包 README 设计

## 目标

为 `client_release` 提供一份完整的中文 README，说明用户如何从源码准备环境、配置服务、构建 Web Mobile、Android APK 和 iOS 工程，并明确 OAuth 回调、资源打包与远程热更新的边界。

## 已确认的仓库事实

- 项目入口为 `project`。
- 项目使用 Cocos Creator 3.8.1，运行时依赖 `fairygui-cc` 和 `jszip`。
- 初始游戏资源通过 Cocos 的 `resources` 体系打入构建产物，本地运行时使用 `resources.load` 加载。
- 启动阶段需要从网络读取 `config/update.json`。
- 原生版本可以根据 `update.json` 的 `versions` 和 `patchUrl` 下载 ZIP 资源补丁。
- OAuth 授权需要固定且精确匹配的 `redirect_uri`，代码会保存 `state` 并校验回跳的 `code/state`。
- Android Deep Link、Intent 和 Native-to-JS 回传代码由使用者自行实现，不作为本次 README 的代码改动范围。

## README 结构

1. 项目简介与仓库目录。
2. 支持平台和明确限制。
3. 环境要求：Cocos Creator、Node/npm、Android 工具链、macOS/Xcode。
4. 克隆、依赖安装和首次打开项目。
5. 数据/proto 生成脚本的适用场景。
6. `config/update.json` 配置模板，包含登录接口、HDHive 地址、客户端 ID、OAuth 回调地址、版本和补丁字段。
7. 服务端要求：登录接口、服务器列表、WebSocket 地址、HTTPS/CORS/回调登记。
8. OAuth 回调说明：Web 固定 HTTPS 地址；原生 App 由使用者选择 Scheme 或 App/Universal Link，并负责将回调 URL 交给游戏脚本。
9. 资源说明：APK 首包本地资源、启动远程配置、原生 ZIP 热更新及补丁目录约定。
10. Web Mobile 构建与部署。
11. Android APK 构建、签名和输出位置。
12. iOS 构建前提和 Xcode 后续步骤。
13. 常见问题与排查命令。
14. 安全与发布注意事项：不提交签名文件、不要使用 localhost、OAuth 回调与客户端 ID 必须配套。

## 非目标

- 不实现 Android Deep Link、Intent 或 OAuth 回跳 Native 代码。
- 不修改前端登录、资源加载、热更新和构建逻辑。
- 不承诺用户仅凭前端仓库即可获得可用后端、账号体系或游戏服。

## 验收标准

- 新用户只阅读 README 就能知道项目入口、所需工具、构建步骤和各平台限制。
- README 明确区分本地 APK 资源、远程 `update.json` 和可选远程补丁。
- README 明确说明 OAuth `redirect_uri` 必须固定登记，并说明原生回跳代码由使用者补齐。
- README 中的命令、目录和配置字段与当前仓库实际结构一致。
- README 不包含当前机器的 `localhost`、`127.0.0.1` 或私有测试地址作为可直接使用的生产配置。
