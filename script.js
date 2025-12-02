let tasksData={}; /* last m jo task create ho rhe h wo store krenge */

const todo= document.querySelector("#todo");
const progress= document.querySelector("#progress");
const done= document.querySelector("#done");
let dragElement= null;

function addTask(title,desc,column){
    const div= document.createElement("div");
    div.classList.add("task");
    div.setAttribute("draggable", "true");

    div.innerHTML= `<h2>${title}</h2>
                    <p>${desc}</p>
                    <button>Delete</button>`;
    column.appendChild(div);

    div.addEventListener("drag", (e)=>{
        dragElement= div;
    });

    // delete button functionality
    const deleteButton= div.querySelector("button");
    deleteButton.addEventListener("click", ()=>{
        div.remove();
        updateTaskCount();
    });
}

//function to update task count in each column and save data to local storage
function updateTaskCount(){
    [todo, progress, done].forEach((col)=>{ /* better h ki todo,progress,done ko alag array m save krle */
            const tasks= col.querySelectorAll(".task");
            const count= col.querySelector(".right"); /* index.html m count right class m h */
            count.innerText= tasks.length;

            //data ko save krenge in tasksData object
            tasksData[ col.id]= Array.from(tasks).map((task)=>{  /*col.id== todo progress and done */
                return {
                    title: task.querySelector("h2").innerText,
                    description: task.querySelector("p").innerText
                };
            });
            //local storage m save krdenge-- local storage sirf string hi store kr skta h isliye JSON.stringify kr rhe h object m save nhi  krta
            localStorage.setItem("tasksData", JSON.stringify(tasksData));


        });

}


if (localStorage.getItem("tasksData")){

    const data= JSON.parse(localStorage.getItem("tasksData")); /*data in form of string store hua h local storage m toh obj. ki form m lane k liye .parse use kiya h */

    for (const col in data){    // col = "todo" / "progress" / "done"

        const column= document.querySelector(`#${col}`); /* #todo, #progress, #done */

        data[col].forEach((task)=>{
            addTask(task.title, task.description, column);
        });
        //count update krdo
        updateTaskCount();
    }
}

const tasks= document.querySelectorAll(".task");    

tasks.forEach((task)=>{
    task.addEventListener("drag", (e)=>{
        dragElement= task;
    });
});


// funtion to add drag events on tasks
function addDragEventsOnColumn(Column){
    Column.addEventListener("dragenter", (e)=>{
        e.preventDefault();
        Column.classList.add("hover-over");
    });
    Column.addEventListener("dragleave", (e)=>{
        e.preventDefault();
        Column.classList.remove("hover-over");
    });

    Column.addEventListener("dragover", (e)=>{
        e.preventDefault();
    });

    Column.addEventListener("drop", (e)=>{
        e.preventDefault();
        Column.appendChild(dragElement);
        Column.classList.remove("hover-over");


        //count ki working
        updateTaskCount();
        }
        
    );

}

addDragEventsOnColumn(todo);
addDragEventsOnColumn(progress);
addDragEventsOnColumn(done);

//modal related logic:- jab ham add task p click krenge tabhi modal dikhega rest display none

const toogleModalButton= document.querySelector("#toggle-modal");
const modal= document.querySelector(".modal");
toogleModalButton.addEventListener("click", ()=>{
    modal.classList.add("active");   
});

// modal close logic  bg p click krte hi modal close ho jaye
const modalBg= document.querySelector(".modal .bg");
modalBg.addEventListener("click", ()=>{
    modal.classList.remove("active");
});

//Yeh code Add Task button dabate hi user ke input se ek naya draggable task banaakar To-Do column me add kar deta hai aur modal ko close kar deta hai.
const addTaskButton= document.querySelector("#add-new-task")

addTaskButton.addEventListener("click", ()=>{
    const taskTitleInput= document.querySelector("#task-title-input").value;
    const taskDesc= document.querySelector("#text-desc-input").value;

    addTask(taskTitleInput, taskDesc, todo);

    const div= todo.lastElementChild;  // jo abhi abhi add hua h wo last m h isliye lastElementChild

    // add drag events on newly created task
    div.addEventListener("drag", (e)=>{
        dragElement= div;
    });

    // modal band krdo
    modal.classList.remove("active");

    document.querySelector("#task-title-input").value= "";
    document.querySelector("#text-desc-input").value= "";

    //count ki working
    updateTaskCount();

});