<script lang="ts">
    import { page } from '$app/stores';
    import { Card, Button } from 'flowbite-svelte';
    import { getFloorDetails } from '$lib/get_floor_api';
    import type { Floor } from '$lib/types';
    import { onMount } from 'svelte';
    //compoenet 
    import ImageGenerator from '$lib/components/AI_imagegen.svelte';
    import MintNft from '$lib/components/MintNFT.svelte';
    // vals set 
    let floor: Floor | null = null;
    let error: string | null = null;
    let floorParam: string;
    let selectedRoom: string | null = null; // Track only one selected room
  
    onMount(async () => {
        try {
            floorParam = $page.params.floor;

            console.log('Fetching floor:', floorParam);
            
            const  response = await getFloorDetails(floorParam);
            if (!response.ok) {
                // If the response isn't OK, show an error
                throw new Error('Failed to fetch floor details');
            }
            floor = await response.json();  // Parse the JSON data returned from getFloorDetails
            console.log('Fetched floor details:', floor?.floorName);
        } catch (err) {
            error = 'Failed to fetch floor details';
            console.error('Fetch error:', err);
        }
    });


        // Function to handle room selection
    function toggleSelection(roomStyle: string) {
        // If the room is already selected, deselect it; otherwise, select the new room
        if (selectedRoom === roomStyle) {
        selectedRoom = null;
        } else {
        selectedRoom = roomStyle;
        }
     }
</script>

{#if floor}
    <div class="container mx-auto flex justify-center min-h-full">
        <Card class="w-full max-w-4xl p-8">
            <h1 class="text-3xl font-bold mb-4">
                {$page.params.floor === 'lobby' ? 'Lobby' : $page.params.floor.replace('floor-', 'Floor ')}
            </h1>
            <p class="mb-4">{floor.description}</p>
            <p class="mb-4">Floor theme {floor.style}</p>

            <div class="mt-8">
                <h2 class="text-2xl font-semibold mb-4">Rooms</h2>
                {#each floor.rooms as room}
                <Card class="mb-6 p-4 relative">
                    <input 
                    type="checkbox" 
                    class="absolute top-2 right-2" 
                    on:change={() => toggleSelection(room.room_style)}
                    checked={selectedRoom === room.room_style} 
                  />
                    <h3 class="text-xl font-bold">{room.roomName}</h3>
                    <p>{room.description}</p>
                    
                    {#if room.room_style}
                      <p><strong>Style:</strong> {room.room_style}</p>
                    {/if}
                  </Card>
                {/each}
              </div>

            <Button href="/">Back to Lobby</Button>
        </Card>
        <ImageGenerator roomStyle={selectedRoom} floorStyle={floor.style} />
        <MintNft/>  
    </div>


    {:else if error}
    <div class="container mx-auto p-4 flex justify-center items-center min-h-screen">
        <Card class="w-full max-w-4xl p-8">
            <p class="text-red-500">{error}</p>
        </Card>
    </div>
{:else}
    <p>Loading...</p>
{/if}