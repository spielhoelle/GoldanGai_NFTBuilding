<script>
  import { Button } from "flowbite-svelte"
  export let toggleSidebar
</script>

<Button
  outline
  color="dark"
  on:click={toggleSidebar}
  class="text-xl border-0"
  aria-label="Toggle Sidebar"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    class="h-8 w-8"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M4 6h16M4 12h8m-8 6h16"
    ></path>
  </svg>
</Button>
