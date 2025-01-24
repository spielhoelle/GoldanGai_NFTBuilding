<script>
    import { onMount } from 'svelte';
    import { walletStore } from '../../stores/walletStore';
    import {imageUrlStore } from '../../stores/imageStore';
    import { get } from 'svelte/store';
    import { Card, Button } from 'flowbite-svelte';
    import { MetaMaskStore } from "$lib";
    import { uploadFileToPinata } from '$lib/ipfs'; // Import the IPFS utility
    const { walletState, isMetaMaskPresent, connect, loaded, init, disconnect, mintNFT } = MetaMaskStore();
  
    let mintStatus = '';
    let isLoading = false;
    //let file = null; // File to upload
    let ipfsHash = ''; // IPFS hash of the uploaded file
  
    // Replace with your NFT contract address and ABI
    const contractAddress = '0xYourNFTContractAddress';
    const contractABI = [
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "to",
            "type": "address"
          }
        ],
        "name": "mint",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      }
    ];
    // Subscribe to the store
   
    // Handle file upload to Pinata
    const handleUpload = async () => {
        if (!imageUrlStore) {
            mintStatus = 'Please select a file to upload.';
            return;
        }

        isLoading = true;
        mintStatus = 'Uploading file to Pinata...';

        try {
            const result = await uploadFileToPinata(imageUrlStore);
            ipfsHash = result.IpfsHash;
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
        if (!walletState.account) {
            mintStatus = 'Please connect your wallet first.';
            return;
        }

        if (!ipfsHash) {
            mintStatus = 'Please upload a file to Pinata first.';
            return;
        }

        isLoading = true;
        mintStatus = 'Minting NFT...';

        try {
            const tokenURI = `https://ipfs.io/ipfs/${ipfsHash}`;
            await mintNFT(contractAddress, contractABI, walletState.account, tokenURI);
            mintStatus = 'NFT Minted Successfully!';
        } catch (error) {
            mintStatus = 'Failed to mint NFT.';
            console.error(error);
        } finally {
            isLoading = false;
        }
    };

  
    // Initialize the store when the component mounts
    onMount(() => {
      init();
    });
  </script>


<Card>
    <h2>Mint NFT</h2>
    {#if !$isMetaMaskPresent}
      <p>Please install MetaMask!</p>
    {:else if !$walletState.account}
      <Button on:click={connect}>Connect Wallet</Button>
    {:else}
      <Button on:click={handleMint} disabled={isLoading}>
        {isLoading ? 'Minting...' : 'Mint NFT'}
      </Button>
    {/if}
    {#if mintStatus}
      <p>{mintStatus}</p>
    {/if}
  </Card>
  