<script lang="ts">
    import { onMount } from 'svelte';
   
    import { Card, Button } from 'flowbite-svelte';
    import { ethers } from 'ethers';
	export let web3Props: Web3Props;
   
    let walletAddress = null; // Stores the connected wallet address
    let isConnected = false;  // Tracks connection state
    let ethBalance = null;    // Stores the ETH balance
  
    // Function to handle wallet connection
    async function connectWallet() {
        if (!window.ethereum) {
            console.error('MetaMask is not installed!');
            return;
        }
        
        let provider = new ethers.BrowserProvider(window.ethereum, 'any');
        await provider.send('eth_requestAccounts', []);
        
        const signer = await provider.getSigner();
        const account = await signer.getAddress();
        const network = await provider.getNetwork(); // providerからネットワーク情報を取得
        const chainId = network.chainId; // ネットワーク情報からチェーンIDを取得
        
        web3Props = { signer, provider, chainId, account };
    }
  </script>
 
  
  <Card>
    {#if isConnected}
      <div class="info">
        <p>Connected as: {walletAddress}</p>
      </div>
    {:else}
      <Button class="button connect" on:click={connectWallet}>
        Connect Wallet
      </Button>
    {/if}
  </Card>