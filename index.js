require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.set('json spaces', 0);

function buildUserId() {
  const name = (process.env.FULL_NAME || 'ishita khare')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '_');
  const dob = process.env.DOB || '05032003';
  return `${name}_${dob}`;
}

app.post('/bfhl', (req, res) => {
  try {
    const { data } = req.body;
    if (!Array.isArray(data)) {
      return res.status(400).json({ is_success: false, message: "'data' must be an array" });
    }

    const alphabets = [];
    const even_numbers = [];
    const odd_numbers = [];
    const special_characters = [];
    let sum = 0;
    const concatenationLetters = [];

    for (const item of data) {
      const s = String(item);

      if (/^[0-9]+$/.test(s)) {
        const n = parseInt(s, 10);
        if (n % 2 === 0) even_numbers.push(s); else odd_numbers.push(s);
        sum += n;
      } else if (/^[A-Za-z]+$/.test(s)) {
        alphabets.push(s.toUpperCase());
        concatenationLetters.push(...s.split(''));
      } else {
        special_characters.push(s);
      }
    }

    const joined = concatenationLetters.join('');
    const reversed = joined.split('').reverse();
    const concat_string = reversed
      .map((ch, i) => (i % 2 === 0 ? ch.toUpperCase() : ch.toLowerCase()))
      .join('');

    const response = {
      is_success: true,
      user_id: buildUserId(),
      email: process.env.EMAIL || 'ishitakhare08@gmail.com',
      roll_number: process.env.ROLL_NUMBER || '22BCE1475',
      odd_numbers,
      even_numbers,
      alphabets,
      special_characters,
      sum: String(sum),
      concat_string
    };

    return res.status(200).json(response);
  } catch (err) {
    return res.status(500).json({ is_success: false, message: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`bfhl API listening on port ${PORT}`));
