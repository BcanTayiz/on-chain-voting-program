import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { OnchainVoting } from "../target/types/onchain_voting";
import { Connection, LAMPORTS_PER_SOL } from "@solana/web3.js"


describe("onchain-voting", async () => {
  anchor.setProvider(anchor.AnchorProvider.env());
  const program = anchor.workspace.OnchainVoting as Program<OnchainVoting>;
  let voteBank = anchor.web3.Keypair.generate();

    let connection = new Connection("https://api.devnet.solana.com", "confirmed")
    const signature = await connection.requestAirdrop(
      voteBank.publicKey,
      LAMPORTS_PER_SOL * 5
  )

  await connection.confirmTransaction(signature)

  // I followed the documentation but it gives error because transaction fee probably.

  it("Creating vote bank for public to vote", async () => {
    const tx = await program.methods.initVoteBank()
      .accounts({
        voteAccount: voteBank.publicKey,
      })
      .signers([voteBank])
      .rpc();
    console.log("TxHash ::", tx);
  });


  it("Vote for GM", async () => { 
    const tx = await program.methods.gibVote({gm:{}})
    .accounts({
      voteAccount: voteBank.publicKey,
    })
    .rpc();
    console.log("TxHash ::", tx);


    let voteBankData = await program.account.voteBank.fetch(voteBank.publicKey);
    console.log(`Total GMs :: ${voteBankData.gm}`)
    console.log(`Total GNs :: ${voteBankData.gn}`)
  });


  it("Vote for GN", async () => { 
    const tx = await program.methods.gibVote({g:{}})
    .accounts({
      voteAccount: voteBank.publicKey,
    })
    .rpc();
    console.log("TxHash ::", tx);


    let voteBankData = await program.account.voteBank.fetch(voteBank.publicKey);
    console.log(`Total GMs :: ${voteBankData.gm}`)
    console.log(`Total GNs :: ${voteBankData.gn}`)
  });
});