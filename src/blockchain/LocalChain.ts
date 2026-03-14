import { ethers } from "ethers";

export interface TransactionData {
  id: string; // unique transaction id
  type: "ADD_MEDICINE" | "UPDATE_STOCK" | "GENESIS";
  medicineData: any;
  timestamp: number;
}

export class Block {
  public index: number;
  public timestamp: number;
  public transactionData: TransactionData;
  public previousHash: string;
  public hash: string;
  public nonce: number;
  public isTampered: boolean = false;

  constructor(
    index: number,
    timestamp: number,
    transactionData: TransactionData,
    previousHash: string = ""
  ) {
    this.index = index;
    this.timestamp = timestamp;
    this.transactionData = transactionData;
    this.previousHash = previousHash;
    this.nonce = 0;
    this.hash = this.calculateHash();
  }

  public calculateHash(): string {
    const dataString = 
      this.index.toString() + 
      this.previousHash + 
      this.timestamp.toString() + 
      JSON.stringify(this.transactionData) + 
      this.nonce.toString();
    
    return ethers.sha256(ethers.toUtf8Bytes(dataString));
  }

  public mineBlock(difficulty: number) {
    while (
      this.hash.substring(2, 2 + difficulty) !== Array(difficulty + 1).join("0")
    ) {
      this.nonce++;
      this.hash = this.calculateHash();
    }
    console.log("Block mined: " + this.hash);
  }
}

export class Blockchain {
  public chain: Block[];
  public difficulty: number;

  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 2; // simplified for quick simulation
  }

  public createGenesisBlock(): Block {
    return new Block(
      0,
      Date.now(),
      {
        id: "tx_genesis",
        type: "GENESIS",
        medicineData: "Genesis Block",
        timestamp: Date.now()
      },
      "0"
    );
  }

  public getLatestBlock(): Block {
    return this.chain[this.chain.length - 1];
  }

  public addBlock(newBlock: Block) {
    newBlock.previousHash = this.getLatestBlock().hash;
    newBlock.mineBlock(this.difficulty);
    this.chain.push(newBlock);
  }

  public addTransaction(tx: TransactionData) {
    const block = new Block(
      this.chain.length,
      Date.now(),
      tx,
      this.getLatestBlock().hash
    );
    this.addBlock(block);
    return block;
  }

  public validateBlock(block: Block, previousBlock: Block): boolean {
    if (block.hash !== block.calculateHash()) {
      return false;
    }
    if (block.previousHash !== previousBlock.hash) {
      return false;
    }
    return true;
  }

  public validateChain(): { isValid: boolean; compromisedBlocks: number[] } {
    const compromisedBlocks: number[] = [];
    
    // First, restore validity state to default
    for (const b of this.chain) {
      b.isTampered = false;
    }

    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      // Re-calculate hash to ensure data wasn't tampered
      if (currentBlock.hash !== currentBlock.calculateHash()) {
        currentBlock.isTampered = true;
        compromisedBlocks.push(i);
      }

      // Ensure chain link is intact
      if (currentBlock.previousHash !== previousBlock.hash) {
        currentBlock.isTampered = true;
        if (!compromisedBlocks.includes(i)) {
          compromisedBlocks.push(i);
        }
      }
    }

    return { 
      isValid: compromisedBlocks.length === 0, 
      compromisedBlocks 
    };
  }

  // Helper method to simulate tampering
  public tamperBlockData(index: number, newMedicineData: any) {
    if (index > 0 && index < this.chain.length) {
      this.chain[index].transactionData.medicineData = newMedicineData;
      // We purposefully DO NOT recalculate the hash so the chain becomes invalid
      // unless we also try to re-hash the whole chain.
    }
  }
}

// Global instance for simple state management in front-end
const localBlockchain = new Blockchain();
export default localBlockchain;
