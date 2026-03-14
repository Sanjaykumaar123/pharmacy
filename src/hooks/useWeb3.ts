"use client";

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { ethers } from 'ethers';

interface Web3State {
  account: string | null;
  isConnected: boolean;
  networkName: string | null;
  networkId: string | null;
  balance: string | null;
  isSepolia: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  refreshBalance: () => Promise<void>;
}

// Lazy storage: accessed only when methods are called (safe for SSR)
const lazySessionStorage = createJSONStorage(() => {
  if (typeof window === 'undefined') {
    return {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
    };
  }
  return sessionStorage;
});

const SEPOLIA_CHAIN_ID = BigInt(11155111);

export const useWeb3Store = create<Web3State>()(
  persist(
    (set, get) => ({
      account: null,
      isConnected: false,
      networkName: null,
      networkId: null,
      balance: null,
      isSepolia: false,

      connectWallet: async () => {
        console.log("Connect Wallet Initiated");
        try {
          if (typeof window === 'undefined') return;

          let ethProvider = (window as any).ethereum;

          // Resolve conflicts if multiple wallets (like Phantom and MetaMask) are installed
          if (ethProvider?.providers?.length) {
            ethProvider = ethProvider.providers.find((p: any) => p.isMetaMask) || ethProvider.providers[0];
          }

          if (ethProvider) {
            const provider = new ethers.BrowserProvider(ethProvider);
            console.log("Wallet provider found, requesting accounts...");
            
            // Request accounts from the selected provider
            const accounts = await provider.send("eth_requestAccounts", []).catch((err: any) => {
              if (err.code === 4001) {
                alert("Connection Rejected: Please check MetaMask and approve the request.");
              } else {
                alert("Connection Error: " + (err.message || "Unknown error"));
              }
              throw err;
            });

            console.log("Accounts received:", accounts);
            const network = await provider.getNetwork();
            const balance = await provider.getBalance(accounts[0]);
            
            const isSepolia = network.chainId === SEPOLIA_CHAIN_ID;

            set({
              account: accounts[0],
              isConnected: true,
              networkName: network.name,
              networkId: network.chainId.toString(),
              balance: ethers.formatEther(balance),
              isSepolia: isSepolia
            });

            if (!isSepolia) {
              alert("Wrong Network: PharmaTrack Lite runs on Sepolia. Please switch networks in MetaMask.");
            }

            // Setup real-time listeners on the specific provider
            ethProvider.on('accountsChanged', (newAccounts: string[]) => {
               if (newAccounts.length > 0) {
                 get().connectWallet();
               } else {
                 get().disconnectWallet();
               }
            });

            ethProvider.on('chainChanged', () => {
               window.location.reload();
            });

          } else {
            alert("No Wallet Found: Please ensure MetaMask is installed and enabled.");
            window.open('https://metamask.io/download/', '_blank');
          }
        } catch (error: any) {
          console.error("Failed to connect wallet", error);
        }
      },

      refreshBalance: async () => {
        const { account, isConnected } = get();
        if (isConnected && account && typeof window !== 'undefined') {
            const ethProvider = (window as any).ethereum?.providers?.find((p: any) => p.isMetaMask) || (window as any).ethereum;
            if (ethProvider) {
                const provider = new ethers.BrowserProvider(ethProvider);
                const balance = await provider.getBalance(account);
                set({ balance: ethers.formatEther(balance) });
            }
        }
      },

      disconnectWallet: () => {
        set({ account: null, isConnected: false, networkName: null, networkId: null, balance: null, isSepolia: false });
        sessionStorage.removeItem('web3-storage');
      }
    }),
    {
      name: 'web3-storage',
      storage: lazySessionStorage,
    }
  )
);
