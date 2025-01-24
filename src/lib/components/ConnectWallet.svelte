<script>
    import { onMount } from 'svelte';
    import { Card, Button } from 'flowbite-svelte';
    import { ethers } from 'ethers';
    
    import detectEthereumProvider from '@metamask/detect-provider';
   // import { walletStore } from '../../stores/walletStore';
    import { get } from 'svelte/store'; // Import `get` to read from the store
    import { MetaMaskStore } from "$lib";
    const { walletState, isMetaMaskPresent, connect, loaded, init,disconnect, mintNFT } = MetaMaskStore();
    console.log("wallet",$walletState.account)
    onMount(() => {
        init();
    });
    //const { isConnected, userAddress } = get(walletStore);
  </script>
  
  <main>
    
    {#if $loaded}
    {#if $isMetaMaskPresent}
    {#if Boolean($walletState.account)}
        <Button on:click={disconnect}> `${$walletState.account}`</Button>
    {:else}
        <Button on:click={connect}> Connect Wallet </Button>
    {/if}
    {:else}
    <Button href="https://metamask.io/ja/download/"> Please install MetaMask </Button>
    {/if}
    {:else}
    <p>Loading...</p>
    {/if}

  
</main>