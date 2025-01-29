<script lang="ts">
<<<<<<< Updated upstream
  import { onMount } from "svelte"
  import { imageStore } from "../../stores/imageStore"
  import { Card, Button } from "flowbite-svelte"
  //let imageUrlStore: string | null = null;  // Holds the URL of the generated image
=======
  import { afterNavigate } from "$app/navigation"
  import { Accordion, AccordionItem, Button, Card } from "flowbite-svelte"
  import { type Image, imageStore } from "../../stores/imageStore"
  import {isMintOverlayOpen,mintImageId} from "../../stores/overlaysStore"
  import { afterUpdate } from "svelte"
>>>>>>> Stashed changes

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
    const inputText = `a cute cat in the style of ${roomStyle} with a background in the style of ${floorStyle} style`
    // imageStore.set({
    //   ...$imageStore, // Spread the current store values
    //   url: "",
    //   prompt: inputText,
    // }) // Reset previous image

    try {
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: inputText }), // Pass the input text as prompt
      })

      // Handle the response
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
<<<<<<< Updated upstream
=======
            path: window.location.pathname,
            id: items.length,
>>>>>>> Stashed changes
          })
          return items
        })
        // imageUrlStore.set(data.output[0]); // Assuming the response contains the image URL
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
<<<<<<< Updated upstream
=======

  afterUpdate(() => {
    canSubmit = roomStyle !== ""
  })
  let floorImages: Image[]
  floorImages = $imageStore.filter((i) => i.path === window.location.pathname)
  afterNavigate(() => {
    floorImages = $imageStore.filter((i) => i.path === window.location.pathname)
  })

  function toggleSelectionImage(value: number, id: number) {
    selectedImage = value
    mintImageId.set(id)
    console.log(selectedImage,id)
    
  }
>>>>>>> Stashed changes
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
    <div class="mt-4">
      <h3 class="text-xl font-semibold mb-2">Generated Image</h3>
      <img
        src={$imageStore[0].url}
        alt="Generated style image"
        class="w-full mx-auto"
      />
      <div class="mt-2 p-2 border bg-gray-100">
        <h4 class="text-lg font-medium">Generation Info:</h4>
        <pre class="text-sm overflow-auto">{JSON.stringify(
            $imageStore[0].genInfo,
            null,
            2,
          )}</pre>
      </div>
    </div>
  {/if}

  <!-- Show error message -->
  {#if errorMessage}
    <div class="mt-4 p-4 bg-red-200 text-red-700">
      <p>{errorMessage}</p>
    </div>
  {/if}
<<<<<<< Updated upstream
=======

  <!-- Show generated image -->
  {#if $imageStore.length > 0}
    <Accordion>
      {#each floorImages as fI, index}
        <AccordionItem open={index == 0}>
          <span slot="header">{fI.prompt}</span>
          <div class="">
            <h3 class="text-xl font-semibold mb-2">
              <input
                type="checkbox"
                class="border p-2"
                on:change={() => toggleSelectionImage(index,fI.id) }
                checked={selectedImage == index}
              />
              Generated Image
            </h3>
            <div class="flex w-80">
              <img src={fI.url} />
            </div>
            <div class="mt-2 p-2 border bg-gray-100">
              <h4 class="text-lg font-medium">Generation Info:</h4>
              <pre class="text-sm overflow-auto max-h-32">{JSON.stringify(
                  fI.genInfo,
                  null,
                  2,
                )}</pre>
            </div>
          </div>
        </AccordionItem>
      {/each}
    </Accordion>
  {/if}

  <!-- Generate button -->
  <Button
    disabled={!canSubmit || selectedImage === -1}
    on:click={(e) => {
      isMintOverlayOpen.set(true) // set over lay 
      console.log(`Mint overlay turned on`)
    }}
    class="mb-4">Mint</Button
  >
>>>>>>> Stashed changes
</Card>

<style>
  .loading-box {
    background-color: #f3f3f3;
    color: #333;
    font-size: 16px;
    border-radius: 4px;
  }
</style>
