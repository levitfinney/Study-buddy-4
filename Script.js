let mode="student"

function setMode(newMode){

if(newMode==="teacher"){

let pass=prompt("Enter teacher password")

if(pass!=="teacher"){
alert("Wrong password")
return
}

}

mode=newMode
updateModeUI()

}

function updateModeUI(){

let teacherTab=document.getElementById("teacherTab")

if(mode==="teacher"){
teacherTab.style.display="block"
loadTeacherProgress()
}

else{
teacherTab.style.display="none"
}

}

function showTab(id){

let tabs=document.getElementsByClassName("tab")

for(let t of tabs){
t.style.display="none"
}

document.getElementById(id).style.display="block"

}

showTab("home")
updateModeUI()

function toggleDark(){
document.body.classList.toggle("dark")
}

/* AI TUTOR */

async function makeStudyGuide(){

let topic=document.getElementById("question").value
let box=document.getElementById("answer")

if(topic.trim()===""){
box.innerHTML="Enter a topic."
return
}

box.innerHTML="Generating study guide..."

try{

let response=await fetch("https://api.openai.com/v1/chat/completions",{

method:"POST",

headers:{
"Content-Type":"application/json",
"Authorization":"Bearer YOUR_API_KEY_HERE"
},

body:JSON.stringify({

model:"gpt-4o-mini",

messages:[
{
role:"system",
content:"You are an educational tutor that explains topics clearly for students."
},

{
role:"user",
content:`Create a study guide about ${topic}. Include explanation, definition, key concepts, important facts, examples, study tips, and practice questions.`
}

]

})

})

let data=await response.json()

let text=data.choices[0].message.content

box.innerHTML="<div class='card'>"+text.replace(/\n/g,"<br>")+"</div>"

addXP(10)

}

catch{

box.innerHTML="Could not generate study guide."

}

}

/* MATH SOLVER */

function solveMath(){

let input=document.getElementById("mathInput").value

try{

let result=nerdamer.solve(input)

document.getElementById("mathAnswer").innerHTML="Answer: "+result

addXP(5)

}

catch{

document.getElementById("mathAnswer").innerHTML="Could not solve."

}

}

/* QUIZ */

function generateQuiz(){

let topic=document.getElementById("quizTopic").value
let area=document.getElementById("quizArea")

area.innerHTML=`

<h3>${topic} Quiz</h3>

<form id="quizForm">

<p>1. What is ${topic}?</p>

<label><input type="radio" name="q1" value="a"> A key concept</label><br>
<label><input type="radio" name="q1" value="b"> Random idea</label><br>
<label><input type="radio" name="q1" value="c"> Not studied</label>

<br>

<p>2. Why is ${topic} important?</p>

<label><input type="radio" name="q2" value="a"> Helps understand subject</label><br>
<label><input type="radio" name="q2" value="b"> No reason</label><br>
<label><input type="radio" name="q2" value="c"> Random fact</label>

<br><br>

<button type="button" onclick="submitQuiz()">Submit Quiz</button>

</form>

<div id="quizResult"></div>

`

}

function submitQuiz(){

let answers={q1:"a",q2:"a"}
let score=0

for(let q in answers){

let selected=document.querySelector('input[name="'+q+'"]:checked')

if(selected && selected.value===answers[q]){
score++
}

}

document.getElementById("quizResult").innerHTML="Score: "+score+"/2"

addXP(score*5)

}

/* TASKS */

function addTask(){

let task=document.getElementById("taskInput").value
let list=document.getElementById("taskList")

let card=document.createElement("div")

card.className="taskCard"

card.innerHTML=`
<span>${task}</span>
<button onclick="completeTask(this)">✓</button>
<button onclick="deleteTask(this)">✕</button>
`

list.appendChild(card)

}

function completeTask(btn){

let card=btn.parentElement
card.style.textDecoration="line-through"

addXP(2)

}

function deleteTask(btn){
btn.parentElement.remove()
}

/* XP */

function addXP(amount){

let xp=localStorage.getItem("xp") || 0
xp=parseInt(xp)+amount

localStorage.setItem("xp",xp)

updateProgress()

}

function updateProgress(){

let xp=localStorage.getItem("xp") || 0

document.getElementById("progressStats").innerHTML="XP: "+xp

document.getElementById("xpBar").style.width=(xp%100)+"%"

}

updateProgress()

/* NOTES */

function copyNotes(){

let text=document.getElementById("answer").innerText
navigator.clipboard.writeText(text)

document.getElementById("noteExport").value+=text+"\n\n"

}

function copyMath(){

let text=document.getElementById("mathAnswer").innerText
navigator.clipboard.writeText(text)

document.getElementById("noteExport").value+=text+"\n\n"

}

function copyAllNotes(){

let text=document.getElementById("noteExport").value
navigator.clipboard.writeText(text)

alert("Copied!")

}

/* TEACHER */

function teacherQuiz(){

let topic=document.getElementById("teacherQuizTopic").value

document.getElementById("teacherQuizArea").innerHTML=`

<h3>${topic} Teacher Quiz</h3>

<p>1. Explain ${topic}</p>
<p>2. Why is ${topic} important?</p>
<p>3. Give an example of ${topic}</p>

`

}

function loadTeacherProgress(){

let xp=localStorage.getItem("xp") || 0

document.getElementById("teacherProgress").innerHTML="Student XP: "+xp

}
