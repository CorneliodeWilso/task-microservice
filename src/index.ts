import { app } from "./app";
import { defineString } from 'firebase-functions/params';
import { onRequest } from 'firebase-functions/v2/https';

export const ATOM_FIREBASE_API_KEY = defineString('ATOM_FIREBASE_API_KEY');
export const api = onRequest(
  {
    region: 'us-central1',
    secrets: [ATOM_FIREBASE_API_KEY]
  },
  app
);