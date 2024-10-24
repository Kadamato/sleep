"use client";

import { useMemo } from "react";

import { ConnectionProvider } from "@solana/wallet-adapter-react";
import { WalletProvider } from "@solana/wallet-adapter-react";
import { clusterApiUrl } from "@solana/web3.js";
import {
  WalletModalProvider,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";

export default function Providers({ children }: { children: React.ReactNode }) {
  const endpoint = "http://127.0.0.1:8899";
  const wallets = useMemo(() => [], []);
  return (
    <div>
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider autoConnect wallets={wallets}>
          <WalletModalProvider>
            <WalletMultiButton />

            {children}
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </div>
  );
}
