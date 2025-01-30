<script lang="ts">
  import { ethers } from 'ethers';
  import { Button } from 'flowbite-svelte';
  import { walletStore } from '../../stores/walletStore';
  import { imageStore } from '../../stores/imageStore';
  

  // Component props
  export let prompt: string;
  export let imageUrl: string;
  export let mintingPrice: number; 
  
  /// Contract variables
  let contractAddress = '';
  let contractArtifact: any = {};
  let mintingPriceFromAPI = '';

  // Component state
  let isMinting = false;
  let mintStatus = '';
  let successMessage = '';
  let errorMessage = '';
  // Fetch contract details from API
  const fetchConfig = async () => {
    try {
      const response = await fetch('/api/nftconfig');
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      console.log(data)
      
      contractAddress = data.contractAddress;
      contractArtifact = data.contractArtifact;
      mintingPriceFromAPI = data.mintingPrice;
    } catch (error) {
      console.error('Failed to fetch contract config:', error);
    }
  };

  fetchConfig();
  // Function to handle the minting process
  const handleMint = async () => {
    if (!$walletStore.isConnected) {
      mintStatus = 'Please connect your wallet first.';
      return;
    }

    if (!imageUrl) {
      mintStatus = 'No image URL provided.';
      return;
    }

    isMinting = true;
    mintStatus = 'Uploading image to IPFS...';

    try {
      // Upload image to IPFS
      const response = await fetch('/api/pinata', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl }),
      });

      const result = await response.json();
      const ipfsHash = result.data.IpfsHash;
      mintStatus = 'Image uploaded to IPFS. Minting NFT...';

      // Initialize Ethereum provider and contract
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractArtifact.abi, signer);

      // Mint NFT
      const tx = await contract.mint(
        await signer.getAddress(),
        prompt,
        "AI Image",
        ethers.randomBytes(32),
        ipfsHash,
        { value: ethers.parseEther(mintingPriceFromAPI) }
      );

      mintStatus = 'Awaiting transaction confirmation...';
      const receipt = await tx.wait();

      if (receipt.status === 1) {
        successMessage = `NFT minted successfully! Transaction Hash: ${tx.hash}`;
        mintStatus = 'Minting completed.';
      } else {
        throw new Error('Transaction failed.');
      }
    } catch (error) {
      console.error('Minting error:', error);
      errorMessage = 'Failed to mint NFT. Please try again.';
      mintStatus = 'Minting failed.';
    } finally {
      isMinting = false;
    }
  };
</script>

<Button class="bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-md transition-colors" 
  on:click={handleMint} 
  disabled={isMinting || !$walletStore.isConnected}>
  {isMinting ? 'Minting...' : `Mint ${mintingPriceFromAPI} ETH`}
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