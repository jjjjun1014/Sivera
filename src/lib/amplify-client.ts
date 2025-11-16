/**
 * Amplify Client - 가장 기본적인 설정
 */

import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/data';
import outputs from '../../amplify_outputs.json';

// Amplify 설정 (딱 한 번만)
let configured = false;

export function configureAmplify() {
  if (configured) return;
  
  Amplify.configure(outputs, { ssr: true });
  configured = true;
}

// GraphQL Client (authMode: userPool)
export const client = generateClient({
  authMode: 'userPool',
});
