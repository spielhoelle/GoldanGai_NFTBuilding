<script lang="ts">
  import { page } from "$app/stores"
  import { Card, Button } from "flowbite-svelte"
  import { getFloorDetails, type Floor } from "$lib/get_floor_api"
  import { onMount } from "svelte"
  //compoenet
  import ImageGenerator from "$lib/components/AI_imagegen.svelte"
  import { AccordionItem, Accordion } from "flowbite-svelte"

  //import MintNft from '$lib/components/MintNFT.svelte';
  let floor: Floor | null = null
  let error: string | null = null
  let floorParam: string
  let selectedRoom: string = ""

  onMount(async () => {
    try {
      floorParam = $page.params.floor

      console.log("Fetching floor:", floorParam)

      const response = await getFloorDetails(floorParam)
      if (!response.ok) {
        // If the response isn't OK, show an error
        throw new Error("Failed to fetch floor details")
      }
      floor = await response.json() // Parse the JSON data returned from getFloorDetails
      console.log("Fetched floor details:", floor?.floorName)
    } catch (err) {
      error = "Failed to fetch floor details"
      console.error("Fetch error:", err)
    }
  })

  // Function to handle room selection
  function toggleSelection(roomStyle: string) {
    // If the room is already selected, deselect it; otherwise, select the new room
    if (selectedRoom === roomStyle) {
      selectedRoom = ""
    } else {
      selectedRoom = roomStyle
    }
  }
</script>

{#if floor}
  <div class="flex flex-wrap justify-center min-h-full w-full">
    <Card class="" size="lg" padding="xl">
      <h1 class="text-3xl font-bold mb-4">
        {$page.params.floor === "lobby"
          ? "Lobby"
          : $page.params.floor.replace("floor-", "Floor ")}
      </h1>
      <p class="mb-4">{floor.description}</p>
      <p class="mb-4">Floor theme {floor.style}</p>

      <div class="mt-8">
        <h2 class="text-2xl font-semibold mb-4">Rooms</h2>
        <Accordion>
          {#each floor.rooms as room, index}
            <AccordionItem open={index == 0}>
              <span slot="header">{room.roomName}</span>
              <input
                type="checkbox"
                class="right-2"
                on:change={() => toggleSelection(room.roomName)}
                checked={selectedRoom === room.roomName}
              />
              <p>{room.description}</p>

              {#if room.room_prompt}
                <p><strong>Style:</strong> {room.room_prompt}</p>
              {/if}
            </AccordionItem>
          {/each}
        </Accordion>
      </div>

      <Button href="/">Back to Lobby</Button>
    </Card>
    <ImageGenerator roomStyle={selectedRoom} floorStyle={floor.style!} />
    <!--<MintNft/>-->
  </div>
{:else if error}
  <div
    class="container mx-auto p-4 flex justify-center items-center min-h-screen"
  >
    <Card class="w-full max-w-4xl p-8">
      <p class="text-red-500">{error}</p>
    </Card>
  </div>
{:else}
  <p>Loading...</p>
{/if}
