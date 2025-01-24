<script lang="ts">
    import { Card, Button } from 'flowbite-svelte';
    import { getFloorDetails, floorNames } from '$lib/get_floor_api';
    import type { Floor } from '$lib/types';
    import { onMount } from 'svelte';

    let lobbyDetails: Floor | null = null;

    onMount(async () => {
        try {
            lobbyDetails = await getFloorDetails('lobby');
        } catch (error) {
            console.error('Failed to fetch lobby details', error);
        }
    });
</script>

<div class="container mx-auto p-4">
    <h1 class="text-3xl font-bold mb-6">Building Lobby</h1>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        {#each floorNames.filter(f => f !== 'lobby') as floor}
            <Card>
                <h5 class="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                    {floor.replace('floor-', 'Floor ')}
                </h5>
                <Button href={`/${floor}`}>
                    Visit Floor
                </Button>
            </Card>
        {/each}

        {#if lobbyDetails}
            <Card>
                <h5 class="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                    Lobby Details
                </h5>
                <p>{lobbyDetails.description}</p>
            </Card>
        {/if}
    </div>
</div>