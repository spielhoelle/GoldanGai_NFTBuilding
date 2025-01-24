import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';
import { PINATA_GROUP,PINATA_KEY_ID,PINATA_SECRET_KEY} from '$env/static/private';
// Initialize IPFS client
const PINATA_API_KEY = PINATA_KEY_ID;
const PINATA_SECRET_API_KEY = PINATA_SECRET_KEY;
// Replace with your group name
const groupName = PINATA_GROUP;

export async function uploadFileToPinata(filePath: string) {
  const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;

  // Create form data
  const formData = new FormData();
  formData.append('file', fs.createReadStream(filePath));

  // Add metadata for the group
  const metadata = JSON.stringify({
      name: groupName,
  });
  formData.append('pinataMetadata', metadata);

  // Add options (optional)
  const options = JSON.stringify({
      cidVersion: 0,
  });
  formData.append('pinataOptions', options);

  try {
      const response = await axios.post(url, formData, {
          headers: {
              'Content-Type': `multipart/form-data; boundary=${formData.getBoundary()}`,
              'pinata_api_key': PINATA_API_KEY,
              'pinata_secret_api_key': PINATA_SECRET_API_KEY,
          },
      });

      console.log('File uploaded successfully:', response.data);
      return response.data;
  } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
  }
}