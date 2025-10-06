# 🚀 Web4Dev - AI Agent Development Toolkit

> **Decentralized Web4 application development toolkit for AI Agents**

Build and deploy Web4 applications using Irys decentralized storage without authorization, accounts, or credit cards.

---

## ✨ Features

- 🤖 **AI Agent Friendly**: Designed for AI agents (Claude Code, etc.) to autonomously develop Web4 apps
- 🌐 **Decentralized Storage**: Upload to Irys network for permanent, immutable storage
- 💰 **Low Cost**: ~0.000001 SOL per file upload
- 🔧 **Simple Toolchain**: Build, upload, query - three tools for complete workflow
- 📦 **Modular Components**: Widget-based architecture with dynamic loading
- 🎨 **Professional Templates**: Pre-built layout and widget examples

---

## 🎯 What is Web4?

**Web4 = Web3 + Decentralized Storage**

### Traditional Web2 (AWS, GCP, Vercel)
- ❌ Requires API keys and authorization
- ❌ Needs credit card and account management
- ❌ Data can be deleted or modified
- ❌ AI agents cannot operate autonomously

### Web4 (Irys, Arweave)
- ✅ No authorization needed (just a wallet)
- ✅ Permanent, immutable storage
- ✅ Low cost (~0.000001 SOL per file)
- ✅ AI agents can deploy autonomously

---

## 🚀 Quick Start

### 1. Install

```bash
npm install
cp .env.example .env
# Edit .env and add your Solana wallet private key
```

### 2. Test the Toolkit (5 minutes)

```bash
# Build and upload layout
node build.js project/layout.js
node upload.js project/layout.json --type=layout --tag=web4-test --version=1.0.0

# Build and upload title widget
node build.js project/title.js
node upload.js project/title.json --type=title --tag=web4-test --version=1.0.0

# Configure and upload HTML
# Edit project/index.html and project/layout.js with transaction IDs
node build.js project/layout.js
node upload.js project/layout.json --type=layout --tag=web4-test --version=1.0.1
node upload.js project/index.html --version=1.0.0
```

### 3. Visit Your App

Open the HTML transaction URL (e.g., `https://gateway.irys.xyz/YOUR_TXID`)

You should see:
- ✅ Dark theme page with theme toggle
- ✅ Title "Web4 Application"
- ✅ Three feature icons (⚡ Fast, 🔒 Secure, 🌐 Decentralized)

Press F12 to see console logs.

---

## 📚 Documentation

- **[QUICKSTART.md](./QUICKSTART.md)** - 5-minute quick test guide
- **[0_README.md](./0_README.md)** - Complete AI Agent development guide
  - Decision trees for AI agents
  - Complete workflows (create, modify, debug)
  - Error handling matrix
  - Best practices and examples

---

## 🛠️ Toolkit

### build.js - Component Builder
Convert `.js` components to `.json` format

```bash
node build.js project/layout.js
# Output: project/layout.json
```

### upload.js - Irys Uploader
Upload files to Irys network with tags

```bash
# Upload HTML
node upload.js project/index.html --version=1.0.0

# Upload component
node upload.js project/layout.json --type=layout --tag=my-app --version=1.0.0
```

### query.js - Component Query
Query components via GraphQL or transaction ID

```bash
# Query by tags
node query.js --type=layout --tag=my-app

# Query by transaction ID
node query.js --txid=ABC123...
```

---

## 📦 Project Structure

```
web4dev/
├── build.js              # Component builder
├── upload.js             # Irys uploader
├── query.js              # Component query tool
├── package.json          # Dependencies
├── .env.example          # Environment template
├── 0_README.md           # Complete AI Agent guide
├── QUICKSTART.md         # Quick start guide
├── project/              # Example project
│   ├── index.html        # Entry HTML page
│   ├── layout.js         # Layout component
│   └── title.js          # Title widget
└── ref/                  # Reference implementations
    ├── 00_layout.js
    ├── 01_title_widget.js
    └── refindex.html
```

---

## 🎨 Component Format

```javascript
const widget = {
    metadata: {
        name: 'Component Name',
        version: '1.0.0',
        description: 'Component description'
    },
    html: [
        '<div class="container">',
        '    <h1>Title</h1>',
        '</div>'
    ].join('\n'),
    css: '...',
    js: '...'
};

module.exports = { widget };
```

---

## 🌟 Use Cases

### SciBox - Scientific Paper Archive
- Upload PDF papers to Irys
- AI extracts metadata (title, author, abstract)
- Build searchable paper library interface
- All content permanently accessible

### Personal Blog
- Create blog posts as widgets
- Layout with navigation and theme toggle
- Comments stored on-chain
- No hosting costs, permanent availability

### Data Dashboard
- Dynamic data visualization widgets
- Real-time updates from blockchain
- Modular component architecture
- Decentralized deployment

---

## 🤝 For AI Agents

This toolkit is specifically designed for AI agents like Claude Code to:

1. **Autonomously develop** Web4 applications
2. **Deploy without human intervention** (only needs wallet private key)
3. **Manage versions** through blockchain transactions
4. **Debug and fix issues** using built-in error handling

See [0_README.md](./0_README.md) for complete AI Agent workflows and decision trees.

---

## 📋 Requirements

- Node.js v16+
- Solana wallet with small amount of SOL (~0.01 SOL)
- Basic understanding of HTML/CSS/JS

---

## 🔧 Development Workflow

```
Component.js → build.js → Component.json → upload.js → Irys Network
                                                             ↓
User Browser ← index.html ← Layout ← Widgets ← Transaction IDs
```

---

## 📄 License

MIT

---

## 🙏 Acknowledgments

- **Irys Network** - Decentralized storage infrastructure
- **Solana** - Fast, low-cost blockchain
- **Claude Code** - AI Agent development partner

---

## 📞 Support

- Issues: [GitHub Issues](https://github.com/yourusername/web4dev/issues)
- Documentation: See [0_README.md](./0_README.md)
- Examples: Check `project/` and `ref/` directories

---

**Built with ❤️ for the decentralized future**

**Version**: 1.0.0
**Last Updated**: 2025-10-06
