const express = require('express')
const bodyParser = require('body-parser')
const fs = require('fs');
const app = express()
const port = 3000

let rawParser = bodyParser.raw({ limit: '5mb' });

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

app.use(express.static(__dirname + "/public"));

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, PATCH, PUT, POST, DELETE, OPTIONS");
  next();
});


app.post("/upload", rawParser, function (req, res) {
  let buffer = Buffer.from(req.body);
  fs.writeFile("my-image.png", buffer, "binary", function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log("The file was saved!");
    }
  });
});