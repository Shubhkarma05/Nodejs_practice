const express = require("express")
const app = express()
const path = require("path")
const port = 3000
const fs = require('fs')
const { log } = require("console")

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.set('view engine','ejs')
app.use( express.static(path.join(__dirname,"public"))) ;


app.get('/',(req,res)=>{
    fs.readdir("./files",(err,files)=>{
        res.render('index', {files:files})
    })   
})

app.get('/file/:filename',(req,res)=>{
    fs.readFile(`./files/${req.params.filename}`,'utf-8',(err,fileData)=>{
       // console.log(req.params.filename);
       // console.log(fileData); 
        res.render('show', {fileData:fileData, filename:req.params.filename})
    })
})


app.post('/create', (req, res) => {
    const title = req.body.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const details = req.body.details;

    fs.writeFile(`./files/${title}.txt`, details, (err) => {
        if (err) {
            console.error("Error writing file:", err);
            return res.status(500).send("Internal Server Error");
        }
        res.redirect('/');
    });
});


app.get('/edit/:filename',(req,res)=>{
    res.render('edit', {filename:req.params.filename})
})

app.post('/edit', (req,res)=>{
    let previousName = req.body.previous
    let newName = req.body.new

    fs.rename(`./files/${previousName}`, `./files/${newName}.txt`,(err)=>{
        res.redirect("/")
    })
})


app.get('/delete/:filename',(req,res)=>{

    fs.unlink(`./files/${req.params.filename}`,(err)=>{
        if (err) {
            console.error("Error deleting the file:", err);
            return res.status(500).send("Error deleting the file.");
        }
        res.redirect('/')
    })
})


app.listen(port,()=>{
    console.log(`server is running on http://localhost:${port}`);
    
})