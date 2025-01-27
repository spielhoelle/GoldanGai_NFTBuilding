<script lang="ts">
  import { ethers } from 'ethers';
 

  import { solidityPackedKeccak256,getBytes  } from 'ethers'
  import { walletStore } from '../../stores/walletStore';
  import { imageStore } from '../../stores/imageStore';
  import { Card, Button } from 'flowbite-svelte';
  import { stringToBytes32 } from '$lib/dummySignature'; 
  //import contractABI from '../../artifacts/src/contracts/NFT_V1.sol/AIART721.json' assert { type: 'json' };
  import contractABI from "../../artifcats/src/contracts/NFT_V1.sol/AIART721.json"
  //import contractABI from '$lib/contracts/AIART721.json'; 
  export let web3Props: Web3Props;
  // Constants0xf853742aFA6c5f87F1B89E151d35fE8aB4459296
  const CONTRACT_ADDRESS = "0xA631e2a392f5b6a3d3E7a44434C0bB7403E7f417";
  const MINTING_PRICE = '0.01';

  // Component state
  let provider: ethers.BrowserProvider | null = null;
  let isLoading = false;
  let isMinting = false;
  let successMessage = '';
  let errorMessage = '';
  let ipfsHash = '';
  let mintStatus = '';
  let userSignature = '';
  let prompt = $imageStore[0].prompt;
  // Reactive provider and signer management
  //let provider = web3Props.provider ? new ethers.BrowserProvider(window.ethereum) : null;
  const handleUpload = async () => {
    if (!$imageStore[0].url) {
      mintStatus = 'Please select a file to upload.';
      return;
    }

    isLoading = true;
    mintStatus = 'Uploading file to Pinata...';
    
    try {
      const response = await fetch('/api/pinata', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl: $imageStore[0].url }),
      });

      const result = await response.json();
      ipfsHash = result.data.IpfsHash;
      console.log("ipfsHash", ipfsHash)
      mintStatus = 'File uploaded to Pinata!';
      return ipfsHash;
    } catch (error) {
      mintStatus = 'Failed to upload file to Pinata.';
      console.error(error);
    } finally {
      isLoading = false;
    }
  };

  async function signMintRequest() {

    if (!provider || !web3Props.signer) {
      throw new Error('Wallet not connected');
    }
    
    const message = solidityPackedKeccak256(
      ['string', 'address', 'uint256'],
      [prompt, web3Props.account, Date.now()]
    );
    
    userSignature = await web3Props.signer.signMessage(getBytes(message));
    return userSignature;
  }

   // Mint NFT
   const handleMint = async () => {
    // Reset state
    isMinting = true;
    errorMessage = '';
    successMessage = '';
    mintStatus = 'Preparing to mint NFT...';

    // Validation checks
    if (!$walletStore.isConnected) {
      mintStatus = 'Please connect your wallet first.';
      isMinting = false;
      return;
    }

    const uploadedHash = await handleUpload();
    console.log("uploadedHash", uploadedHash)
    if (!uploadedHash) {
      isMinting = false;
      mintStatus = "Failed to upload file to Pinata."
      return;
    }
   
    try {
      // Ensure provider is available
      if (!window.ethereum) {
        throw new Error('Ethereum wallet not detected');
      }

      provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI.abi, signer);

      //const tokenURI = `https://ipfs.io/ipfs/${uploadedHash}`;
      //const tokenURI = uploadedHash ? `ipfs://${uploadedHash}` : '';
      const signerAddress = await signer.getAddress();
      
    
      mintStatus = 'Minting NFT...';
      const tx = await contract.mint(
        signerAddress,
        prompt,
        "AI Image",
        ethers.randomBytes(32),
        uploadedHash,    // tokenURI
        { 
          value: ethers.parseEther(MINTING_PRICE),
        //  gasLimit: 300000 
        }
      );

      mintStatus = 'Waiting for blockchain confirmation...';
      const receipt = await tx.wait();
      console.log("receipt", receipt.status)
      console.log("receipt", receipt)
      while (receipt.status != 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const receipt = await tx.wait();
        console.log("receipt", receipt.status)
      }


      if (receipt.status === 1) {
        successMessage = `NFT minted successfully! Transaction Hash: ${tx.hash}`;
        mintStatus = 'Mint completed';
      }
    } catch (error) {
      console.error('Minting error:', error);
      
      const errorHandlers = {
        'INSUFFICIENT_FUNDS': 'Insufficient funds for minting.',
        'ACTION_REJECTED': 'Transaction was cancelled.',
        'NETWORK_ERROR': 'Network error. Check your connection.',
        'default': 'Failed to mint NFT. Please try again.'
      };

      errorMessage = (error as any).code 
        ? errorHandlers[error.code as keyof typeof errorHandlers] || errorHandlers.default
        : errorHandlers.default;
      
      mintStatus = 'Minting failed';
    } finally {
      isMinting = false;
    }
  };

  // Optional: Add wallet connection logic if not already handled
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
      } catch (error) {
        console.error('Wallet connection failed:', error);
      }
    }
  };
</script>

<Card>
  <div class="space-y-4">
    <Button 
      on:click={handleMint} 
      disabled={isMinting || !$imageStore.url || !$walletStore.isConnected}
    >
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

    {#if !$walletStore.isConnected}
      <Button on:click={connectWallet}>Connect Wallet</Button>
    {/if}
  </div>
</Card>
