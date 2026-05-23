const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { MongoMemoryServer } = require('mongodb-memory-server');
const contactRoutes = require('./routes/contacts');
const seedData = require('./utils/seed');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/contacts', contactRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

async function startServer() {
  const mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();

  await mongoose.connect(uri);
  console.log('✅ MongoDB (in-memory) connected');

  await seedData();
  console.log('✅ Seed data loaded');

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
}

startServer().catch(console.error);
