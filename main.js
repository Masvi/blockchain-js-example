const SHA256 = require("crypto-js/sha256");

class Block {
  constructor(index, timestamp, data, previewHash = "") {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previewHash = previewHash;
    this.hash = this.calculateHash();
    this.nonce = 0;
  }

  calculateHash() {
    return SHA256(
      this.index +
        this.previewHash +
        this.timestamp +
        JSON.stringify(this.data) +
        this.nonce
    ).toString();
  }

  /**
   * Proof of Work
   * incrise the dificulty 
   */
  mineBlock(difficulty) {
    while (
      this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")
    ) {
      this.nonce++;
      this.hash = this.calculateHash();
    }
    console.log("Block mined: " + this.hash);
  }
}

class BlockChain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 4;
  }

  createGenesisBlock() {
    return new Block(0, "22/01/2022", "Genesis block", "0");
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  addBlock(newBlock) {
    newBlock.previewHash = this.getLatestBlock().hash;
    newBlock.mineBlock(this.difficulty);
    this.chain.push(newBlock);
  }

  isChainValid() {
    for (let i = 0; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return false;
      }

      if (currentBlock.previewHash !== previousBlock) {
        return false;
      }
    }

    return true;
  }
}

let masviCoin = new BlockChain();

// first valid operations

console.log("Mining block 1");
masviCoin.addBlock(new Block(1, "03/01/2022", { amount: 400 }));
console.log("Mining block 2");
masviCoin.addBlock(new Block(2, "09/01/2022", { amount: 600 }));

/**
 second opration - tamparing a block
 
 masviCoin.chain[1].data = { amount: 1000 };
 masviCoin.chain[1].hash = masviCoin.chain[1].calculateHash();
 
 */

//console.log("is valid? " + masviCoin.isChainValid());

//console.log(JSON.stringify(masviCoin, null, 4));
