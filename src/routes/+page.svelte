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
  <h1 class="text-3xl font-bold mb-6">Building Lobby</h1>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
    {#each floorNames.filter((f) => f.floorName !== "lobby") as floor}
      <Card href={`/${floor.floorName}`} class="hover:bg-primary-50">
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

        <!-- <Button href={`/${floor.floorName}`} outline> -->
        <!--   Visit Floor <ArrowRightOutline class="w-6 h-6 text-white" /> -->
        <!-- </Button> -->
      </Card>
    {/each}

    {#if lobbyDetails}
      <Card>
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

