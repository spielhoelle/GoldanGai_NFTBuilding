<script lang="ts">
  import { onMount } from "svelte"
  import { type Image, imageStore } from "../../stores/imageStore"
  import { Card, Button } from "flowbite-svelte"
  import { afterNavigate } from "$app/navigation"
  //let imageUrlStore: string | null = null;  // Holds the URL of the generated image

  let isLoading: boolean = false // To show loading state
  let errorMessage: string | null = null // To display error message

  export let roomStyle: string
  export let floorStyle: string

  async function generateImage() {
    if (!roomStyle || !floorStyle) {
      errorMessage = "Both room style and floor style are required."
      return
    }

    isLoading = true // Start loading
    errorMessage = null // Reset error message
    const inputText = `${roomStyle} in the stlye of ${floorStyle} style`
    try {
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: inputText }), // Pass the input text as prompt
      })
      if (response.ok) {
        const data = await response.json()
        imageStore.update((items) => {
          items.push({
            url: data.output[0],
            prompt: inputText,
            genInfo: data,
            model: data.model,
            date: new Date(),
            author: "TEST",
            path: window.location.pathname,
          })
          return items
        })
        floorImages = $imageStore.filter((i) => i.path === window.location.pathname)
      } else {
        errorMessage = "Failed to generate image. Please try again."
      }
    } catch (error) {
      console.error("Error:", error)
      errorMessage = "An error occurred while generating the image."
    } finally {
      isLoading = false // Stop loading
    }
  }

  let floorImages: Image[]
  floorImages = $imageStore.filter((i) => i.path === window.location.pathname)
  afterNavigate(() => {
    floorImages = $imageStore.filter((i) => i.path === window.location.pathname)
  })
</script>

<Card>
  <!-- Input fields for room and floor style -->
  <div class="mb-4">
    <input
      type="text"
      bind:value={roomStyle}
      placeholder="Enter room style"
      class="border p-2 w-full mb-2"
    />
    <input
      type="text"
      bind:value={floorStyle}
      placeholder="Enter floor style"
      class="border p-2 w-full"
    />
  </div>

  <!-- Generate button -->
  <Button on:click={generateImage} class="mb-4">Generate Image</Button>

  <!-- Show loading state -->
  {#if isLoading}
    <div class="loading-box p-4 text-center bg-gray-200">
      <p>Generating image... Please wait.</p>
    </div>
  {/if}

  <!-- Show generated image -->
  {#if $imageStore.length > 0}
    {#each floorImages as fI}
      <div class="mt-4">
        <h3 class="text-xl font-semibold mb-2">Generated Image</h3>
        <img src={fI.url} alt="Generated style image" class="w-full mx-auto" />
        <div class="mt-2 p-2 border bg-gray-100">
          <h4 class="text-lg font-medium">Generation Info:</h4>
          <pre class="text-sm overflow-auto max-h-32">{JSON.stringify(
              fI.genInfo,
              null,
              2,
            )}</pre>
        </div>
      </div>
    {/each}
  {/if}

  <!-- Show error message -->
  {#if errorMessage}
    <div class="mt-4 p-4 bg-red-200 text-red-700">
      <p>{errorMessage}</p>
    </div>
  {/if}
</Card>

<style>
  .loading-box {
    background-color: #f3f3f3;
    color: #333;
    font-size: 16px;
    border-radius: 4px;
  }
</style>
