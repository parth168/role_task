require("dotenv").config();
const user = require('./User/userRoute');
const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/user', user);


const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));