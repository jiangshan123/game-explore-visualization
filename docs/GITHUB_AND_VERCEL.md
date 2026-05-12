# 推送到自己的 GitHub 仓库

本地已完成 `git init` 与首次提交。你只需在 GitHub 上建空仓库，再执行下面的命令（把 URL 换成你的）。

## 1. 在 GitHub 新建仓库

1. 打开 https://github.com/new  
2. **Repository name** 自定（例如 `game-universe-navigator`）。  
3. 选 **Public** 或 **Private**。  
4. **不要**勾选 “Add a README” / “Add .gitignore”（避免与本地首次提交冲突）。  
5. 点 **Create repository**，复制页面上的 HTTPS 地址，例如：  
   `https://github.com/你的用户名/game-universe-navigator.git`

## 2. 在本机绑定远程并推送

在项目根目录打开终端（PowerShell），执行（请替换为你的仓库 URL）：

```powershell
git remote add origin https://github.com/你的用户名/你的仓库名.git
git branch -M main
git push -u origin main
```

若提示登录：按 GitHub 说明使用 **HTTPS + Personal Access Token**，或改用 **SSH**：

```powershell
git remote add origin git@github.com:你的用户名/你的仓库名.git
git push -u origin main
```

之后改代码：

```powershell
git add .
git commit -m "描述你的修改"
git push
```

## 3. 首次提交前若未配置 Git 用户名

若 `git commit` 报错，先执行一次（改成你的名字和邮箱）：

```powershell
git config --global user.name "你的名字"
git config --global user.email "你的邮箱@example.com"
```

---

# 用 Vercel 生成在线链接（给老师）

1. 打开 https://vercel.com ，用 GitHub 登录。  
2. **Add New → Project**，Import 你刚推送的仓库。  
3. **Framework Preset** 选 **Vite**（或自动识别）。  
4. **Build Command**：`pnpm run build`  
5. **Output Directory**：`dist`  
6. **Install Command**：留空或 `pnpm install`（有 `pnpm-lock.yaml` 时一般会识别）。  
7. Deploy 完成后，复制 **Production** 的 `https://xxx.vercel.app` 即可分享。
