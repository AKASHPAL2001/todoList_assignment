
let todoList = JSON.parse(localStorage.getItem('todoList')) || [];
let subList = JSON.parse(localStorage.getItem('subList')) || [];
let filter = JSON.parse(window.localStorage.getItem("filters")) || {};
let vbacklog = JSON.parse(localStorage.getItem('backlog')) || 0;
let editID ="";
let sortBy = {};

function updateLocalStorage() {
  localStorage.setItem('todoList', JSON.stringify(todoList));
  localStorage.setItem('subList', JSON.stringify(subList));
}

renderTodoList();


// Navbar code
const priorities = {
  high: 0,
  medium: 1,
  low: 2,
};
const sortBtn = document.getElementById("sortBtn");
sortBtn.onclick = () => {
  sortBy = sort.value;
  if (sortBy == 1) {
    todoList.sort(function (task1, task2) {
      if (task1.duedate > task2.duedate) {
        return 1;
      } else if (task1.duedate < task2.duedate) {
        return -1;
      }
      return 0;
    });
  } else if (sortBy == 2) {
    todoList.sort(function (task1, task2) {
      if (task1.duedate > task2.duedate) {
        return -1;
      } else if (task1.duedate < task2.duedate) {
        return 0;
      }
      return 0;
    });
  } else if (sortBy == 3) {
    todoList.sort(function (task1, task2) {
      return priorities[task2.priority] - priorities[task1.priority];
    });
  } else {
    todoList.sort(function (task1, task2) {
      return priorities[task1.priority] - priorities[task2.priority];
    });
    console.log(todoList);
  }
  console.log(todoList);
  renderTodoList();
}

// function filterTasks() {
  
//   console.log('Filtering tasks...');
// }

// function searchTasks() {
//   const searchInput = document.getElementById('searchInput');
//   const searchTerm = searchInput.value.trim();

//   console.log(`Searching tasks for: ${searchTerm}`);
// }



// function to add subtask
document.getElementById("subtask")
.addEventListener("keypress", function(event){
  if(event.key == "Enter"){
    event.preventDefault();
    document.getElementById("addsubtask").click();
  }
})
function addSubtask (){
  if(subtask.value===''){
    alert("please enter subtask");
  }
  else{
    const subtaskele = {
      id: Date.now(),
      subtext: subtask.value,
    }
    subList.push(subtaskele);
    subtask.value="";
    renderSubList();
    updateLocalStorage();
  }
}

function renderSubList(){
  const currsublist = document.getElementById("temp-subtask");
  currsublist.innerHTML = "";


 
  subList.forEach((subItem,index) => {
    
    const newli = document.createElement("li");

    const subtext = document.createElement('span');
    subtext.innerHTML = subItem.subtext;

    const subdelbtn = document.createElement("button");
    subdelbtn.innerHTML = `<i class="material-icons">&#xe872;</i>`;
    subdelbtn.onclick = (e) => {
      console.log(subList);
      subList = subList.filter((task) => task.id != subItem.id);
      updateLocalStorage();
      renderSubList();
    };
    newli.appendChild(subtext);
    newli.appendChild(subdelbtn);
    currsublist.appendChild(newli);
  }) 
}

// function to add new item in todoList array

document.getElementById("todotask")
.addEventListener("keypress", function(event){
  if(event.key == "Enter"){
    event.preventDefault();
    document.getElementById("addbtn").click();
  }
})

function addTask(){
  if(todotask.value===''){
    alert("please enter task");
  }
  else{
    const todoItem = {
      id: Date.now(),
      task: todotask.value.trim(),
      done: false,
      duedate: duedate.value,
      category: category.value,
      priority: priority.value,
      tags: tags.value.split(','),
      subtasks: subList
    };
    todoList.push(todoItem);
    todotask.value="";
    tags.value="";
    duedate.value="";
    category.value="Office";
    priority.value="High";
    subList=[];
    updateLocalStorage();
    renderTodoList();
    renderSubList();

  }

}

function renderTodoList(){
  const currlist=document.getElementById("todo-list");
  currlist.innerHTML = "";
  let applyFilters = 1;
  if(!window.localStorage.getItem("filters") || filter.length===0 ) {
    console.log("no filters");
    applyFilters = 0;
  }


  todoList.forEach((todoItem,index) => {

    if (applyFilters == 1) {
      if (filter.priority !="" && filter.priority != todoItem.priority) {
        return;
      }
      if (filter.fromDate != "" && filter.fromDate > todoItem.duedate) {
        return;
      }
      if (filter.toDate != "" && filter.toDate < todoItem.duedate) {
        return;
      }
    }






    const newli=document.createElement("li");
    newli.className="todo-item";

    const checkbox = document.createElement("input");
    checkbox.type = 'checkbox';
    checkbox.checked = todoItem.done;
    checkbox.addEventListener('change', () => toggleDone(index));
    
    const task= document.createElement("input");
    task.className = "task";
    task.type="text";
    task.disabled=true;
    task.value=todoItem.task;

    const dueDate = document.createElement("div");
    dueDate.innerHTML = `<span> Due Date: ${todoItem.duedate} </span>`
    const Category = document.createElement("div");
    Category.innerHTML = `<span> Category: ${todoItem.category} </span>`
    const Priority = document.createElement("div");
    Priority.innerHTML = `<span> Priority: ${todoItem.priority} </span>`

    const editbtn = document.createElement("button");
    editbtn.innerHTML = "Edit";
    editbtn.onclick = function() {
      editTodoItem(index,task,editbtn);
      editbtn.innerHTML = "Save";
    }

    if(todoItem.done){
      task.classList.add('done');
    }

    const delbtn = document.createElement("button");
    delbtn.innerHTML = `<i class="material-icons">&#xe872;</i>`;
    delbtn.onclick = () => removeTodoItem(index);

    const container = document.createElement("div");
    container.appendChild(editbtn);
    container.appendChild(delbtn);
    newli.appendChild(checkbox)
    newli.appendChild(task);
    newli.appendChild(dueDate);
    newli.appendChild(Priority);
    newli.appendChild(Category);
    newli.appendChild(container);

    currlist.appendChild(newli);
  })
}


function removeTodoItem(index){
  todoList.splice(index,1);
  renderTodoList();
  updateLocalStorage();
}

function editTodoItem(index,task,btn){
  task.disabled=false;
  task.focus();
  btn.onclick = () => {
    todoList[index].task=task.value;
    btn.innerHTML = "Edit";
    renderTodoList();
    updateLocalStorage(); 
  }
}

function toggleDone(index){
  todoList[index].done = !todoList[index].done;
  
  renderTodoList();

  updateLocalStorage();
}


function filterList(){
  // console.log(fromDate.value,toDate.value,priorityFilter.value);

  const filterSet = {
    priority: priorityFilter.value,
    fromDate: fromDate.value,
    toDate: toDate.value,
  };
  window.localStorage.setItem("filters", JSON.stringify(filterSet));
  filter = filterSet;
  console.log(filterSet);
  renderTodoList();
}

function resetFilter (){
  window.localStorage.removeItem("filters");
  filter = {};
  window.location.reload();
  renderTodoList();
}

