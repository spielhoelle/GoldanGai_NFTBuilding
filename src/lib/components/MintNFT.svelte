<script lang="ts">
  import { onMount } from 'svelte';
  import { ethers } from 'ethers';
  import { walletStore } from '../../stores/walletStore';
  import { imageStore } from '../../stores/imageStore';
  import { Card, Button } from 'flowbite-svelte';
  //import { CONTRACT_ADDRESS,  CONTRACT_ARTIFACT } from '$env/static/public';
  import { mintNFT } from '$lib/mint';
  import { stringToBytes32 } from '$lib/dummySignature';

  let provider = walletStore.providers //.Web3Provider;
  let signer=  walletStore.Signer;
  let successMessage: string = '';
  let errorMessage: string = '';
  let ipfsHash: string = ''; // IPFS hash of the uploaded file
  let isMinting: boolean = false;
  let isLoading: boolean = false;
  let mintStatus: string = ''; // For status updates like upload or minting
  let contract_address = "0x5115b548a8a834bd291BB2E16F1e74c234AE2e1A";
  let contract_artiface = "../artifcats/src/contracts/NFT_V1.sol/AIART721.json";
  // Handle file upload to Pinata
  const handleUpload = async () => {
      if (!$imageStore.url) {
          mintStatus = 'Please select a file to upload.';
          return;
      }

      isLoading = true;
      mintStatus = 'Uploading file to Pinata...';

      try {
          console.log("image url", $imageStore.url);
          const response = await fetch('/api/pinata', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({ imageUrl: $imageStore.url }),
          });

          const result = await response.json();
          console.log("personal result", result);
          ipfsHash = result.data;
          mintStatus = 'File uploaded to Pinata!';
      } catch (error) {
          mintStatus = 'Failed to upload file to Pinata.';
          console.error(error);
      } finally {
          isLoading = false;
      }
  };

  // Handle minting
  const handleMint = async () => {
      isMinting = true;
      errorMessage = '';
      successMessage = '';
      if (!$walletStore.userAddress) {
          mintStatus = 'Please connect your wallet first.';
          isMinting = false;
          return;
      }
      if (!ipfsHash) {
          mintStatus = 'Please upload a file to Pinata first.';
          isMinting = false;
          return;
      }

      try {
          const tokenURI = `https://ipfs.io/ipfs/${ipfsHash}`;
          const contractArtifact = require(contract_artiface);
          const contractABI = contractArtifact.abi;
          
          const tx = await mintNFT(
              provider,
              signer,
              contract_address,
              contractABI,
              'prompt', // Define prompt properly or pass it dynamically
              "test",
              stringToBytes32("dummySignature")
          );
          successMessage = `NFT minted successfully: ${tx.hash}`;
      } catch (error) {
          errorMessage = 'Failed to mint NFT.';
          isMinting = false;
          console.error(error);
      } finally {
          isMinting = false;
      }
  };
  //async function generateImage(
  async function processMint(){
      await handleUpload();
      await handleMint();
  };

  // Initialize the store when the component mounts

</script>

<Card>
  <Button on:click={processMint} disabled={isMinting}>
      {isMinting ? 'Minting...' : 'Mint NFT'}
  </Button>
  {#if mintStatus}
      <p>{mintStatus}</p>
  {/if}
  {#if errorMessage}
      <p>{errorMessage}</p>
  {/if}
  {#if successMessage}
      <p>{successMessage}</p>
  {/if}
</Card>
