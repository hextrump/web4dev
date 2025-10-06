# Web4 CLI - AI Agent 开发指南

> **目标受众**：AI Agent（如 Claude Code）
> **用途**：使用去中心化存储（Irys）构建 Web4 应用的完整工作流程

---

## 📖 核心概念

### Web4 是什么？

**Web4 = Web3 + 去中心化存储**

- **Web2**：中心化（AWS、GCP、Vercel）→ 需要授权、账户、信用卡
- **Web4**：去中心化（Irys、Arweave）→ 无需授权，只需钱包，永久存储

### 为什么 AI Agent 需要 Web4？

传统云服务的问题：
- ❌ 需要人类提供 API Key
- ❌ 需要授权和账户管理
- ❌ 数据可能被删除或修改

Web4 的优势：
- ✅ AI Agent 自主上传（只需钱包私钥）
- ✅ 永久存储，不可篡改
- ✅ 低成本（~0.000001 SOL per file）
- ✅ 全球 CDN 访问

---

## 🎯 应用场景

### 案例：SciBox - 科学论文去中心化存储

**需求**：
1. 科学家上传论文 PDF
2. AI 提取内容并生成结构化数据
3. 构建可搜索的论文库界面
4. 所有内容永久可访问

**实现**：
- PDF 上传到 Irys → 获得永久链接
- AI 提取元数据（标题、作者、摘要）→ 存储为 JSON
- 构建 Web4 页面展示论文库
- 用户通过 Transaction ID 访问任意论文

---

## 🏗️ 架构设计

### 组件分层

```
┌─────────────────────────────────────┐
│  index.html (入口页面)               │  ← 用户访问的 URL
│  - 配置 layoutId                     │
│  - 提供 Console 日志                 │
│  - 动态加载 Layout                   │
└──────────────┬──────────────────────┘
               │
               ↓
┌─────────────────────────────────────┐
│  Layout (页面骨架)                   │
│  - 主题切换                          │
│  - 容器结构                          │
│  - Widget 加载逻辑                   │
└──────────────┬──────────────────────┘
               │
               ↓
┌─────────────────────────────────────┐
│  Widgets (功能模块)                  │
│  - Title Widget                      │
│  - Content Widget                    │
│  - Footer Widget                     │
│  - ...                               │
└─────────────────────────────────────┘
```

### 数据流

```
1. 开发阶段：
   Component.js → build.js → Component.json → upload.js → Irys Network

2. 运行阶段：
   User → index.html → Layout (fetch by TXID) → Widgets (fetch by TXID) → Render
```

---

## 🛠️ 工具链

### 1. build.js - 组件构建器

**功能**：将 `.js` 组件转换为 `.json` 格式

```bash
node build.js project/layout.js
# 输出: project/layout.json
```

**组件格式**：
```javascript
const widget = {
    metadata: {
        name: 'Component Name',
        version: '1.0.0',
        description: 'Component description'
    },
    html: '...', // 或 ['...'].join('\n')
    css: '...',
    js: '...'
};
module.exports = { widget };
```

---

### 2. upload.js - 上传到 Irys

**功能**：将文件上传到 Irys 网络并打标签

```bash
# 上传 HTML
node upload.js project/index.html --version=1.0.0

# 上传组件
node upload.js project/layout.json --type=layout --tag=web4-test --version=1.0.0
```

**标签规则**：
- HTML: `Content-Type`, `App-Name`, `Version`
- 组件: `Content-Type`, `{tag}`, `Version`
  - 例如: `web4-test: layout`, `Version: 1.0.0`

**输出**：
- Transaction ID (永久唯一标识)
- 访问链接: `https://gateway.irys.xyz/{TXID}`
- 自动保存到 `upload-history.json`

---

### 3. query.js - 查询组件

**功能**：通过 GraphQL 查询或直接获取组件

```bash
# 通过标签查询最新版本
node query.js --type=layout --tag=web4-test

# 查询指定版本
node query.js --type=title --tag=web4-test --version=1.0.0

# 直接获取内容
node query.js --txid=ABC123...
```

**注意**：GraphQL 查询需要等待 Irys 索引（通常几分钟），但 TXID 查询立即可用。

---

## 🚀 开发工作流

### AI Agent 决策树

```
用户请求
  │
  ├─ "创建新应用"
  │   → 流程A：完整开发流程
  │
  ├─ "添加新功能"
  │   → 流程B：创建新 Widget
  │
  ├─ "修改样式"
  │   → 流程C：更新 Layout/Widget
  │
  └─ "调试问题"
      → 流程D：错误诊断
```

---

### 流程 A：创建新应用（完整流程）

#### 步骤 1：规划应用

**AI Agent 需要确定**：
1. 应用名称（appName）- 例如：`sci-paper`, `my-blog`
2. 需要哪些功能模块（widgets）
3. 页面结构（layout）

**示例对话**：
```
User: 创建一个科学论文展示应用
Agent:
  - appName: sci-paper
  - Widgets: title, paper-list, search-bar, footer
  - Layout: 左侧搜索，右侧论文列表
```

---

#### 步骤 2：创建并上传 Layout

**操作**：
```bash
# 1. 创建 project/layout.js
# 2. 构建
node build.js project/layout.js
# 3. 上传
node upload.js project/layout.json --type=layout --tag=sci-paper --version=1.0.0
```

**记录**：保存 Layout Transaction ID

---

#### 步骤 3：创建并上传 Widgets

**对每个 widget 重复**：
```bash
node build.js project/{widget}.js
node upload.js project/{widget}.json --type={widget} --tag=sci-paper --version=1.0.0
```

**记录**：保存所有 Widget Transaction IDs

---

#### 步骤 4：配置 Layout 加载 Widgets

**编辑 `project/layout.js`**：
```javascript
js: [
    'async function initLayout() {',
    '    // 使用 Transaction ID 直接加载',
    '    await loadWidgetById("title-container", "TITLE_TXID");',
    '    await loadWidgetById("list-container", "LIST_TXID");',
    '}'
].join('\n')
```

**重新上传 Layout**：
```bash
node build.js project/layout.js
node upload.js project/layout.json --type=layout --tag=sci-paper --version=1.0.1
```

---

#### 步骤 5：配置并上传 HTML 入口

**编辑 `project/index.html`**：
```javascript
const APP_CONFIG = {
    layoutId: 'LAYOUT_TXID_V1.0.1',  // 使用最新版本的 Layout
    appName: 'sci-paper',
    owner: null
};
```

**上传**：
```bash
node upload.js project/index.html --version=1.0.0
```

---

#### 步骤 6：测试

**打开 HTML Transaction ID 链接**：
```
https://gateway.irys.xyz/{HTML_TXID}
```

**按 F12 查看控制台日志**：
- ✅ Layout 加载成功
- ✅ Widget 加载成功
- ❌ 如有错误，进入流程D

---

### 流程 B：添加新 Widget

**场景**：用户要求添加新功能

```bash
# 1. 创建新 widget
# project/new-widget.js

# 2. 构建并上传
node build.js project/new-widget.js
node upload.js project/new-widget.json --type=new-widget --tag={appName} --version=1.0.0

# 3. 更新 Layout（添加加载逻辑）
# 编辑 project/layout.js，添加：
# await loadWidgetById('new-container', 'NEW_WIDGET_TXID');

# 4. 重新上传 Layout
node build.js project/layout.js
node upload.js project/layout.json --type=layout --tag={appName} --version={next_version}

# 5. 更新 HTML（指向新 Layout）
# 编辑 project/index.html，更新 layoutId
node upload.js project/index.html --version={next_version}
```

---

### 流程 C：修改现有组件

**场景**：用户要求修改样式或功能

```bash
# 1. 修改组件文件
# 编辑 project/{component}.js

# 2. 增加版本号
# metadata.version: '1.0.0' → '1.0.1'

# 3. 重新构建并上传
node build.js project/{component}.js
node upload.js project/{component}.json --type={type} --tag={appName} --version=1.0.1

# 4. 如果是 Widget，更新 Layout 中的 TXID
# 如果是 Layout，更新 HTML 中的 layoutId

# 5. 重新上传依赖的父组件
```

---

### 流程 D：错误诊断和修复

#### 常见错误矩阵

| 错误信息 | 原因 | 解决方案 | 命令 |
|---------|------|---------|------|
| `Widget not found: {type}` | GraphQL 查询失败 | 使用 Transaction ID 直接加载 | 修改 Layout 使用 `loadWidgetById(id, txid)` |
| `HTTP 404` | Transaction ID 错误 | 检查 TXID 是否正确 | `cat upload-history.json` |
| `Failed to load layout` | layoutId 配置错误 | 检查 HTML 中的 layoutId | `node query.js --txid={LAYOUT_TXID}` |
| `No balance` | SOL 不足 | 充值钱包 | 检查 `.env` 中的私钥对应地址 |
| `Permission denied` | 私钥错误 | 检查 `.env` 配置 | `cat .env` |
| CSS 不生效 | 样式未加载 | 检查 F12 控制台 | 查看 Network 标签 |
| JS 报错 | 语法错误或逻辑错误 | 查看控制台错误堆栈 | 修复代码后重新上传 |

---

#### 调试步骤

1. **查看控制台日志**（F12）
   - 日志格式：`[时间] [级别] 信息`
   - 查找 ❌ 或 `error` 关键字

2. **检查网络请求**（F12 Network）
   - 查看哪些资源加载失败
   - 检查 Transaction ID 是否正确

3. **验证上传历史**
   ```bash
   cat upload-history.json | grep -A 5 "{component}"
   ```

4. **查询组件内容**
   ```bash
   node query.js --txid={TXID}
   ```

5. **本地测试**
   - 打开本地 `project/index.html`
   - 修改 layoutId 指向线上 Layout TXID
   - 查看是否能正常加载

---

## 📋 AI Agent 工作清单

### 开始新项目前

- [ ] 确认 `.env` 已配置
- [ ] 确认钱包有足够 SOL（~0.01 SOL）
- [ ] 运行 `npm install`
- [ ] 询问用户：应用名称（appName）
- [ ] 询问用户：需要哪些功能

### 创建每个组件时

- [ ] 使用 `metadata` 结构
- [ ] 使用数组 + `join('\n')` 格式化代码
- [ ] 添加详细注释
- [ ] 使用语义化版本号

### 上传前

- [ ] 运行 `node build.js` 检查语法
- [ ] 确认版本号递增
- [ ] 确认标签正确（appName 一致）

### 上传后

- [ ] 记录 Transaction ID
- [ ] 更新依赖的父组件（如有）
- [ ] 测试访问链接
- [ ] 检查 F12 控制台

### 测试时

- [ ] 打开浏览器访问 HTML TXID
- [ ] 按 F12 查看控制台
- [ ] 测试主题切换
- [ ] 测试所有功能模块
- [ ] 检查响应式布局（缩放浏览器窗口）

---

## 🎨 最佳实践

### 组件设计原则

1. **独立性**：每个 Widget 应该独立工作，不依赖其他 Widget
2. **复用性**：使用 CSS 变量（`:root`）实现主题
3. **清晰性**：添加 metadata 和注释
4. **一致性**：使用相同的命名规范和代码风格

### 代码风格

```javascript
// ✅ 推荐：使用数组 + join
html: [
    '<div class="container">',
    '    <h1>Title</h1>',
    '</div>'
].join('\n')

// ❌ 不推荐：单行字符串（难以维护）
html: '<div class="container"><h1>Title</h1></div>'
```

### 版本管理策略

- **Patch** (1.0.0 → 1.0.1): 修复 bug、小改动
- **Minor** (1.0.0 → 1.1.0): 添加新功能
- **Major** (1.0.0 → 2.0.0): 重大变更、破坏性修改

### 标签命名规范

- `appName`：小写字母 + 连字符，例如 `sci-paper`, `my-blog`
- `type`：组件类型，例如 `layout`, `title`, `footer`
- `Version`：语义化版本，例如 `1.0.0`

---

## 🔍 高级技巧

### 1. 使用 Transaction ID 直接加载（推荐）

**优点**：
- ✅ 立即可用，无需等待索引
- ✅ 明确的版本控制
- ✅ 不会因为上传新版本而自动更新

**示例**：
```javascript
async function loadWidgetById(containerId, txid) {
    const response = await fetch(`https://gateway.irys.xyz/${txid}`);
    const widget = await response.json();
    applyWidget(containerId, widget);
}
```

---

### 2. 使用 GraphQL 动态查询（可选）

**优点**：
- ✅ 自动加载最新版本
- ✅ 支持多版本管理

**缺点**：
- ❌ 需要等待 Irys 索引
- ❌ 可能意外加载不稳定版本

**示例**：
```javascript
const query = `
    query GetLatest {
        transactions(
            tags: [
                { name: "web4-test", values: ["title"] },
                { name: "Version", values: ["1.0.0"] }
            ],
            first: 1,
            order: DESC
        ) {
            edges {
                node { id }
            }
        }
    }
`;
```

---

### 3. 本地开发与测试

**快速迭代流程**：
1. 本地修改 `project/component.js`
2. `node build.js project/component.js`
3. 打开 `project/component.json` 检查输出
4. 确认无误后再上传

**本地 HTML 测试**：
- 直接在浏览器打开 `project/index.html`
- layoutId 指向线上已上传的 Layout
- 可以快速测试 HTML 结构和逻辑

---

### 4. 多环境管理

**开发环境**：
- appName: `my-app-dev`
- 频繁上传测试

**生产环境**：
- appName: `my-app`
- 只上传稳定版本

---

## 📚 示例对话流程

### 示例 1：用户要求创建新应用

```
User: 帮我创建一个展示科学论文的 Web4 应用

Agent 思考：
1. 确定 appName: sci-paper
2. 需要组件：title, paper-list, search-bar
3. 流程：A（完整流程）

Agent 执行：
1. 创建 layout.js（包含容器结构和主题切换）
2. node build.js + node upload.js → 获得 LAYOUT_TXID
3. 创建 title.js, paper-list.js, search-bar.js
4. 依次上传，记录 TXIDs
5. 更新 layout.js 添加 widget 加载逻辑
6. 重新上传 layout → LAYOUT_TXID_V2
7. 配置 index.html → layoutId = LAYOUT_TXID_V2
8. 上传 index.html → HTML_TXID
9. 返回给用户：https://gateway.irys.xyz/{HTML_TXID}

Agent 回复：
✅ 应用已创建！访问链接：https://gateway.irys.xyz/{HTML_TXID}
包含的功能：标题、论文列表、搜索栏
按 F12 可查看加载日志
```

---

### 示例 2：用户要求添加新功能

```
User: 给应用添加一个评论区

Agent 思考：
1. 当前 appName: sci-paper
2. 需要新 widget: comment-section
3. 流程：B（添加 widget）

Agent 执行：
1. 创建 project/comment-section.js
2. node build.js + node upload.js → COMMENT_TXID
3. 读取当前 layout.js
4. 添加：await loadWidgetById('comment-container', 'COMMENT_TXID');
5. 增加 layout 版本号：1.0.1 → 1.0.2
6. 重新上传 layout → LAYOUT_TXID_V3
7. 更新 index.html → layoutId = LAYOUT_TXID_V3
8. 上传 index.html → HTML_TXID_V2

Agent 回复：
✅ 评论区已添加！新版本链接：https://gateway.irys.xyz/{HTML_TXID_V2}
```

---

### 示例 3：用户报告错误

```
User: 页面显示 "Widget not found: paper-list"

Agent 思考：
1. 错误类型：GraphQL 查询失败
2. 流程：D（错误诊断）
3. 解决方案：改用 Transaction ID 直接加载

Agent 执行：
1. 检查 upload-history.json 找到 paper-list 的 TXID
2. 修改 layout.js：
   from: await window.loadWidget('list-container', 'paper-list', {...})
   to:   await loadWidgetById('list-container', 'PAPER_LIST_TXID')
3. 重新上传 layout 和 HTML

Agent 回复：
✅ 已修复！问题原因是 Irys 索引延迟，现在改用直接加载。
新版本：https://gateway.irys.xyz/{HTML_TXID_V3}
```

---

## 🎯 AI Agent 成功标准

完成任务后，确认：

- ✅ 用户可以访问一个可用的 Web4 应用
- ✅ 所有功能正常工作
- ✅ F12 控制台无错误
- ✅ 主题切换正常
- ✅ 所有 Transaction IDs 已记录
- ✅ `upload-history.json` 已更新

---

## 📞 支持资源

- **快速测试**：参考 [QUICKSTART.md](./QUICKSTART.md)
- **上传历史**：查看 `upload-history.json`
- **参考实现**：查看 `ref/` 目录下的示例组件
- **Irys 文档**：https://docs.irys.xyz/

---

**版本**: v2.0.0
**更新时间**: 2025-10-06
**工具**: Web4 CLI
**设计目标**: 让 AI Agent 能够自主构建和部署去中心化 Web4 应用
