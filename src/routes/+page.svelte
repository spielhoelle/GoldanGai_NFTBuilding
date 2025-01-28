<script lang="ts">
  import { floorNames, getFloorDetails } from "$lib/get_floor_api"
  import type { Floor } from "$lib/types"
  import { Button, Card, GradientButton } from "flowbite-svelte"
  import { onMount } from "svelte"
  import { ArrowRightOutline } from "flowbite-svelte-icons"
  let lobbyDetails: Floor | null = null

  onMount(async () => {
    try {
      const response = await getFloorDetails("lobby")
      if (!response.ok) {
        throw new Error("Network response was not ok")
      }
      // Assuming getFloorDetails returns a Response object
      lobbyDetails = await response.json() // Parse the JSON body
      console.log(lobbyDetails)
    } catch (error) {
      console.error("Failed to fetch lobby details", error)
    }
  })
</script>

<div class="container mx-auto p-4">
  <div class="flex items-center justify-between mt-3 px-3 z-10">
    <div class="relative w-full">
      <input
        type="text"
        class="bg-purple-white shadow rounded-xl border-0 p-3 w-full"
        placeholder="Search somthing..."
      />
      <div class="absolute top-0 right-0 p-4 pr-3 text-purple-lighter">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          ></path>
        </svg>
      </div>
    </div>
  </div>
  <h1 class="text-3xl font-bold mb-6">Building Lobby</h1>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
    {#each floorNames.filter((f) => f.floorName !== "lobby") as floor}
      <Card href={`/${floor.floorName}`} class="hover:bg-primary-50 max-w-xl">
        <h5
          class="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-3"
        >
          {floor.floorName.replace("floor-", "Floor ")}
        </h5>
        <p
          class="mb-3 font-normal text-gray-700 dark:text-gray-400 leading-tight"
        >
          Style: <code>{floor.style}</code><br />
          Rooms: <code>{floor.rooms.length}</code>
        </p>
        <p
          class="mb-3 font-normal text-gray-700 dark:text-gray-400 leading-tight"
        ></p>
        <p
          class="mb-3 font-normal text-gray-700 dark:text-gray-400 leading-tight"
        >
          {floor.description}
        </p>
        <a
          href={`/${floor.floorName}`}
          class="inline-flex items-center text-primary-600 hover:underline mt-3"
        >
          Visit Floor
          <ArrowRightOutline class="w-4 h-4 ms-2.5" />
        </a>
      </Card>
    {/each}

    {#if lobbyDetails}
      <Card class="max-w-xl">
        <h5
          class="text-2xl font-bold tracking-tight text-gray-900 dark:text-white"
        >
          Lobby Details
        </h5>
        <p>{lobbyDetails.description}</p>
      </Card>
    {/if}
  </div>
</div>
