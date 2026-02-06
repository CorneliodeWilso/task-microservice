import { onRequest } from 'firebase-functions/v2/https';
import { defineSecret } from 'firebase-functions/params';
import { app } from './app';

export const ATOM_FIREBASE_API_KEY = defineSecret('ATOM_FIREBASE_API_KEY');

export const api = onRequest(
  {
    region: 'us-central1',
    secrets: [ATOM_FIREBASE_API_KEY]
  },
  app
);