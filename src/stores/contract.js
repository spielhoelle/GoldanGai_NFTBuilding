// src/stores/contract.js
import { writable } from 'svelte/store';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS} from '$env/static/public';

const contractAddress = CONTRACT_ADDRESS;
const abi = [
  // ABI of your contract
];

export const contract = writable(null);

export async function initializeContract() {
  if (window.ethereum) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contractInstance = new ethers.Contract(contractAddress, abi, signer);
    contract.set(contractInstance);
  } else {
    console.error('Ethereum provider not found');
  }
}
