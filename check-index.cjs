const mongoose = require('mongoose');

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error('MONGODB_URI is missing');
  process.exit(1);
}

async function main() {
  await mongoose.connect(uri);

  const indexes = await mongoose.connection
    .collection('users')
    .indexes();

  console.log('\n=== USERS INDEXES ===');
  console.log(JSON.stringify(indexes, null, 2));

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});