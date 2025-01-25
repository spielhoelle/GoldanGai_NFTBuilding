import { ethers,parseEther } from 'ethers';

export async function mintNFT(
  provider: ethers.BrowserProvider,
  signer: ethers.Signer,
  contractAddress: string,
  contractABI: any,
  prompt: string,
  aiModelUsed: string,
  aiModelSignature: string
): Promise<ethers.ContractTransaction> {
  const contract = new ethers.Contract(contractAddress, contractABI, signer);

  // Ensure the user has connected their wallet
  if (!signer) {
    throw new Error('Ethereum wallet is not connected');
  }

  // Prepare the transaction
  const tx = await contract.mint(
    await signer.getAddress(),
    prompt,
    aiModelUsed,
    aiModelSignature,
    {
      value: parseEther('0.01'), // Replace with your minting price
    }
  );

  // Wait for the transaction to be mined
  await tx.wait();

  return tx;
}