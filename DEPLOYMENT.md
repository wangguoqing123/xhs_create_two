# GitHub 自动部署到 Vercel 设置指南

## 方法一：通过 Vercel Dashboard 连接 GitHub（推荐）

这是最简单的方法，Vercel 会自动处理所有部署流程。

### 步骤：

1. **登录 Vercel Dashboard**
   - 访问 [vercel.com](https://vercel.com)
   - 使用您的 GitHub 账号登录

2. **导入 GitHub 仓库**
   - 点击 "New Project"
   - 选择 "Import Git Repository"
   - 选择您的 GitHub 仓库
   - 点击 "Import"

3. **配置项目设置**
   - Project Name: `xhs-create-two`
   - Framework Preset: `Next.js`
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm ci`

4. **部署**
   - 点击 "Deploy"
   - 等待部署完成

### 自动部署触发条件：
- 推送到 `main` 或 `master` 分支时自动部署
- 创建 Pull Request 时自动创建预览部署
- 合并 Pull Request 时自动部署到生产环境

## 方法二：使用 GitHub Actions（高级用户）

如果您需要更多控制权，可以使用 GitHub Actions。

### 设置步骤：

1. **获取 Vercel 令牌**
   - 访问 [Vercel Settings](https://vercel.com/account/tokens)
   - 创建新的令牌
   - 复制令牌值

2. **获取项目信息**
   ```bash
   # 安装 Vercel CLI
   npm i -g vercel
   
   # 登录并链接项目
   vercel login
   vercel link
   
   # 获取项目 ID 和组织 ID
   cat .vercel/project.json
   ```

3. **设置 GitHub Secrets**
   - 在 GitHub 仓库中，进入 Settings > Secrets and variables > Actions
   - 添加以下 secrets：
     - `VERCEL_TOKEN`: 您的 Vercel 令牌
     - `VERCEL_ORG_ID`: 组织 ID
     - `VERCEL_PROJECT_ID`: 项目 ID

4. **推送代码**
   - GitHub Actions 会自动运行部署流程

## 环境变量设置

您的应用需要以下环境变量才能正常运行：

### 必需的环境变量：

1. **COZE_API_TOKEN** - Coze API 令牌
2. **OPENROUTER_API_KEY** - OpenRouter API 密钥
3. **COZE_WORKFLOW_DETAIL_ID** - Coze 工作流 ID（可选，有默认值）

### 在 Vercel 中设置环境变量：

1. 在 Vercel Dashboard 中进入项目设置
2. 点击 "Environment Variables"
3. 添加以下环境变量：
   ```
   COZE_API_TOKEN=你的coze_api_token
   OPENROUTER_API_KEY=你的openrouter_api_key
   COZE_WORKFLOW_DETAIL_ID=7511959723135762472
   ```
4. 选择环境：Production, Preview, Development
5. 点击 "Save"
6. 重新部署项目

### 获取 API 密钥：

**Coze API Token:**
1. 访问 [Coze 平台](https://www.coze.cn)
2. 登录账号并进入 API 管理页面
3. 创建或复制 API Token

**OpenRouter API Key:**
1. 访问 [OpenRouter](https://openrouter.ai)
2. 注册账号并获取 API 密钥

## 自定义域名

1. 在 Vercel Dashboard 中进入项目设置
2. 点击 "Domains"
3. 添加您的自定义域名
4. 按照提示配置 DNS 记录

## 故障排除

### 常见问题：

1. **构建失败**
   - 检查 `package.json` 中的构建脚本
   - 确保所有依赖都在 `dependencies` 中

2. **环境变量问题**
   - 确保在 Vercel Dashboard 中正确设置了环境变量
   - 检查变量名是否正确

3. **路由问题**
   - Next.js App Router 应该自动工作
   - 检查 `vercel.json` 配置

## 监控和日志

- 在 Vercel Dashboard 中查看部署日志
- 使用 Vercel Analytics 监控性能
- 设置错误监控和告警

## 支持

如果遇到问题，可以：
- 查看 [Vercel 文档](https://vercel.com/docs)
- 访问 [Vercel 社区](https://github.com/vercel/vercel/discussions)
- 联系 Vercel 支持团队 