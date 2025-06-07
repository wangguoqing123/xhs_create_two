# Coze API 配置说明

## 环境变量配置

请在 `.env.local` 文件中添加以下环境变量：

```bash
# Coze API Token (必需)
COZE_API_TOKEN=你的coze_api_token

# Coze 工作流 ID (可选，默认值已设置)
COZE_WORKFLOW_ID=7511959723135762472
```

## 获取 Coze API Token

1. 访问 [Coze 平台](https://www.coze.cn)
2. 登录你的账号
3. 进入 API 管理页面
4. 创建或复制你的 API Token
5. 将 Token 添加到 `.env.local` 文件中

## 工作流 ID 说明

- `COZE_WORKFLOW_ID`: 小红书笔记解析工作流的 ID
- 默认值：`7511959723135762472`
- 这是用于解析小红书笔记内容的专用工作流

## 使用说明

1. 配置好环境变量后，重启应用
2. 在爆文改写页面中，首先配置小红书 Cookie
3. 输入小红书笔记链接
4. 点击"开始解析"按钮
5. 系统将自动调用 Coze API 解析笔记内容

## Cookie 配置

为了成功解析小红书笔记，你需要：

1. 在浏览器中登录小红书网站
2. 按 F12 打开开发者工具
3. 在 Network 选项卡中刷新页面
4. 找到任意请求，复制 Headers 中的完整 Cookie 值
5. 在应用中点击"配置 Cookie"按钮
6. 将 Cookie 粘贴到输入框中并保存

## 注意事项

- Cookie 信息会安全地存储在本地浏览器中
- API Token 只在服务器端使用，客户端无法访问
- 请定期更新 Cookie 以确保解析功能正常工作 