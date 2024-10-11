//TODO modify function: clear console.log
export async function activeOnrenderServer() {
  console.log('start activation');
  const response = await fetch(process.env.ACTIVE_PATH);
  if (!response.ok) {
    console.log(`error ${response.status}`);
    console.log(`stop activation: ${new Date()}`);
  } else {
    const date = await response.json();
    console.log(date);
    console.log(`stop activation: ${new Date()}`);
  }
}
