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

app.listen(port, () => {
    console.log(`App disponibile al ${process.env.URL}:${port}`)
})


app.post('/message', (req,res)=>{
    const message = new Message(req.body)
    message.save().then(res =>{console.log(res)})
    res.status(200).send('ok');
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
             number: m.phone?.replaceAll('(', '').replaceAll(')', '').replaceAll(' ','').replaceAll('-',''),
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
     Message.deleteMany({}).then(res => console.log('rimosso'))
     result.length? res.send(result) : res.status(404).send([])

 })}
 else {
       res.status(400).send('bearer errato')
    }
})