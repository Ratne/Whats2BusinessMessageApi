const mongoose = require('mongoose');

mongoose.connect(process.env.DB_CONNECT,
    { useNewUrlParser: true, useUnifiedTopology: true}).then(()=> {
    console.log('siamo connessi')
}).catch((err)=> {
    console.log('connection failed', err);
});