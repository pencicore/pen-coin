import { deploy } from './ethers-lib'
import { ethers } from 'ethers'

;(async () => {
  try {
    //1. get singer
    const signer = (new ethers.providers.Web3Provider(web3Provider)).getSigner(0)
    const ownerAddress = await signer.getAddress();

    //2. Deploy the ERC20 contract
    const contractERC20 = await deploy('PenERC20V2', ["pencil qbx", "PEN", ownerAddress])
    console.log(`✅PenERC20 Contract deployed at: ${contractERC20.address}`)
    const balanceOwn = await contractERC20.balanceOf(ownerAddress);
    console.log("my account balance of PEN is:", balanceOwn.toString());
    const contractFaucet = await deploy('Faucet', [contractERC20.address])
    console.log(`✅Faucet Contract deployed at: ${contractFaucet.address}`)

    //3. transfer
    const amount = ethers.utils.parseUnits("100000", 18); // 10 PEN (decimals = 18)
    const tx = await contractERC20.transfer(contractFaucet.address, amount);
    await tx.wait();
    const tx2 = await contractERC20.transfer("0xb55383173035093f74682bfa7282A3D541942aBb", amount);
    await tx2.wait();
    console.log(`✅ Transferred ${ethers.utils.formatUnits(amount, 18)} PEN to Faucet`);
  
    //4. check
    const b1 = await contractERC20.balanceOf(ownerAddress)
    const b2 = await contractERC20.balanceOf("0xb55383173035093f74682bfa7282A3D541942aBb")
    const b3 = await contractERC20.balanceOf(contractFaucet.address)
    console.log("Owner balance:", ethers.utils.formatUnits(b1, 18));
    console.log("Target balance:", ethers.utils.formatUnits(b2, 18));
    console.log("Faucet balance:", ethers.utils.formatUnits(b3, 18));

  } catch (e) {
    console.log("❌ Error:", e.message)
  }
})()
