import { getBooleanValueFromEnv } from './env.boolean';

async function activeOnrenderServer(token: string) {
  console.log(`datetime: ${new Date()}`);
  const response = await fetch(process.env.ACTIVE_PATH, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    console.log(`${new Date()}: Err: ${response.status}`);
  }
}

export function startActivateOnrenderServer() {
  const token = process.env.API_KEY;

  if (getBooleanValueFromEnv(process.env.IS_ONRENDER_ACTIVE)) {
    setInterval(() => {
      activeOnrenderServer(token);
    }, Number(process.env.ACTIVE_DELAY));
  }
}
