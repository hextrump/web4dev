require("dotenv").config();
const { Uploader } = require("@irys/upload");
const { Solana } = require("@irys/upload-solana");
const fs = require("fs");
const path = require("path");
const BigNumber = require("bignumber.js");

// === 解析命令行参数 ===
function parseArgs() {
  const args = process.argv.slice(2);
  const config = {
    file: null,
    type: null,
    version: "0.1.0",
    tag: "web4-test",
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (!arg.startsWith("--")) {
      config.file = arg;
    } else if (arg.startsWith("--type=")) {
      config.type = arg.split("=")[1];
    } else if (arg.startsWith("--version=")) {
      config.version = arg.split("=")[1];
    } else if (arg.startsWith("--tag=")) {
      config.tag = arg.split("=")[1];
    }
  }

  return config;
}

// === Lazy Funding ===
const lazyFund = async (irys, size) => {
  try {
    const price = await irys.getPrice(size);
    const balance = await irys.getBalance();
    console.log(`💰 费用: ${irys.utils.fromAtomic(price)} SOL | 余额: ${irys.utils.fromAtomic(balance)} SOL`);

    if (new BigNumber(balance).lt(new BigNumber(price))) {
      console.log("💳 余额不足，自动充值...");
      const fundTx = await irys.fund(price);
      await irys.funder.submitFundTransaction(fundTx.id);
      console.log("✅ 充值完成");
    }
    return true;
  } catch (e) {
    console.error("❌ Lazy-Funding 失败:", e.message);
    return false;
  }
};

// === 初始化 Irys Uploader ===
const getIrysUploader = async () => {
  try {
    if (!process.env.PRIVATE_KEY) {
      throw new Error("请在 .env 文件中设置 PRIVATE_KEY");
    }
    const irysUploader = await Uploader(Solana).withWallet(process.env.PRIVATE_KEY);
    console.log("✅ Irys 初始化完成");
    return irysUploader;
  } catch (error) {
    console.error("❌ Irys 初始化失败:", error.message);
    return null;
  }
};

// === 上传文件 ===
async function uploadFile(irys, filePath, tags) {
  try {
    if (!fs.existsSync(filePath)) {
      throw new Error(`文件不存在: ${filePath}`);
    }

    const buffer = fs.readFileSync(filePath);
    const fileSize = buffer.length;
    const fileSizeKB = (fileSize / 1024).toFixed(2);

    console.log(`\n📄 文件信息:`);
    console.log(`   路径: ${filePath}`);
    console.log(`   大小: ${fileSizeKB} KB`);
    console.log(`   标签:`, tags);

    // Lazy Funding
    const fundingSuccess = await lazyFund(irys, fileSize);
    if (!fundingSuccess) {
      throw new Error("充值失败，无法继续上传");
    }

    console.log("\n⏳ 正在上传到 Irys 网络...");
    const receipt = await irys.upload(buffer, { tags });

    const uploadUrl = `https://gateway.irys.xyz/${receipt.id}`;
    console.log(`\n✅ 上传成功!`);
    console.log(`📍 Transaction ID: ${receipt.id}`);
    console.log(`🔗 访问链接: ${uploadUrl}`);

    // 保存到上传历史
    await saveUploadHistory({
      timestamp: new Date().toISOString(),
      file: path.basename(filePath),
      txid: receipt.id,
      url: uploadUrl,
      size: `${fileSizeKB} KB`,
      tags: tags,
    });

    return { status: "ok", id: receipt.id, url: uploadUrl };
  } catch (error) {
    console.error(`\n❌ 上传失败: ${error.message}`);
    return { status: "fail", error: error.message };
  }
}

// === 保存上传历史 ===
async function saveUploadHistory(record) {
  const historyFile = path.join(__dirname, "upload-history.json");
  let history = [];

  if (fs.existsSync(historyFile)) {
    try {
      history = JSON.parse(fs.readFileSync(historyFile, "utf8"));
    } catch (e) {
      console.log("⚠️  无法读取历史记录，将创建新文件");
    }
  }

  history.unshift(record);

  // 只保留最近 100 条记录
  if (history.length > 100) {
    history = history.slice(0, 100);
  }

  fs.writeFileSync(historyFile, JSON.stringify(history, null, 2));
  console.log(`\n📝 上传记录已保存到 upload-history.json`);
}

// === 主函数 ===
async function main() {
  console.log("🚀 Web4 CLI - 文件上传工具\n");

  const config = parseArgs();

  if (!config.file) {
    console.log("使用方法:");
    console.log("  node upload.js <file> --type=<type> [--version=<version>] [--tag=<tag>]\n");
    console.log("示例:");
    console.log("  # 上传 JSON 组件");
    console.log("  node upload.js project/layout.json --type=layout --version=0.1.0 --tag=web4-test\n");
    console.log("  # 上传 HTML 页面");
    console.log("  node upload.js project/index.html --type=page --version=0.1.0\n");
    process.exit(1);
  }

  // 检查文件类型
  const ext = path.extname(config.file);
  let contentType = "application/json";
  let tags = [];

  if (ext === ".html" || ext === ".htm") {
    contentType = "text/html";
    tags = [
      { name: "Content-Type", value: contentType },
      { name: "App-Name", value: "Web4-CLI" },
      { name: "Version", value: config.version },
    ];
  } else if (ext === ".json") {
    // JSON 组件
    if (!config.type) {
      console.error("❌ 错误: 上传 JSON 组件需要指定 --type 参数");
      process.exit(1);
    }
    tags = [
      { name: "Content-Type", value: contentType },
      { name: config.tag, value: config.type },
      { name: "Version", value: config.version },
    ];
  } else {
    console.error(`❌ 不支持的文件类型: ${ext}`);
    process.exit(1);
  }

  // 初始化 Irys
  const irys = await getIrysUploader();
  if (!irys) {
    console.error("❌ 无法初始化 Irys，请检查 .env 配置");
    process.exit(1);
  }

  // 上传文件
  const result = await uploadFile(irys, config.file, tags);

  if (result.status === "ok") {
    console.log("\n🎉 完成!");
  } else {
    process.exit(1);
  }
}

// 运行
main().catch((error) => {
  console.error("❌ 发生错误:", error.message);
  process.exit(1);
});
