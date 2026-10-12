# 添加项目与维护

## 创建

```sh
npm run new -- geometry-lab "几何实验室"
```

生成一个可提交文字和读取大屏的最小案例。ID 只能使用小写英文开头、数字和连字符，生成器不会覆盖同名项目。

## project.json

```json
{
  "id": "geometry-lab",
  "title": "几何实验室",
  "category": "exploration",
  "description": "拖动图形，记录自己的发现。",
  "subjects": ["数学"],
  "order": 100,
  "app": "index.html",
  "dashboard": "dashboard.html"
}
```

`id` 必须与目录名一致，两个页面入口必须存在，分类必须在 `site/categories.json` 中。`order` 越小越靠前；description 用于搜索和卡片。封面可选：在 `site/covers.js` 增加同 ID 的封面；不添加时显示分类默认图。

## 页面约定

- HTML 声明 UTF-8 和 viewport。
- 在案例脚本之前引入 `/config.js` 与 `/projects/shared/transport.js`。
- 使用 `fetch` 请求逻辑 QuickForm 任务；模板已包含示例。接入远程时在 taskMap 中映射同一个任务 ID。
- 优先使用相对路径。构建器兼容站内 `/projects/`、`/config.js` 和 `/index.html`；避免自行添加根路径依赖。
- 运行资源放在项目自身目录；共用库放 `projects/shared/`。保留第三方许可证和来源。
- 不把课堂真实名册、提交记录、密码、API 密钥、依赖目录、历史包和课件放进项目。
- 其他真实 AI 服务应由自己的服务端代理持有密钥。不要在网页中用 Base64“隐藏”密钥。

## 验证与提交

```sh
npm run check
npm test
npm run dev
```

在 `/QFDemo/` 预览新项目与大屏，确认提交和刷新后读取一致，再提交源码。不要提交 `dist/`，CI 会重新生成。

现有项目包含多种早期编写风格；建议逐个改进，避免为了统一框架同时重写全部教学交互。删除项目时删除对应目录，构建会自动从门户移除。
