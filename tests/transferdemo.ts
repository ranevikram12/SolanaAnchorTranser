import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { SolanaLamportTransfer } from "../target/types/solana_lamport_transfer";
//import { Transferdemo } from '../target/types/transferdemo';
import { SystemProgram, Transaction, LAMPORTS_PER_SOL } from '@solana/web3.js';



import {
  createMint,
  createAssociatedTokenAccount,
  mintTo,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { assert } from 'chai';
//import * as anchor from '@coral-xyz/anchor';
const program = anchor.workspace.SolanaLamportTransfer as Program<SolanaLamportTransfer>;


const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

describe("Test transfers", () => {

  

  it("transferLamports", async () => {


    async function generateKeypair() {
      let keypair = anchor.web3.Keypair.generate();
      await provider.connection.requestAirdrop(
        keypair.publicKey,
        4 * anchor.web3.LAMPORTS_PER_SOL
      );
      await new Promise( resolve => setTimeout(resolve, 3 * 1000) ); // Sleep 3s
      return keypair;
    }

    async function generateKeypair2() {
      let keypair = anchor.web3.Keypair.generate();
      // await provider.connection.requestAirdrop(
      //   keypair.publicKey,
      //   2 * anchor.web3.LAMPORTS_PER_SOL
      // );
      await new Promise( resolve => setTimeout(resolve, 3 * 1000) ); // Sleep 3s
      return keypair;
    }
    // Generate keypair for the new account

   const newAccount1 = await generateKeypair();

  //  const newAccount1 =  anchor.web3.Keypair.generate();

//    const newAccountKp = anchor.web3.Keypair.generate();
const newAccountKp = await generateKeypair();


    // Send transaction
    const data = new anchor.BN(2 * anchor.web3.LAMPORTS_PER_SOL);

    // await provider.connection.requestAirdrop(
    //   newAccount1.publicKey,
    //   2 * anchor.web3.LAMPORTS_PER_SOL
    // );
    // await new Promise( resolve => setTimeout(resolve, 3 * 1000) ); // Sleep 3s

    // await provider.connection.requestAirdrop(
    //   newAccount1.publicKey,
    //   2 * anchor.web3.LAMPORTS_PER_SOL
    // );
    // let token_airdrop = await provider.connection.requestAirdrop(newAccount1.publicKey, 
    //   100 * LAMPORTS_PER_SOL);

      const newAccount1Balance = await program.provider.connection.getBalance(
        newAccountKp.publicKey
      );

      console.log(newAccount1Balance)

    const tx = await program.methods
      .transferLamports(data)
      .accounts({
        from: newAccount1.publicKey,
        to: newAccountKp.publicKey,
      })
      .signers([newAccount1])
      .transaction();
    const txHash = await anchor.web3.sendAndConfirmTransaction(provider.connection, tx, [newAccount1]);


   // console.log(`https://explorer.solana.com/tx/${txHash}?cluster=devnet`);
    const newAccountBalance = await program.provider.connection.getBalance(
      newAccountKp.publicKey
    );
    assert.strictEqual(
      newAccountBalance,
     3 * data.toNumber(),
      "The new account should have the transferred lamports"
    );
  });



  // it("transferSplTokens", async () => {


  //   async function generateKeypair() {
  //     let keypair = anchor.web3.Keypair.generate();
  //     await provider.connection.requestAirdrop(
  //       keypair.publicKey,
  //       4 * anchor.web3.LAMPORTS_PER_SOL
  //     );
  //     await new Promise( resolve => setTimeout(resolve, 3 * 1000) ); // Sleep 3s
  //     return keypair;
  //   }


  //   // Generate keypairs for the new accounts
  //   const fromKp = await generateKeypair();
  //   const toKp = await generateKeypair();

  //   // Create a new mint and initialize it
  //   const mint = await createMint(
  //     provider.connection,
  //     fromKp,
  //     fromKp.publicKey,
  //     null,
  //     0
  //   );

  //   // Create associated token accounts for the new accounts
  //   const fromAta = await createAssociatedTokenAccount(
  //     provider.connection,
  //     fromKp,
  //     mint,
  //     fromKp.publicKey
  //   );
  //   const toAta = await createAssociatedTokenAccount(
  //     provider.connection,
  //     fromKp,
  //     mint,
  //     toKp.publicKey
  //   );
  //   // Mint tokens to the 'from' associated token account
  //   const mintAmount = 1000;
  //   await mintTo(
  //     provider.connection,
  //     new,
  //     mint,
  //     fromAta,
  //     toKp.publicKey,
  //     mintAmount
  //   );

  //   // Send transaction
  //   const transferAmount = new anchor.BN(500);
  //   const tx = await program.methods
  //     .transferSplTokens(transferAmount)
  //     .accounts({
  //       from: fromKp.publicKey,
  //       fromAta: fromAta,
  //       toAta: toAta,
  //       tokenProgram: TOKEN_PROGRAM_ID,
  //     })
  //     .signers([fromKp, fromKp])
  //     .transaction();
  //   const txHash = await anchor.web3.sendAndConfirmTransaction(provider.connection, tx, [fromKp, fromKp]);
  //   console.log(`https://explorer.solana.com/tx/${txHash}?cluster=devnet`);
  //   const toTokenAccount = await provider.connection.getTokenAccountBalance(toAta);
  //   assert.strictEqual(
  //     toTokenAccount.value.uiAmount,
  //     transferAmount.toNumber(),
  //     "The 'to' token account should have the transferred tokens"
  //   );
  // });



});
