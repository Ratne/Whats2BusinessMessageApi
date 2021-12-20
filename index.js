const express = require('express')
require('dotenv').config()
const app = express()
const port = process.env.PORT
const bodyParser = require('body-parser');
const Message = require('./Models/Message')
const cors = require('cors')
app.use(cors());
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
require('./mongodb')
const fs = require('fs');
var logFile = fs.createWriteStream('./log/log.txt', { flags: 'a' });
var logStdout = process.stdout;
const util = require('util');
app.listen(port, () => {
    console.log(`App disponibile al ${process.env.URL}:${port}`)
})



console.log = function () {
    logFile.write(util.format.apply(null, arguments) + '\n');
    logStdout.write(util.format.apply(null, arguments) + '\n');
}
console.error = console.log;






app.post('/message', (req,res)=>{
    const message = new Message(req.body)
    if (message.phone && message.message){
        message.save().then(res =>{console.log(res)}).catch(err => res.status(400).send('qualcosa è andato storto'))
        res.status(200).send('ok');
   }
   else res.status(404).send('phone and message required');
})


app.get('/send',  (req,res)=> {
  const token = req.header('Authorization');

    if (token === process.env.BEARERTOKEN){
 Message.find({}).then(msg => {
     const today = new Date();
     const newDay = today.setMinutes(today.getMinutes()+1);
     const result = msg.map(m => {
         const contactArray = [];
         if (m.name) contactArray.push(m.name);
         if (m.surname) contactArray.push(m.surname)
         const fullName = contactArray.join(' ')

         return {
             number: `${m.countryCode || '' }${m.phone?.replaceAll('(', '').replaceAll(')', '').replaceAll(' ','').replaceAll('-','')}` ,
             msg: m.message,
             contact: '',
             attach: '',
             dateSend: new Date(newDay).toISOString(),
             fullname: fullName,
             tag1: '',
             tag: '',
             tag3: '',
             tag4: '',
             tag5: '',
             email: '',
             data1: '',
             data2: '',
         }
     })
     console.log(result)
     Message.deleteMany({}).then(res => console.log('rimosso'))
     result.length? res.send(result) : res.status(404).send([])

 })}
 else {
       res.status(400).send('bearer errato')
    }
})