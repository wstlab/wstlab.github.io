# QFDemo

60 个可独立打开的教学交互案例，配有分类检索门户、应用页面和数据大屏。原生 HTML / CSS / JavaScript，多项目共用轻量脚本，构建不依赖第三方 npm 包。

**默认即可部署体验。** 数据保存到当前浏览器，不连接原工作坊的数据服务。需要全班跨设备收集时，请配置自己的 QuickForm 服务，见 [部署说明](docs/DEPLOYMENT.md)。

## 本地运行

需要 Node.js 22 或更高版本：

```sh
npm ci
npm run dev
```

打开终端提示的本地地址。修改源码后重启预览；不要直接双击 HTML 文件。

```sh
npm run check  # 构建、项目配置、页面资源路径、JS 语法与常见凭据模式检查
npm test      # 数据隔离与接口适配测试
npm run build # 生成 dist/，将目录内文件发布到静态托管
```

## 目录

```text
projects/
  audio/           # 声音作品上传与评价
  area/            # 面积测评
  classical/       # 文言文研读
  case-04/ ...     # 其他教学案例，保留稳定 ID
  shared/          # 数据适配、通用大屏、样式、第三方浏览器运行库
site/              # 门户页面、分类、封面
scripts/           # 构建、检查、预览、新增项目
tests/             # 数据适配回归测试
docs/              # 部署、维护、整理范围、案例目录
.github/workflows/ # 自动检查和 GitHub Pages 发布
```

每个案例由 `project.json` 描述标题、分类、学科、排序和页面入口。构建时自动生成门户目录；无需手工维护另一份项目列表。

## 新增项目

```sh
npm run new -- my-demo "我的教学案例"
npm run check
```

编辑生成的 `projects/my-demo/` 即可。详细字段和数据调用见 [新增项目指南](docs/ADDING_PROJECTS.md)。

## 部署与使用范围

- **GitHub Pages**：将仓库 Pages 来源设为 GitHub Actions，推送 `main` 自动构建发布；支持 `/QFDemo/` 子路径。
- **其他静态平台**：构建命令 `npm run build`，发布目录 `dist`。
- **Docker**：`docker build -t qfdemo .`，再执行 `docker run --rm -p 8080:80 qfdemo`。
- 本地演示记录与附件不跨设备同步；清除浏览器站点数据会删除记录。附件存入 IndexedDB，单文件上限 10 MB。
- 部分地图、字体、AI 模型和浏览器语音功能仍需网络或设备支持；摄像头、麦克风需要 HTTPS 或 localhost 与浏览器授权。
- 本仓库是教学示例集合，不包含完整 QuickForm 管理后台。页面原有“教师端 / 服务器回执”等文字在本地模式下由顶部提示明确解释。

## 文档

- [案例目录](docs/CATALOG.md)
- [部署与自有 QuickForm 接入](docs/DEPLOYMENT.md)
- [添加项目与维护](docs/ADDING_PROJECTS.md)
- [整理范围与验收记录](docs/MIGRATION.md)
- [第三方资源说明](THIRD_PARTY_NOTICES.md)

公开仓库不等于对全部原始素材授予统一开源许可。保留原始代码中的作者与第三方许可说明；本次整理没有替原作者新增统一许可证。
