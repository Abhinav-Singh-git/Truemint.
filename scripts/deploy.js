const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("Starting deployment...");

  const CertificateVerifier = await hre.ethers.getContractFactory("CertificateVerifier");
  

  const certificate = await CertificateVerifier.deploy();
  await certificate.deployed();

  const address = certificate.address;
  console.log("✅ Contract deployed to:", address);

  const appRoot = path.join(__dirname, "..");
  const appPath = path.join(appRoot, "src", "App.js");

  if (fs.existsSync(appPath)) {
    let appContent = fs.readFileSync(appPath, "utf8");
    
    const updatedContent = appContent.replace(
      /const contractAddress = "0x[a-fA-F0-9]{40}";/,
      `const contractAddress = "${address}";`
    );

    fs.writeFileSync(appPath, updatedContent);
    console.log("🚀 App.js has been updated with the new address!");
  } else {
    console.log("⚠️ Could not find App.js to update the address automatically.");
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});