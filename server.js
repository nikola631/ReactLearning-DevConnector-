const express = require('express');

const ConnectDB = require('./config/db');

const app = express();

//Connect to database
ConnectDB();

app.get('/', (req, res) => res.send('API Running'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started at port ${PORT}`));