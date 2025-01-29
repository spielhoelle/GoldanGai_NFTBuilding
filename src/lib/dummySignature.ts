import { ethers } from 'ethers';

export async function stringToBytes32(str: string): string {
  // Convert string to bytes
  const bytes = ethers.toUtf8Bytes(str);
  // Convert bytes to hex
  let hex = ethers.hexlify(bytes);
  // Remove '0x' prefix
  hex = hex.slice(2);
  // Pad with zeros if necessary
  while (hex.length < 64) {
    hex = hex + '0';
  }
  // Truncate to 64 characters if necessary
  hex = hex.slice(0, 64);
  // Return the '0x' prefixed hex string
  return '0x' + hex;
}

// Example usage
//const dummySignature = stringToBytes32('dummySignature');
//console.log(dummySignature);
