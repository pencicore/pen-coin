import { deploy } from './ethers-lib'
import { ethers } from 'ethers'

;(async () => {
  try {
    // 1️⃣ Deploy the ERC20 contract
    const contract = await deploy('ERC20', ["pencil qbx", "PEN", "0xb55383173035093f74682bfa7282A3D541942aBb"])
    console.log(`✅ Contract deployed at: ${contract.address}`)
    const result = await contract.balanceOf("0xb55383173035093f74682bfa7282A3D541942aBb");
    console.log("getString result:", result.toString());
  } catch (e) {
    console.log("❌ Error:", e.message)
  }
})()
