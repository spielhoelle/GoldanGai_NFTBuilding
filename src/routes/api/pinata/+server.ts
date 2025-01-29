import { json, fail } from '@sveltejs/kit';
import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';
import { PINATA_GROUP, PINATA_KEY_ID, PINATA_SECRET_KEY } from '$env/static/private';

export const POST = async ({ request }) => {
  try {
    const { imageUrl } = await request.json();

    // Fetch the image from the provided URL
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const imageBuffer = Buffer.from(response.data);
     // Create form data
    const formData = new FormData();
    formData.append('file', imageBuffer, { filename: 'image.jpg' });
    // Add metadata for the group
    const metadata = JSON.stringify({ name: PINATA_GROUP });
    formData.append('pinataMetadata', metadata);
    // Add options (optional)
    const options = JSON.stringify({ cidVersion: 0 });
    formData.append('pinataOptions', options);


    // Upload the image to Pinata
    const uploadResponse = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {
        headers: {
          'Content-Type': `multipart/form-data; boundary=${formData.getBoundary()}`,
          'pinata_api_key': PINATA_KEY_ID,
          'pinata_secret_api_key': PINATA_SECRET_KEY,
        },
      });
    
    return json({ success: true, data: uploadResponse.data });
  } catch (error) {
    console.error('Error uploading file:', error);
    return fail(500, { error: 'Internal Server Error' });
  }
};
