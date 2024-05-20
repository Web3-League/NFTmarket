// src/pinata.ts
import axios from 'axios';

const pinataApiKey = process.env.REACT_APP_PINATA_API_KEY;
const pinataSecretApiKey = process.env.REACT_APP_PINATA_SECRET_API_KEY;

if (!pinataApiKey || !pinataSecretApiKey) {
  throw new Error('Missing Pinata API keys in environment variables');
}

const pinataHeaders = {
  pinata_api_key: pinataApiKey,
  pinata_secret_api_key: pinataSecretApiKey,
};

export const uploadFileToPinata = async (file: File) => {
  const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
  const data = new FormData();
  data.append('file', file);

  const metadata = JSON.stringify({
    name: file.name
  });
  data.append('pinataMetadata', metadata);

  const options = JSON.stringify({
    cidVersion: 0
  });
  data.append('pinataOptions', options);

  try {
    const res = await axios.post(url, data, {
      maxBodyLength: Infinity,  // Important pour gérer les gros fichiers
      headers: {
        'Content-Type': 'multipart/form-data',
        ...pinataHeaders,
      },
    });
    return `https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`;
  } catch (error) {
    console.error('Error uploading file to Pinata: ', error);
    throw error;
  }
};

export const pinJSONToPinata = async (json: any) => {
  const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
  try {
    const res = await axios.post(url, json, {
      headers: {
        'Content-Type': 'application/json',
        ...pinataHeaders,
      },
    });
    return `https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`;
  } catch (error) {
    console.error('Error pinning JSON to Pinata: ', error);
    throw error;
  }
};

export const pinByHash = async (hash: string) => {
  const url = `https://api.pinata.cloud/pinning/pinByHash`;
  try {
    const res = await axios.post(url, { hashToPin: hash }, {
      headers: pinataHeaders,
    });
    return res.data;
  } catch (error) {
    console.error('Error pinning by hash: ', error);
    throw error;
  }
};

export const unpin = async (hash: string) => {
  const url = `https://api.pinata.cloud/pinning/unpin/${hash}`;
  try {
    await axios.delete(url, {
      headers: pinataHeaders,
    });
  } catch (error) {
    console.error('Error unpinning file from Pinata: ', error);
    throw error;
  }
};





