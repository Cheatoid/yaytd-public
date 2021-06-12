'use strict';
const express = require('express');
const app = express();
app.use(express.json());
app.use('/fetch', require('./routes/fetch'));
app.set('PORT', process.env.PORT || 60999);
app.listen(app.get('PORT'), () => console.log(`yaytd HTTP server operating on port: ${app.get('PORT')}`));
