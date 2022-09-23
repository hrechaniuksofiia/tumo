import fs from 'fs'
import express from 'express'
const app = express()

app.use(express.static('.'))
app.use(express.json())

app.get('/', function(req, res){
   res.redirect('index.html')
})

app.post('/statistics', function(req, res){
   fs.appendFileSync('statistics.txt', JSON.stringify(req.body) + '\n')
   res.sendStatus(201)
})



app.listen(3000, function(){
   console.log('Екземпляр запущено через порт 3000');
});