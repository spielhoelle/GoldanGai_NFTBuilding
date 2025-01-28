<script lang="ts">
    import { onMount } from 'svelte';
   
    import { Card, Button } from 'flowbite-svelte';
    import { ethers } from 'ethers';
    import { walletStore } from '../../stores/walletStore';
  	export let web3Props: Web3Props;
   
    let walletAddress = null; // Stores the connected wallet address
    let isConnected = false;  // Tracks connection state
    let ethBalance = null;    // Stores the ETH balance
    $: nonce = Math.floor(Math.random() * 1000000);
	  $: signature = '';
    
    // Function to handle wallet connection
    async function connectWallet(): Promise<void> {
        console.log('connectWallet');
        if (!window.ethereum) {
              console.error('MetaMask is not installed!');
              return;
          }
        
		    let provider = new ethers.BrowserProvider(window.ethereum, 'any');
        await provider.send('eth_requestAccounts', []);
        console.log('provider.send');
        const signer = await provider.getSigner();
        const account = await signer.getAddress();
        const network = await provider.getNetwork(); // providerからネットワーク情報を取得
        const chainId = Number(network.chainId); // bigintをnumberに変換
        console.log(signer);
        web3Props = { signer, provider, chainId, account };
        isConnected = true;
        walletAddress = account;
        console.log("walletAddress", walletAddress);
        console.log("Sign in");
        nonce = Math.floor(Math.random() * 1000000);
        signature = await web3Props.signer.signMessage(`Signing one-time nonce: ${nonce}`);
        walletStore.set({
          isConnected: true, 
          walletAddress: walletAddress,
          signature: signature, 
           });
        return;
	}
  </script>
 
  
    {#if isConnected}
      <div class="info">
        <Button>Connected as: {walletAddress}</Button>
      </div>
    {:else}
      <Button class="button connect" on:click={connectWallet}>
        Connect Wallet
      </Button>
    {/if}
