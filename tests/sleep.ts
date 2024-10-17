import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";
import { Sleep } from "../target/types/sleep";

import {
  TransactionSignature,
  TransactionConfirmationStrategy,
} from "@solana/web3.js";
import { BN } from "bn.js";

const provider = anchor.AnchorProvider.env();
anchor.setProvider(provider);

// https://devnet.irys.xyz

const connection = provider.connection;
const wallet = provider.wallet as NodeWallet;
const program = anchor.workspace.Sleep as Program<Sleep>;

const metadataConfig = {
  name: "Sleep Token",
  symbol: "SLEEP",
  uri: "https://devnet.irys.xyz/H1prdeDSuCA46SSoh1UzZcwdZda3CfpXtpaFL1C4mUYN",
};

const TOKEN_2022_PROGRAM_ID = new anchor.web3.PublicKey(
  "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"
);

const SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID = new anchor.web3.PublicKey(
  "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
);

const LAMPORTS_PER_SOL = 1000000;
//  account

const [mintPDA] = anchor.web3.PublicKey.findProgramAddressSync(
  [Buffer.from("mint_account"), wallet.publicKey.toBuffer()],
  program.programId
);

const [sleeperPDA] = anchor.web3.PublicKey.findProgramAddressSync(
  [Buffer.from("sleeper_account"), wallet.publicKey.toBuffer()],
  program.programId
);

const [tokenAccount] = anchor.web3.PublicKey.findProgramAddressSync(
  [
    wallet.publicKey.toBuffer(),
    TOKEN_2022_PROGRAM_ID.toBuffer(),
    mintPDA.toBuffer(),
  ],
  SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID
);

describe("sleep", () => {
  it("init token!", async () => {
    const tx = await program.methods
      .initializeToken(metadataConfig)
      .accountsPartial({
        payer: wallet.publicKey,
        mintAccount: mintPDA,
        tokenProgram: TOKEN_2022_PROGRAM_ID,
      })
      .signers([wallet.payer])
      .rpc();

    await confirmTransaction(tx, provider);
    console.log("Your transaction signature", tx);
  });

  it("init sleeper account", async () => {
    const tx = await program.methods
      .createNewSleeper("kadamato")
      .accountsPartial({
        payer: wallet.publicKey,
        sleeperAccount: sleeperPDA,
      })
      .rpc();

    await confirmTransaction(tx, provider);

    console.log("create new sleeper success");
  });

  it("init token account", async () => {
    const tx = await program.methods
      .createNewTokenAccount()
      .accountsPartial({
        payer: wallet.publicKey,
        tokenAccount: tokenAccount,
        mint: mintPDA,
      })
      .rpc();

    await confirmTransaction(tx, provider);

    console.log("create token account success");
  });

  it("mint token ", async () => {
    const tx = await program.methods
      .mintTokenTo(new BN(1000 * LAMPORTS_PER_SOL))
      .accountsPartial({
        payer: wallet.publicKey,
        mint: mintPDA,
        receiver: tokenAccount,
      })
      .rpc();

    await confirmTransaction(tx, provider);

    console.log("Mint token success");
  });

  it("sleep", async () => {
    const tx = await program.methods
      .startSleep(new BN(1728960851175))
      .accountsPartial({
        payer: wallet.publicKey,
        sleeper: sleeperPDA,
      })
      .rpc();

    await confirmTransaction(tx, provider);

    console.log("Sleeping ...");
  });

  it("Claim ", async () => {
    const tx = await program.methods
      .claim(new BN(1728977943648))
      .accountsPartial({
        payer: wallet.publicKey,
        mint: mintPDA,
        sleeperAccount: sleeperPDA,
        tokenAccount: tokenAccount,
      })
      .rpc();

    await confirmTransaction(tx, provider);

    const sleeperInfo = await program.account.sleeper.fetch(sleeperPDA);

    console.log(sleeperInfo);

    console.log("claim token...");

    console.log("token account info", tokenAccount);

    console.log("sleeper account", sleeperPDA);

    console.log("mint token", mintPDA);

    console.log("claim signature:", tx);
  });
});

const confirmTransaction = async (
  signature: TransactionSignature,
  provider: anchor.Provider
) => {
  const latestBlockhash = await provider.connection.getLatestBlockhash();
  const confirmationStrategy: TransactionConfirmationStrategy = {
    signature,
    blockhash: latestBlockhash.blockhash,
    lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
  };

  try {
    const confirmation = await provider.connection.confirmTransaction(
      confirmationStrategy,
      "confirmed"
    );
    if (confirmation.value.err) {
      throw new Error(
        `Transaction failed: ${confirmation.value.err.toString()}`
      );
    }
  } catch (error) {
    throw new Error(`Transaction confirmation failed: ${error.message}`);
  }
};

// 1728960851175
