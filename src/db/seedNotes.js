import 'dotenv/config';
import { readFile } from 'node:fs/promises';
import mongoose from 'mongoose';

import { connectMongoDB } from './connectMongoDB.js';
import { Note } from '../models/note.js';

const seedNotes = async () => {
  await connectMongoDB();

  const raw = await readFile(new URL('../../notes.json', import.meta.url));
  const notes = JSON.parse(raw);

  await Note.deleteMany();
  const created = await Note.insertMany(notes);

  console.log(`🌱 Seeded ${created.length} notes into the "notes" collection`);

  await mongoose.connection.close();
};

seedNotes().catch(async (error) => {
  console.error('❌ Failed to seed notes', error);
  await mongoose.connection.close();
  process.exit(1);
});
