const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 3000;

let messages = [];

app.use(bodyParser.json());
app.use(cors());
app.use(express.static('public'));

app.post('/send', (req, res) => {
    const { message, sender } = req.body;
    messages.push({ message, sender, timestamp: new Date() });
    res.status(200).send({ success: true });
});

app.get('/messages', (req, res) => {
    res.status(200).send(messages);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
