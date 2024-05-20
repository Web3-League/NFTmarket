// src/ipfs.ts
import { create } from 'ipfs-http-client';
import { Buffer } from 'buffer';

// Charger les valeurs de l'environnement
const projectId = process.env.REACT_APP_INFURA_PROJECT_ID;
const projectSecret = process.env.REACT_APP_INFURA_PROJECT_SECRET;

const auth = 'Basic ' + Buffer.from(`${projectId}:${projectSecret}`).toString('base64');

const client = create({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  headers: {
    authorization: auth,
  },
});

export const uploadFileToIPFS = async (file: File) => {
  try {
    const added = await client.add(file);
    return `https://ipfs.infura.io/ipfs/${added.path}`;
  } catch (error) {
    console.error('Error uploading file: ', error);
    throw error;
  }
};


