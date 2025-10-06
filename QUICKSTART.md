# 🚀 快速开始 - 5 分钟测试

> 目标：快速跑通工具链，看到一个可运行的 Web4 应用

---

## 📋 前置要求

```bash
# 1. 安装依赖
npm install

# 2. 配置钱包
cp .env.example .env
# 编辑 .env，填入 Solana 私钥（需要少量 SOL）
```

---

## ⚡ 三步测试

### 步骤 1：上传 Layout
```bash
node build.js project/layout.js
node upload.js project/layout.json --type=layout --tag=web4-test --version=1.0.0
```

**记录 Transaction ID** (示例: `Abcd1234...`)

---

### 步骤 2：上传 Title Widget
```bash
node build.js project/title.js
node upload.js project/title.json --type=title --tag=web4-test --version=1.0.0
```

**记录 Transaction ID** (示例: `Efgh5678...`)

---

### 步骤 3：配置并上传 HTML

编辑 `project/index.html`，找到配置部分：

```javascript
const APP_CONFIG = {
    layoutId: 'YOUR_LAYOUT_TXID',  // 🔥 填入步骤1的 Transaction ID
    appName: 'web4-test',
    owner: null
};
```

编辑 `project/layout.js`，找到 widget 加载部分：

```javascript
// 修改这一行，填入步骤2的 Transaction ID
await loadWidgetById('title-container', 'YOUR_TITLE_TXID');
```

重新构建和上传：

```bash
node build.js project/layout.js
node upload.js project/layout.json --type=layout --tag=web4-test --version=1.0.1

node upload.js project/index.html --version=1.0.0
```

---

## 🎉 测试结果

打开上传后的 HTML 链接（类似 `https://gateway.irys.xyz/...`）

**应该看到**：
- ✅ 深色主题页面（右上角有主题切换按钮）
- ✅ 标题 "Web4 Application"
- ✅ 三个特性图标（⚡ Fast, 🔒 Secure, 🌐 Decentralized）

**调试**：按 F12 打开控制台，查看日志

---

## 📝 快速命令参考

```bash
# 构建组件
node build.js project/{component}.js

# 上传组件
node upload.js project/{component}.json --type={type} --tag=web4-test --version={version}

# 上传 HTML
node upload.js project/index.html --version={version}

# 查询组件
node query.js --type={type} --tag=web4-test
node query.js --txid={transaction_id}
```

---

## 🐛 常见问题

**Q: Widget 加载失败？**
A: Layout 中使用 Transaction ID 直接加载（已在项目中配置）

**Q: 样式没有生效？**
A: 检查浏览器 F12 控制台是否有错误

**Q: 上传失败？**
A: 确认 .env 配置正确，钱包有足够 SOL

---

## 📚 下一步

✅ 测试成功？查看 [完整文档](./0_README.md) 了解：
- 如何创建自定义组件
- 完整的开发工作流
- AI Agent 使用指南
- 错误处理和调试技巧

---

**版本**: v2.0.0
**更新**: 2025-10-06
**工具**: Web4 CLI
