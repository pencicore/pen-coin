import { deploy } from './ethers-lib'
import { ethers } from 'ethers'

;(async () => {
  try {
    // 1️⃣ Deploy the ERC20 contract
    const contract = await deploy('PenERC721', [])
    console.log(`✅ Contract deployed at: ${contract.address}`)
  } catch (e) {
    console.log("❌ Error:", e.message)
  }
})()