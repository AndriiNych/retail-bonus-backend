import { getBooleanValueFromEnv } from './env.boolean';

async function activeOnrenderServer() {
  console.log(`datetime: ${new Date()}`);
  const response = await fetch(process.env.ACTIVE_PATH);
  if (!response.ok) {
    console.log(`${new Date()}: Err: ${response.status}`);
  }
}

export function startActivateOnrenderServer() {
  if (getBooleanValueFromEnv(process.env.IS_ONRENDER_ACTIVE)) {
    setInterval(() => {
      activeOnrenderServer();
    }, Number(process.env.ACTIVE_DELAY));
  }
}
