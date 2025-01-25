<script>
  import { ethers } from 'ethers';
  import { walletStore } from '../../stores/walletStore';
  import { imageStore } from '../../stores/imageStore';
  import { Card, Button } from 'flowbite-svelte';
  import { stringToBytes32 } from '$lib/dummySignature'; 
  //import contractABI from '../../artifacts/src/contracts/NFT_V1.sol/AIART721.json' assert { type: 'json' };
  import contractABI from "C:/Users/jarvi/Documents/GIT/GoldanGai_NFTBuilding/src/artifcats/src/contracts/NFT_V1.sol/AIART721.json";
  //import contractABI from '$lib/contracts/AIART721.json'; 

  // Constants
  const CONTRACT_ADDRESS = "0x5115b548a8a834bd291BB2E16F1e74c234AE2e1A";
  const MINTING_PRICE = '0.01';

  // Component state
  let isLoading = false;
  let isMinting = false;
  let successMessage = '';
  let errorMessage = '';
  let ipfsHash = '';
  let mintStatus = '';

  // Reactive provider and signer management
  const provider = $walletStore.provider ? new ethers.BrowserProvider(window.ethereum) : null;
  

  const handleUpload = async () => {
    if (!$imageStore.url) {
      mintStatus = 'Please select a file to upload.';
      return;
    }

    isLoading = true;
    mintStatus = 'Uploading file to Pinata...';
    
    try {
      const response = await fetch('/api/pinata', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl: $imageStore.url }),
      });

      const result = await response.json();
      ipfsHash = result.data;
      mintStatus = 'File uploaded to Pinata!';
    } catch (error) {
      mintStatus = 'Failed to upload file to Pinata.';
      console.error(error);
    } finally {
      isLoading = false;
    }
  };

  const handleMint = async () => {
    // Reset state
    isMinting = true;
    errorMessage = '';
    successMessage = '';
    mintStatus = 'Preparing to mint NFT...';
    
    // Validation checks
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
      // Ensure provider and signer are available
      if (!provider) {
        throw new Error('Wallet not connected');
      }

      const tokenURI = `https://ipfs.io/ipfs/${ipfsHash}`;
      const signerAddress = $walletStore.userAddress;
      console.log("signerAddress", provider.getSigner())
      const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI.abi, provider.getSigner());
      const modelsignature = stringToBytes32("dummySignature")
      
      console.log("contract", contract)
      console.log("dummySignature", modelsignature)
      console.log("tokenURI", tokenURI)
      const tx = await contract.mint(
        signerAddress,
        "Test Prompt",
        tokenURI,
        modelsignature,
        { value: ethers.parseEther(MINTING_PRICE) }
      );

      mintStatus = 'Transaction sent. Waiting for confirmation...';
      const receipt = await tx.wait();

      if (receipt.status === 1) {
        successMessage = `NFT minted successfully! Transaction hash: ${tx.hash}`;
        mintStatus = 'Minting complete!';
      } else {
        throw new Error('Transaction failed');
      }
    } catch (error) {
      console.error('Minting error:', error);
      
      // Enhanced error handling
      errorMessage = error.code === 'INSUFFICIENT_FUNDS' 
        ? 'Insufficient funds for minting.'
        : error.code === 'ACTION_REJECTED'
          ? 'Transaction rejected by user.'
          : 'Failed to mint NFT. Please try again.';
      
      mintStatus = 'Minting failed.';
    } finally {
      isMinting = false;
    }
  };

  const processMint = async () => {
    if ($walletStore.isConnected) {
      await handleUpload();
      await handleMint();
    } else {
      mintStatus = 'Please connect your wallet first.';
    }
  };
</script>

<Card>
  <Button on:click={processMint} disabled={isMinting}>
    {isMinting ? 'Minting...' : 'Mint NFT'}
  </Button>
  
  {#if mintStatus}
    <p>{mintStatus}</p>
  {/if}
  
  {#if errorMessage}
    <p class="text-red-500">{errorMessage}</p>
  {/if}
  
  {#if successMessage}
    <p class="text-green-500">{successMessage}</p>
  {/if}
</Card>