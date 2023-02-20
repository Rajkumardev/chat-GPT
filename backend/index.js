const express = require('express');
const { Configuration, OpenAIApi } = require("openai");
const router = express.Router();
const dotenv = require("dotenv");

dotenv.config()

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);
const app = express();

app.use(express.json());
const cors = require('cors');
app.use(cors({
    origin: 'http://localhost:3000'
}));

const PORT = process.env.PORT || 8088
app.listen(PORT);

//Get the translated content from Chat GPT API
app.post('/api/translate', async(req, res, next) => {
  if(req.body.language == undefined || req.body.word == undefined || req.body.language === '' || req.body.word === '') {
    res.send("Please fill all the fields");
  }

  try {
    const answer = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `Translate this into ${req.body.language}:\n\ ${req.body.word} \n\n1.`,
      temperature: 0.3,
      max_tokens: 100,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
    });
    res.send(answer.data.choices[0].text);
  }
  catch(error) {
    return next(error);
  }
});
module.exports = router;
