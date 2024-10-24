"use client";
import Image from "next/image";

import * as anchor from "@coral-xyz/anchor";
import { MouseEventHandler, useCallback, useEffect, useState } from "react";

import idl from "./anchor/idl.json";

import type { Sleep } from "./anchor/Sleep";
import { IDL } from "./anchor/Sleep";

import {
  useAnchorWallet,
  useConnection,
  useWallet,
} from "@solana/wallet-adapter-react";

import {
  PublicKey,
  sendAndConfirmTransaction,
  Transaction,
} from "@solana/web3.js";
import {
  getAssociatedTokenAddressSync,
  getOrCreateAssociatedTokenAccount,
  TOKEN_2022_PROGRAM_ID,
} from "@solana/spl-token";
import { SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID } from "./constants";

//  build ui sleep game
//  perform 2 instructions: sleep, claim
//  show token balance

export default function Home() {
  const [program, setProgram] = useState<anchor.Program<Sleep> | null>(null);
  const wallet = useAnchorWallet();
  const { connection } = useConnection();

  useEffect(() => {
    if (!wallet) return;

    const provider = new anchor.AnchorProvider(connection, wallet, {});

    const program = new anchor.Program(IDL as Sleep, provider);

    setProgram(program);
  }, [wallet, connection]);

  const handleSleep = useCallback(async () => {
    if (!program?.programId) {
      throw new Error("Program ID is undefined");
    }

    if (!wallet) {
      throw new Error("Wallet is undefined");
    }

    const [sleeperPDA] = anchor.web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from("sleeper_account"),
        wallet?.publicKey?.toBuffer() || Buffer.alloc(0),
      ],
      program.programId
    );

    const [mintPDA] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("mint_account"), wallet.publicKey.toBuffer()],
      program.programId
    );

    // const tokenAccount = getAssociatedTokenAddressSync(
    //   mintPDA,
    //   wallet.publicKey
    // );

    const [tokenAccount] = anchor.web3.PublicKey.findProgramAddressSync(
      [
        wallet.publicKey.toBuffer(),
        TOKEN_2022_PROGRAM_ID.toBuffer(),
        mintPDA.toBuffer(),
      ],
      SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID
    );

    // let sleeperAccount;

    // try {
    //   sleeperAccount = await program.account.sleeper.fetch(sleeperPDA);
    // } catch (error: any) {
    //   sleeperAccount = null;
    // }
    const metadataConfig = {
      name: "Sleep Token",
      symbol: "SLEEP",
      uri: "https://devnet.irys.xyz/5nPAnvtydNMLxrp3aZhm4hgZ6QnCAkJoPH3g1SEjNPRA",
    };
    try {
      const mintInstruction = await program?.methods
        .initializeToken(metadataConfig)
        .accountsPartial({})
        .rpc();

      // const tokenAccountInstruction = await program?.methods
      //   .createNewSleeper("luffy")
      //   .accountsPartial({
      //     payer: wallet?.publicKey,
      //     mint: mintPDA,
      //     sleeperAccount: sleeperPDA,
      //     tokenAccount: tokenAccount,
      //   })
      //   .rpc({ skipPreflight: true });

      // console.log(tokenAccountInstruction);
    } catch (error: any) {
      console.log(error);
    }
  }, [program, wallet]);

  return <Card handleSleep={handleSleep} />;
}

const Card = ({
  handleSleep,
}: {
  handleSleep: MouseEventHandler<HTMLButtonElement>;
}) => {
  return (
    <div className=" w-[450px]  border-[1px] rounded-xl border-gray-300">
      <div>
        <Image
          src="/images/1.jpg"
          alt=""
          width={50}
          height={50}
          className="w-full h-full object-cover rounded-xl"
          unoptimized
        />
      </div>

      <div className="px-2 pb-3">
        <div className="font-bold text-xl mt-3 uppercase">Sleep to earn</div>
        <div className="flex items-center mt-2">
          <div className="mr-3 font-bold">10</div>
          <Image src="/images/sl-token-1.png" alt="" width={32} height={32} />
        </div>

        <div className="flex mt-5 text-[15px] ">
          <button
            onClick={handleSleep}
            className="p-2 px-4  hover:bg-[#242424] bg-[#000000] rounded-lg mr-3 text-white"
          >
            Sleep
          </button>
          <button className="p-2 px-4 hover:bg-[#242424] bg-[#000000] rounded-lg mr-3 text-white">
            Claim
          </button>
        </div>
      </div>
    </div>
  );
};

// const [tokenAccount] = anchor.web3.PublicKey.findProgramAddressSync(
//   [
//     wallet.publicKey.toBuffer(),
//     TOKEN_2022_PROGRAM_ID.toBuffer(),
//     mintPDA.toBuffer(),
//   ],
//   SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID
// );
