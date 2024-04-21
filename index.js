const express = require('express');
const app = express();
app.use(express.urlencoded({ extended: false }));
require('dotenv').config();
const cookieParser = require('cookie-parser') ;
app.use(cookieParser()) ;

const path = require('path');
const public = path.join(__dirname,'public');
app.use(express.static(public));

const mustache = require('mustache-express');
app.engine('mustache', mustache());
app.set('view engine', 'mustache');

const bodyParser = require('body-parser');
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({
extended: false
}));

const router = require('./routes/PantryRoutes');
app.use('/', router); 

app.listen(3000, () => {
    console.log('Server started on port 3000. Ctrl^c to quit.');
})