import app from './app';
import express from 'express';

import expressValidator = require('express-validator');

const bodyParser = require('body-parser'); 
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));

app.use(expressValidator());