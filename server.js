import express from 'express';
import cors from 'cors';
import Groq from 'groq-sdk';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

‎// کلید از Render Env میاد - تو Render برو Environment -> GROQ_API_KEY
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

app.post('/api/generate-track', async (req, res) => {
 const { genre, prompt } = req.body;
 const userPrompt = prompt || genre;

 try {
 const completion = await groq.chat.completions.create({
 model: "llama-3.3-70b-versatile",
 temperature: 0.9,
 messages: [
 {
 role: "system",
 content: `You are Infinite House Engine - a music AI.
Return ONLY valid JSON. No markdown.
Generate infinite loop music structure.
Format:
{
 "bpm": number (70-170),
 "scale": [frequencies in Hz, 4-7 notes],
 "bass_pattern": [0 or 1 for 16 steps],
 "lead_pattern": [notes or null for 16 steps, use scale index],
 "drums": {"kick": [16 bools], "hat": [16 bools], "clap": [16 bools]},
 "mood": "string",
 "wave": "sawtooth|square|sine|triangle"
}
Genre: ${genre}. Adapt bpm, scale, patterns to genre. Rock=distorted power, Classic=sine slow, Jazz=swing 7th, Blues=minor pentatonic, Metal=fast double kick.`
 },
 { role: "user", content: `Genre: ${genre}, Prompt: ${userPrompt}. Generate next infinite variation.` }
 ],
 response_format: { type: "json_object" }
 });

 const track = JSON.parse(completion.choices[0].message.content);
 res.json(track);
 } catch (e) {
 console.error(e);
 res.status(500).json({ error: e.message });
 }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`INFINITE ENGINE V3 running on ${PORT}`));