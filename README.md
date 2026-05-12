# Game Universe Navigator

基于 Steam 游戏数据的 **信息可视化** 原型：时间轴筛选、类型与首字母过滤、游戏网格浏览，以及详情页中的 **相似关系力导向图**。

设计参考：[Figma - Game Universe Navigator Design](https://www.figma.com/design/oIIu9m7fbMVVxtDIpxBQfA/Game-Universe-Navigator-Design)

## 本地运行

推荐使用 **pnpm**：

```bash
pnpm install
pnpm run dev
```

或使用 npm：

```bash
npm install
npm run dev
```

浏览器访问终端里提示的本地地址（一般为 `http://localhost:5173`）。

构建生产包：

```bash
pnpm run build
```

产物在 `dist/`。

## 推送到 GitHub 与 Vercel 部署

见 **[docs/GITHUB_AND_VERCEL.md](./docs/GITHUB_AND_VERCEL.md)**：绑定你自己的远程仓库、`git push`，以及用 Vercel 连接仓库生成分享链接的步骤。

## 数据

- 游戏数据来自仓库根目录的 `steam_games_2026.csv`（由 `src/app/data/gameData.ts` 导入并限制条数）。
