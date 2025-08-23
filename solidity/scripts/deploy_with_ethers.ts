import { deploy } from './ethers-lib'
import { ethers } from 'ethers'

;(async () => {
  try {
    // 1️⃣ Deploy the ERC20 contract
    const contract = await deploy('HelloWeb3', [])
    console.log(`✅ Contract deployed at: ${contract.address}`)
    const result = await contract.getString();
    console.log("getString result:", result);
  } catch (e) {
    console.log("❌ Error:", e.message)
  }
})()
