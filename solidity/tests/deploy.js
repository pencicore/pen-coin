// deploy.js
// Script Runner in Remix with ethers v6

async function main() {
    // 1. 链接到浏览器钱包 (MetaMask / Injected Provider)
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    console.log("Using account:", await signer.getAddress());

    // 2. 获取 ABI 和 Bytecode
    const artifact = await remix.call('solidity', 'getArtifact', 'ERC20');
    const abi = artifact.abi;
    const bytecode = artifact.bytecode;

    // 3. 构造函数参数
    const name = "pencil qbx";
    const symbol = "PEN";
    const owner = "0x1ec04cc7741c656f5762295b6fc032bb7839d8d1";

    // 4. 部署合约
    console.log("Deploying ERC20...");
    const factory = new ethers.ContractFactory(abi, bytecode, signer);
    const contract = await factory.deploy(name, symbol, owner);

    console.log("⏳ Waiting for deployment...");
    await contract.waitForDeployment();

    console.log("✅ Contract deployed at:", await contract.getAddress());
    console.log("📜 Deployer tx hash:", (await contract.deploymentTransaction()).hash);
}

// 执行
main().catch(console.error);
