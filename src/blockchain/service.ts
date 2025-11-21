import { ethers } from "ethers";
import { CONTRACT_ADDRESS, RPC_URL } from "./config";
import abiFile from "./abi.json";

// Tell TypeScript MetaMask exists
declare global {
  interface Window {
    ethereum?: any;
  }
}

// ---- READ ONLY PROVIDER -----
const provider = new ethers.JsonRpcProvider(RPC_URL);

// ---- READ ONLY CONTRACT -----
const contract = new ethers.Contract(
  CONTRACT_ADDRESS,
  abiFile.abi,
  provider
);

// ****************************************************
// READ FUNCTION
// ****************************************************
export async function getMedicineOnChain(batch: string) {
  try {
    const data = await contract.getMedicine(batch);

    return {
      name: data.name,
      batch: data.batch,
      manufacturer: data.manufacturer,
      price: Number(data.price),
      stock: Number(data.stock),
      mfgDate: Number(data.mfgDate),
      expDate: Number(data.expDate),
      exists: Boolean(data.exists)
    };
  } catch (err) {
    console.error("❌ Blockchain fetch error:", err);
    return null;
  }
}

// ****************************************************
// WRITE FUNCTION (ADD MEDICINE)
// ****************************************************
export async function addMedicineOnChain(
  name: string,
  batch: string,
  manufacturer: string,
  price: number,
  stock: number,
  mfgDate: number,
  expDate: number
) {
  try {
    if (!window.ethereum) throw new Error("MetaMask not installed!");

    const browser = new ethers.BrowserProvider(window.ethereum);
    const signer = await browser.getSigner();

    const contractWithSigner = new ethers.Contract(
      CONTRACT_ADDRESS,
      abiFile.abi,
      signer
    );

    const tx = await contractWithSigner.addMedicine(
      name,
      batch,
      manufacturer,
      Number(price),
      Number(stock),
      Number(mfgDate),
      Number(expDate)
    );

    await tx.wait();
    console.log("✅ Medicine added to blockchain:", tx.hash);
    return tx.hash;

  } catch (err) {
    console.error("❌ Blockchain addMedicine error:", err);
    throw err;
  }
}

// ****************************************************
// WRITE FUNCTION (UPDATE STOCK)
// ****************************************************
export async function updateStockOnChain(batch: string, newStock: number) {
  try {
    const browser = new ethers.BrowserProvider(window.ethereum);
    const signer = await browser.getSigner();

    const contractWithSigner = new ethers.Contract(
      CONTRACT_ADDRESS,
      abiFile.abi,
      signer
    );

    const tx = await contractWithSigner.updateStock(batch, Number(newStock));
    await tx.wait();

    return tx.hash;

  } catch (err) {
    console.error("❌ Stock update error:", err);
    throw err;
  }
}
