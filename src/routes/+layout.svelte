<script lang="ts">
    //import { page } from '$app/stores';
    import { Sidebar, SidebarGroup, SidebarItem, Button } from 'flowbite-svelte';
    import { floorNames } from '$lib/get_floor_api';
    import { onMount } from 'svelte';
    import '../app.css';
    import ConnectWallet from '$lib/components/ConnectWallet.svelte';
    
    let sidebarOpen = false;
    let width: number;
    function toggleSidebar() {
        sidebarOpen = !sidebarOpen;
    }
    onMount(() => {
        width = window.innerWidth;
    });
</script>


<div class="header h-16 flex items-center justify-between bg-gray-800 px-4">
  <!-- Toggle Menu Button (Visible on small screens) -->
  <Button
    on:click={toggleSidebar}
    class="text-xl"
    aria-label="Toggle Sidebar"
  >
    ☰
  </Button>

  <!-- Title (Centered) -->
  <h1 class="text-center flex-grow text-white text-lg font-bold">GoldenGai AI gen party </h1>

  <!-- Connect Wallet Button -->
  <ConnectWallet/>
</div>
<div class="flex h-screen">
    <Sidebar style={sidebarOpen ? 'display: block;' : 'display: none;'}>
     
      <SidebarGroup>
        {#each floorNames as floor}
          <SidebarItem
            href={floor === 'lobby' ? '/' : `/${floor}`}
            label={floor === 'lobby' ? 'Lobby' : floor.replace('floor-', 'Floor ')}
            on:click={toggleSidebar}
          />
        {/each}
      </SidebarGroup>
    </Sidebar>
  
    <main class="flex-grow relative p-4">
       
        

      <div class="absolute top-4 right-4 z-50">
        <slot />
      </div>
    </main>
  </div>