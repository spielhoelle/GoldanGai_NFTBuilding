<script lang="ts">
  //import { page } from '$app/stores';
  import {
    Sidebar,
    SidebarGroup,
    SidebarItem,
    Button,
    Toggle,
  } from "flowbite-svelte"
  import { floorNames } from "$lib/get_floor_api"
  import { onMount } from "svelte"
  import "../app.css"
  import ConnectWallet from "$lib/components/ConnectWallet.svelte"
  import { browser } from "$app/environment"

  let sidebarOpen = false
  let width: number
  function toggleSidebar() {
    sidebarOpen = !sidebarOpen
  }
  onMount(() => {
    width = window.innerWidth
  })

  let darkMode = true

  function handleSwitchDarkMode() {
    darkMode = !darkMode

    localStorage.setItem("theme", darkMode ? "dark" : "light")

    darkMode
      ? document.documentElement.classList.add("dark")
      : document.documentElement.classList.remove("dark")
  }

  if (browser) {
    if (
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.documentElement.classList.add("dark")
      darkMode = true
    } else {
      document.documentElement.classList.remove("dark")
      darkMode = false
    }
  }
</script>

<style>
  /* Adjust main content to respect the top bar */
  main {
    margin-top: 4rem; /* Push main content below the header */
  }

  .header {
    z-index: 50; /* Ensure header is always on top */
  }

  .sidebar {
    z-index: 40; /* Sidebar should appear below the header */
  }

  .main-content {
    overflow-y: auto;
    height: calc(100vh - 4rem); /* Take the remaining height below the header */
  }
</style>

<div class="header h-16 flex items-center justify-between px-4 bg-primary">
  <Button on:click={toggleSidebar} class="text-xl" aria-label="Toggle Sidebar">
    ☰
  </Button>

  <h1 class="text-center flex-grow text-white text-lg font-bold">
    GoldenGai AI gen party
  </h1>

  <div class="mr-2">
    <label for="theme-toggle" class="flex">
      <span class="mr-2">DarkTheme</span>
      <Toggle
        checked={darkMode}
        on:click={handleSwitchDarkMode}
        type="checkbox"
        id="theme-toggle"
      />
    </label>
  </div>

  <ConnectWallet />
</div>
<div class="flex h-screen">
  <Sidebar style={sidebarOpen ? "display: block;" : "display: none;"}>
    <SidebarGroup>
      {#each floorNames as floor}
        <SidebarItem
          href={floor.floorName === "lobby" ? "/" : `/${floor}`}
          label={floor.floorName === "lobby"
            ? "Lobby"
            : floor.floorName.replace("floor-", "Floor ")}
          on:click={toggleSidebar}
        />
      {/each}
    </SidebarGroup>
  </Sidebar>

  <main class="flex-grow relative p-4">
    <div class="z-50">
      <slot />
    </div>
  </main>
</div>
