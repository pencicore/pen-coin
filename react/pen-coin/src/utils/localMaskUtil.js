import {getAddress, Mnemonic, Wallet} from "ethers";

const PRIVATE_KEY = "private_key";

const privateKeyVar = {
    privateKey: null,
    getPrivateKey() {
        if (this.privateKey === null) {
            this.privateKey = localStorage.getItem(PRIVATE_KEY)
        }
        return this.privateKey
    },
    setPrivateKey(privateKey) {
        localStorage.setItem(PRIVATE_KEY, privateKey)
        this.privateKey = null
    },
    checkPrivateKey(privateKey) {
        try {
            new Wallet(privateKey)
            return true
        } catch {
            return false
        }
    }
}

const memoryParticle = {
    mnemonicToPrivateKey(mnemonic) {
        if (!this.checkMemoryParticle(mnemonic)) return null;  // validate first
        const wallet = Wallet.fromMnemonic(mnemonic.trim());
        return wallet.privateKey;
    },
    checkMemoryParticle(mnemonic) {
        if (!mnemonic || typeof mnemonic !== "string") return false;
        return Mnemonic.isValidMnemonic(mnemonic.trim()); // use Wallet static method in ethers v6
    }
}

export const localMaskUtil = {
    isEmpty() {
        console.log(privateKeyVar.getPrivateKey())
        return privateKeyVar.getPrivateKey() === null || privateKeyVar.getPrivateKey() === "null"
    },
    login(privateKey) {
        if (memoryParticle.checkMemoryParticle(privateKey)) {
            privateKey = memoryParticle.mnemonicToPrivateKey(privateKey)
        }
        if (!privateKeyVar.checkPrivateKey(privateKey)) {
            return false
        }
        privateKeyVar.setPrivateKey(privateKey)
        return true
    },
    getRandomPrivateKey() {
        return Wallet.createRandom().privateKey
    },
    getAddressHandle() {
        const privateKey = privateKeyVar.getPrivateKey()
        return this.getAddress(privateKey)
    },
    getAddress(privateKey) {
        return new Wallet(privateKey).address
    },
    check(privateKey) {
        return privateKeyVar.checkPrivateKey(privateKey) || memoryParticle.checkMemoryParticle(privateKey)
    },
    logout() {
        privateKeyVar.setPrivateKey(null)
    }
}