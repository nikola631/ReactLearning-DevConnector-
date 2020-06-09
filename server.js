const express = require('express');

const ConnectDB = require('./config/db');

const app = express();

//Connect to database
ConnectDB();

app.get('/', (req, res) => res.send('API Running'));

//Define routes
app.use('/api/users', require('./routs/api/users'));
app.use('/api/profile', require('./routs/api/profile'));
app.use('/api/auth', require('./routs/api/auth'));
app.use('/api/posts', require('./routs/api/posts'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started at port ${PORT}`));