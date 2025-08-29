import { deploy } from './ethers-lib'
import { ethers } from 'ethers'

;(async () => {
  try {
    //1. get singer
    const signer = (new ethers.providers.Web3Provider(web3Provider)).getSigner(0)
    const ownerAddress = await signer.getAddress();

    //2. Deploy the ERC20 contract
    const contractERC20 = await deploy('PenERC20V3', ["pencil qbx", "PEN", ownerAddress])
    console.log(`✅PenERC20 Contract deployed at: ${contractERC20.address}`)
    const balanceOwn = await contractERC20.balanceOf(ownerAddress);
    console.log("my account balance of PEN is:", balanceOwn.toString());
    const contractFaucet = await deploy('Faucet', [contractERC20.address])
    console.log(`✅Faucet Contract deployed at: ${contractFaucet.address}`)

    //3. transfer
    const amount = ethers.utils.parseUnits("100000", 18); // 10 PEN (decimals = 18)
    const tx = await contractERC20.transfer(contractFaucet.address, amount);
    await tx.wait();
    console.log(`✅ Transferred ${ethers.utils.formatUnits(amount, 18)} PEN to Faucet`);
  
    //4. check
    const b1 = await contractERC20.balanceOf(ownerAddress)
    const b3 = await contractERC20.balanceOf(contractFaucet.address)
    console.log("Owner balance:", ethers.utils.formatUnits(b1, 18));
    console.log("Faucet balance:", ethers.utils.formatUnits(b3, 18));

    //5. provide liquidity
    const amountPEN = ethers.utils.parseUnits("100000", 18);
    const amountETH = ethers.utils.parseEther("10");

    const tx3 = await contractERC20.addLiquidity(
    amountPEN,                // 传入 PEN 数量
    { 
        value: amountETH,
        gasLimit: 500000, // 手动设置 Gas Limit
    }
    );
    await tx3.wait();

    //6. check liquidity
    const reservePEN = await contractERC20.reservePEN();
    const reserveETH = await contractERC20.reserveETH();
    const myLP = await contractERC20.lpBalance(ownerAddress);
    const price = await contractERC20.getETHPriceInPEN();

    console.log("PEN Reserve:", ethers.utils.formatUnits(reservePEN, 18));
    console.log("ETH Reserve:", ethers.utils.formatEther(reserveETH));
    console.log("My LP:", myLP.toString());
    console.log("Pen Price", price.toString(), " ETH/PEN")

  } catch (e) {
    console.log("❌ Error:", e.message)
  }
})()
