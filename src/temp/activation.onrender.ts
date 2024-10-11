export async function activationOnrenderServer() {
  console.log('start activation');
  const response = await fetch(
    'https://retail-bonus-backend.onrender.com/customers',
  );
  if (!response.ok) {
    console.log(`error ${response.status}`);
    console.log(`stop activation: ${new Date()}`);
  } else {
    const date = await response.json();
    console.log(date);
    console.log(`stop activation: ${new Date()}`);
  }
}
