import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { Configuration, OpenAIApi } from 'openai';
import { connectToDatabase } from './database';


  
try {
    const url = 'http://localhost:5984';
    const auth = {
      username: 'admin',
      password: '12many'
    };
    const db = connectToDatabase(url, auth);
    // Use the db object to perform operations on the database
  } catch (error) {
    console.error(error);
    // Handle the error and inform the user if there was a problem connecting to the database
  }

  app.get('/profile', (req, res) => {
    const userId = req.query.userId; // retrieve user ID from the request
    db.get(userId, (error, result) => {
      if (error) {
        res.status(500).send({ error });
      } else {
        res.status(200).send({ data: result });
      }
    });
  });
  
  

dotenv.config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).send({
    message: 'Hello from CodeX',
  });
});

app.post('/', async (req, res) => {
  try {
    const { prompt } = req.body;

    const response = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt,
      temperature: 0.23,
      max_tokens: 3589,
      top_p: 1,
      frequency_penalty: 0.5,
      presence_penalty: 0,
    });

    res.status(200).send({
      bot: response.data.choices[0].text,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error });
  }
});

app.listen(5000, () => console.log('Server is running on http://localhost:5000'));
