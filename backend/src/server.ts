import express from 'express';
import { connectDB } from './config/database';

const app = express();

const port = 3000;

connectDB();
app.get('/', (req, res) => {
  res.send('Hello Deez!');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
