# 部署与数据配置

## GitHub Pages

1. 将源码推送到公开仓库 `QFDemo` 的 `main` 分支。
2. 在仓库 Settings → Pages → Build and deployment 中选择 **GitHub Actions**。
3. 进入 Actions，运行 `Check and deploy Pages`，或再次推送 `main`。
4. 工作流通过后，部署地址显示在运行详情的 `github-pages` 环境中。

工作流先验证再上传 `dist/`；PR 只检查、不发布。源码中的站内绝对资源路径会在构建时转换成相对路径，因此同一份产物支持域名根目录与 `/QFDemo/`。

Pages 只托管静态文件；默认本地数据模式无需服务器与账号。若组织策略禁用 Actions / Pages，需要仓库管理员解除对应限制。

## 静态托管与打包

```sh
npm ci
npm run check
npm test
npm run build
```

发布 **dist 目录内的内容**。它不包含源文档、测试或项目清单。Nginx、对象存储、Netlify、Cloudflare Pages 等静态服务均可使用；不要配置把所有缺失资源都重写为首页的规则。

Windows 打包：

```powershell
Compress-Archive -Path .\dist\* -DestinationPath .\qfdemo-site.zip -Force
```

## 本地演示模式

`config.example.json` 中的默认模式是 `local`。数据适配器先于案例代码加载：

- JSON / FormData 提交存入当前站点的 localStorage。
- 附件存入 IndexedDB，在重新打开大屏时恢复为 Blob URL。
- 案例任务分别存储；同一浏览器、同一部署路径下可以读取对应应用与大屏的数据。
- 文言文项目自动提供 10 个虚构体验者，输入序号 1–10 进入。
- 原有 QuickForm API 请求与页面退出提交不会发送到原工作坊服务。
- 顶部始终提示当前模式；页面的“保存成功”不代表上传到服务器。

本地模式用于个人演示，不适合多人共享收集。浏览器容量限制、无痕模式或清除站点数据可能导致数据丢失。没有真实身份认证。

## 连接自己的 QuickForm

将 `config.example.json` 复制为 `config.local.json`，填写：

```json
{
  "mode": "remote",
  "apiBase": "https://your-quickform.example",
  "taskMap": {
    "899xSEVKEHH": "你的音频任务ID",
    "6qzzwNKGDOU": "你的面积任务ID",
    "dIOP6U6PcVF": "你的文言作答任务ID",
    "g06toLheaUU": "你的文言名册任务ID"
  }
}
```

以上原 ID 只是兼容现有页面的逻辑标识，不是凭据。其他案例的源 ID 见其 `window.CASE.tasks` 配置；多任务项目需逐一映射。没有映射的任务会报错，不会自动回落到旧服务。

然后重新 `npm run build`。`config.local.json` 不进 Git；构建时会生成公开的 `dist/config.js`，**不得在其中放密钥或管理员密码**。默认 GitHub 工作流使用 local 模式；需要远程模式时，在工作流的构建步骤前从仓库变量生成上述公开配置，或将审查过的非敏感配置作为默认配置提交。

服务端需兼容：

| 请求 | 约定 |
| --- | --- |
| `POST /api/<task>` | 接受 JSON 和 multipart/form-data，返回成功状态、提交 ID；有附件时返回 attachment |
| `GET /api/<task>/all` | 返回 `{"submissions":[...]}` |
| `GET /api/<task>/count` | 返回 `{"count":0}` |
| `/static/uploads/<task>/<file>` | 提供已提交附件；attachment 可为路径字符串或数组 |
| `/showcase/<task>` | 可选的只读任务记录页面 |

服务需允许部署站点 Origin 的 CORS 和 OPTIONS 请求。适配器不携带跨域 Cookie。文言名册使用 `kind: "roster"`、`version` 和 `members` 数组（每项含 `serial`、`name`、`member_id`）。

后台的部署、访问控制、附件校验、数据保存策略由自有 QuickForm 服务负责。本次未用新的生产服务器做远程端到端验证。

## Docker

```sh
docker build -t qfdemo .
docker run --rm -p 8080:80 qfdemo
```

镜像默认 local 模式。可以把独立生成的公开 `config.js` 只读挂载到 `/usr/share/nginx/html/config.js` 切换到自有服务；不要把密钥写进前端配置。
