import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import axios from "axios";

const app = express();
const port = 3000;
let quiz;
const db = new pg.Client({
    user:"postgres",
    host:"localhost",
    database: "world",
    password:"Aaditya",
    port:5434
});

db.connect()

db.query("SELECT * FROM capitals",(err,res)=>{
    if(err){
        console.error("Error fetching database "+err.stack);
    }
    else
    quiz = res.rows;
db.end();
})

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

let totalCorrect = 0;
let currentQuestion = {};
app.get("/",async(req,res)=>{
    totalCorrect = 0;
    await nextQuestion();
    console.log(currentQuestion);
    res.render("index.ejs",{
        question : currentQuestion
    })
});

app.post("/submit", async(req,res)=>{
let isCorrect = false;
const answer = req.body.answer.trim();
if(answer.toLowerCase() === currentQuestion.capital.toLowerCase()){
    isCorrect = true
    totalCorrect++;
    console.log(totalCorrect);
}

await nextQuestion();
res.render("index.ejs",{
    totalScore : totalCorrect,
    wasCorrect : isCorrect,
    question : currentQuestion
})
console.log(currentQuestion);
})

async function nextQuestion(){
    const randomCountry = quiz[Math.floor(Math.random() * quiz.length)];
    currentQuestion = randomCountry;
}

app.listen(port,()=>{
    console.log("Listening on port "+port);
})