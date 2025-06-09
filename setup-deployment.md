# 快速设置 GitHub 自动部署

## 🚀 推荐方式：Vercel Dashboard 自动部署

这是最简单、最可靠的方式，只需要几分钟即可完成设置。

### 步骤 1：连接 GitHub 仓库

1. 访问 [vercel.com](https://vercel.com) 并登录
2. 点击 "New Project"
3. 选择您的 GitHub 仓库 `xhs_create_two`
4. 点击 "Import"

### 步骤 2：配置项目

Vercel 会自动检测到这是一个 Next.js 项目，默认配置通常是正确的：

- **Framework Preset**: Next.js ✅
- **Root Directory**: `./` ✅
- **Build Command**: `npm run build` ✅
- **Output Directory**: `.next` ✅
- **Install Command**: `npm ci` ✅

### 步骤 3：设置环境变量

在部署之前，点击 "Environment Variables" 并添加：

```bash
COZE_API_TOKEN=你的coze_api_token
OPENROUTER_API_KEY=你的openrouter_api_key
COZE_WORKFLOW_DETAIL_ID=7511959723135762472
```

### 步骤 4：部署

点击 "Deploy" 按钮，等待部署完成。

## ✨ 自动部署已启用

设置完成后，以下操作会自动触发部署：

- ✅ 推送代码到 `main` 分支 → 自动部署到生产环境
- ✅ 创建 Pull Request → 自动创建预览部署
- ✅ 合并 Pull Request → 自动部署到生产环境

## 🔧 高级选项：GitHub Actions

如果您需要更多控制权，可以使用 GitHub Actions：

### 1. 获取 Vercel 项目信息

```bash
# 安装 Vercel CLI
npm install -g vercel

# 登录并链接项目
vercel login
vercel link

# 获取项目信息
cat .vercel/project.json
```

### 2. 设置 GitHub Secrets

在 GitHub 仓库设置中添加：

- `VERCEL_TOKEN` - 从 [Vercel Settings](https://vercel.com/account/tokens) 获取
- `VERCEL_ORG_ID` - 从 `.vercel/project.json` 获取
- `VERCEL_PROJECT_ID` - 从 `.vercel/project.json` 获取

### 3. 推送代码

GitHub Actions 会自动运行部署流程。

## 📋 检查清单

部署前请确认：

- [ ] 代码已推送到 GitHub
- [ ] 环境变量已在 Vercel 中设置
- [ ] 项目可以本地构建成功 (`npm run build`)
- [ ] 所有依赖都在 `package.json` 中

## 🆘 常见问题

**Q: 部署失败怎么办？**
A: 检查 Vercel Dashboard 中的部署日志，通常是环境变量或依赖问题。

**Q: 如何查看部署状态？**
A: 在 Vercel Dashboard 的 "Deployments" 页面可以看到所有部署记录。

**Q: 如何回滚到之前的版本？**
A: 在 Vercel Dashboard 中找到之前的部署，点击 "Promote to Production"。

## 🎉 完成！

设置完成后，您的应用将在每次推送代码时自动部署。访问 Vercel 提供的 URL 即可查看您的应用。 