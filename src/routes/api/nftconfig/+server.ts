import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { ADDRESS_OWNER, MINTING_PRICE, CONTRACT_ADDRESS, CONTRACT_ARTIFACT } from '$env/static/private';

export const GET: RequestHandler = async () => {
  try {
    if (!ADDRESS_OWNER || !MINTING_PRICE || !CONTRACT_ADDRESS || !CONTRACT_ARTIFACT) {
      throw new Error('Missing required environment variables');
    }

    let contractArtifact = {};
    try {
      contractArtifact = JSON.parse(CONTRACT_ARTIFACT || '{}');
    } catch (error) {
      console.error('Error parsing CONTRACT_ARTIFACT:', error);
      contractArtifact = {}; // Fallback to empty object
    }

    return json({
      contractOwner: ADDRESS_OWNER,
      contractAddress: CONTRACT_ADDRESS,
      mintingPrice: MINTING_PRICE,
      contractArtifact
    });
  } catch (error) {
    console.error('API Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};