import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { REPLICATE_API_TOKEN } from '$env/static/private';

const REPLICATE_API_URL = 'https://api.replicate.com/v1/predictions';
const REPLICATE_FLUX_BASE = 'https://api.replicate.com/v1/models/black-forest-labs/flux-schnell/predictions';
const version = "6e7e34b8d739ab9d4d9a468ef773b5cd85a5c36b11f885379061ba2c70219d41" // Ensure this is initialized with a valid version or handle empty case

export const POST: RequestHandler = async ({ request }) => {
    try {
        const { prompt } = await request.json();

        // Validate input
        if (!prompt) {
            return new Response(JSON.stringify({ error: 'Invalid request body' }), { status: 400 });
        }
        console.log("Generating image...");
        console.log("Prompt:", prompt);
        console.log("Version:", version);
        // Declare response variable outside the if-else block
        let response;
        
        try {
            // Send initial request to Replicate API
            if (!version) {
                response = await fetch(REPLICATE_FLUX_BASE, {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${REPLICATE_API_TOKEN}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        version: version,
                        input: {
                            prompt: `${prompt}`,
                            aspect_ratio: '1:1',
                        },
                    }),
                });
            } else {
                response = await fetch(REPLICATE_API_URL, {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${REPLICATE_API_TOKEN}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        version: version,
                        input: {
                            prompt: `${prompt}`,
                            aspect_ratio: '1:1',
                        },
                    }),
                });
            }
        } catch (fetchError) {
            console.error('Fetch error:', fetchError);
            return new Response(JSON.stringify({ error: 'Failed to communicate with the API' }), { status: 500 });
        }
        console.log("Response:", response);
        // Handle response errors
        if (!response.ok) {
            const error = await response.json();
            return new Response(JSON.stringify({ error: error.message || 'Image generation failed' }), { status: response.status });
        }

        let prediction = await response.json();

        // Poll for prediction status
        while (prediction.status !== 'succeeded') {
            if (prediction.status === 'failed') {
                throw new Error('Image generation failed.');
            }

            await new Promise((resolve) => setTimeout(resolve, 1000));

            // Fetch updated prediction status
            try {
                response = await fetch(prediction.urls.get, {
                    headers: {
                        Authorization: `Bearer ${REPLICATE_API_TOKEN}`,
                    },
                });

                if (!response.ok) {
                    throw new Error(`Polling error! Status: ${response.status}`);
                }

                prediction = await response.json();
            } catch (pollingError) {
                console.error('Polling error:', pollingError);
                return new Response(JSON.stringify({ error: 'Failed to poll prediction status' }), { status: 500 });
            }
        }

        // Return the final prediction result
        return json(prediction);
    } catch (error: any) {
        console.error('Server error:', error);
        return new Response(JSON.stringify({ error: error.message || 'Internal Server Error' }), { status: 500 });
    }
};

export const GET: RequestHandler = async () => {
    return new Response('GET method is not supported for this endpoint', { status: 405 });
};