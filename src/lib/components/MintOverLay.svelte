<script lang="ts">
    import { imageStore } from "../../stores/imageStore";
    import { isMintOverlayOpen, mintImageId } from "../../stores/overlaysStore";

    import { Button } from "flowbite-svelte";
    import { walletStore } from "../../stores/walletStore";
    import type { Image } from "../../stores/imageStore";
    import WalletConnectV2 from "$lib/components/WalletConnect_v2.svelte"
    import MintButton from "$lib/components/MintButton.svelte"
    // Reactive declarations
    let images: Image[] = [];
    let MintImage: Image | undefined;
    let mintstatus = "none";
    let mintprice = "0.01";

    // Subscribe to stores
    $: images = $imageStore;
    $: MintImage = images[$mintImageId];
</script>

<div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div class="relative bg-gray-900 text-white rounded-md p-8 max-w-lg w-11/12 shadow-lg">
        <button on:click={() => isMintOverlayOpen.set(false)} class="absolute top-2 right-3 text-4xl text-gray-300 hover:-translate-y-0.5 transform transition-transform">X</button>
        <h1 class="text-2xl font-bold mb-4">Mint NFT</h1>
        {#if MintImage}
            <img src={MintImage.url} alt="Image" class="mb-4 rounded-md">
            <p><strong>Prompt:</strong> {MintImage.prompt}</p>
            <p><strong>Author:</strong> {MintImage.author}</p>
            <p><strong>Date:</strong> {MintImage.date?.toLocaleDateString()}</p>
            <p><strong>Model:</strong> {MintImage.model}</p>
            <p><strong>Path:</strong> {MintImage.path}</p>
            <div class="flex justify-center mt-4">
                {#if !$walletStore.isConnected}
                    <WalletConnectV2 ButtonText="Connect Wallet" />
                {/if}
                <MintButton prompt={MintImage.prompt} imageUrl={MintImage.url} mintingPrice={mintprice} />
                
            </div>
        {:else}
            <p>No image selected for minting.</p>
        {/if}
    </div>
</div>