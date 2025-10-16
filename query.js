#!/usr/bin/env node

/**
 * Web4 CLI Query Tool
 * AI Agent 可以查询 Irys 上的组件
 *
 * 使用方法:
 * node query.js --type=<component-type> [--version=<version>]
 *
 * 示例:
 * node query.js --type=nft-market --version=0.1.3
 */

const https = require('https');

class Web4Query {
    constructor() {
        this.args = this.parseArgs();
        this.owner = 'A5Hzm1b3mtQfYfU6q5qvKeVJmoaReCvthwfHuZkBBdAQ';
    }

    parseArgs() {
        const args = {
            type: null,
            version: null,
            tag: 'istartproject',
            limit: 5,
            txid: null,
            help: false,
            contentType: 'application/json'
        };

        for (let i = 2; i < process.argv.length; i++) {
            const arg = process.argv[i];
            if (arg === '--help' || arg === '-h') {
                args.help = true;
            } else if (arg.startsWith('--type=')) {
                args.type = arg.split('=')[1];
            } else if (arg.startsWith('--version=')) {
                args.version = arg.split('=')[1];
            } else if (arg.startsWith('--tag=')) {
                args.tag = arg.split('=')[1];
            } else if (arg.startsWith('--limit=')) {
                args.limit = parseInt(arg.split('=')[1]);
            } else if (arg.startsWith('--txid=')) {
                args.txid = arg.split('=')[1];
            } else if (arg.startsWith('--content-type=')) {
                args.contentType = arg.split('=')[1];
            }
        }

        return args;
    }

    showHelp() {
        console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  🔍 Web4 CLI Query Tool - AI Agent Helper
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

用法:
  node query.js [options]

选项:
  --type=<type>       查询组件类型
  --version=<ver>     指定版本号 (可选)
  --tag=<tag>         标签前缀 (默认: istartproject)
  --limit=<n>         返回结果数量 (默认: 5)
  --txid=<id>         直接查询指定 Transaction ID
  --content-type=<t>  指定 Content-Type (默认: application/json, 使用 any 跳过)
  -h, --help          显示帮助

示例:
  # 查询最新的 NFT 市场组件
  node query.js --type=nft-market

  # 查询指定版本的布局组件
  node query.js --type=layout --version=0.1.3

  # 查询首页布局 (istart 标签)
  node query.js --type=layout --tag=istart

  # 直接获取指定 Transaction 的内容
  node query.js --txid=44WjLE7J9psmwt5Jz5MuCzsjtMS5tZ3uWp8yRyF8UAwi

  # 查询最近 10 条记录
  node query.js --type=nft-market --limit=10

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        `);
    }

    async fetchGraphQL(query) {
        return new Promise((resolve, reject) => {
            const data = JSON.stringify({ query });

            const options = {
                hostname: 'uploader.irys.xyz',
                path: '/graphql',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': data.length
                }
            };

            const req = https.request(options, (res) => {
                let body = '';
                res.on('data', (chunk) => body += chunk);
                res.on('end', () => {
                    try {
                        resolve(JSON.parse(body));
                    } catch (error) {
                        reject(error);
                    }
                });
            });

            req.on('error', reject);
            req.write(data);
            req.end();
        });
    }

    async fetchContent(txid) {
        return new Promise((resolve, reject) => {
            const options = {
                hostname: 'gateway.irys.xyz',
                path: `/${txid}`,
                method: 'GET'
            };

            const req = https.request(options, (res) => {
                let body = '';
                res.on('data', (chunk) => body += chunk);
                res.on('end', () => resolve(body));
            });

            req.on('error', reject);
            req.end();
        });
    }

    buildQuery() {
        const tags = [];

        if (this.args.contentType && this.args.contentType !== 'any') {
            tags.push({ name: 'Content-Type', values: [this.args.contentType] });
        }

        if (this.args.type) {
            tags.push({ name: this.args.tag, values: [this.args.type] });
        }

        if (this.args.version) {
            tags.push({ name: 'Version', values: [this.args.version] });
        }

        const tagsStr = tags.map(tag => {
            return `{ name: "${tag.name}", values: ${JSON.stringify(tag.values)} }`;
        }).join(',\n                ');

        return `{
            transactions(
                tags: [
                    ${tagsStr}
                ],
                owners: ["${this.owner}"],
                first: ${this.args.limit},
                order: DESC
            ) {
                edges {
                    node {
                        id
                        tags {
                            name
                            value
                        }
                    }
                }
            }
        }`;
    }

    async query() {
        if (this.args.help) {
            this.showHelp();
            return;
        }

        console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  🔍 Web4 组件查询
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        `);

        // 直接查询 Transaction ID
        if (this.args.txid) {
            console.log(`📦 查询 Transaction: ${this.args.txid}`);
            console.log('');
            try {
                const content = await this.fetchContent(this.args.txid);
                console.log('✅ 获取成功');
                console.log('');
                console.log('📄 内容:');
                console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

                try {
                    const json = JSON.parse(content);
                    console.log(JSON.stringify(json, null, 2));
                } catch {
                    console.log(content);
                }

                console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                console.log('');
                console.log(`🔗 访问链接: https://uploader.irys.xyz/${this.args.txid}`);
            } catch (error) {
                console.error('❌ 查询失败:', error.message);
            }
            return;
        }

        // GraphQL 查询
        if (!this.args.type) {
            console.error('❌ 错误: 请指定组件类型 (--type=xxx) 或 Transaction ID (--txid=xxx)');
            console.log('使用 --help 查看帮助');
            process.exit(1);
        }

        console.log(`🏷️  类型: ${this.args.type}`);
        if (this.args.version) {
            console.log(`🔖 版本: ${this.args.version}`);
        }
        console.log(`📊 限制: ${this.args.limit} 条`);
        console.log('');
        console.log('⏳ 查询中...');
        console.log('');

        try {
            const query = this.buildQuery();
            const result = await this.fetchGraphQL(query);

            if (!result.data?.transactions?.edges?.length) {
                console.log('📭 未找到匹配的组件');
                console.log('');
                console.log('💡 提示:');
                console.log('  - 检查组件类型是否正确');
                console.log('  - 尝试不指定版本号');
                console.log('  - 使用 --tag=istart 查询首页组件');
                return;
            }

            const transactions = result.data.transactions.edges;
            console.log(`✅ 找到 ${transactions.length} 个组件`);
            console.log('');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

            for (let i = 0; i < transactions.length; i++) {
                const tx = transactions[i].node;
                const tags = {};
                tx.tags.forEach(tag => tags[tag.name] = tag.value);

                console.log('');
                console.log(`📦 组件 #${i + 1}`);
                console.log(`   ID: ${tx.id}`);
                console.log(`   类型: ${tags[this.args.tag] || '-'}`);
                console.log(`   版本: ${tags.Version || '-'}`);
                console.log(`   时间: ${tags['Unix-Time'] ? new Date(parseInt(tags['Unix-Time'])).toLocaleString('zh-CN') : '-'}`);
                console.log(`   链接: https://uploader.irys.xyz/${tx.id}`);
                console.log('');
            }

            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('');
            console.log('💡 使用 --txid=<id> 查看完整内容');
            console.log('');

        } catch (error) {
            console.error('❌ 查询失败:', error.message);
            process.exit(1);
        }
    }
}

// 运行
const querier = new Web4Query();
querier.query().catch(console.error);
