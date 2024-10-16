
const taskForm = document.getElementById("task-form");
const confirmCloseDialog = document.getElementById("confirm-close-dialog");
const openTaskFormBtn = document.getElementById("open-task-form-btn");
const closeTaskFormBtn = document.getElementById("close-task-form-btn");
const addOrUpdateTaskBtn = document.getElementById("add-or-update-task-btn");
const cancelBtn = document.getElementById("cancel-btn");
const discardBtn = document.getElementById("discard-btn");
const tasksContainer = document.getElementById("tasks-container");
const titleInput = document.getElementById("title-input");
const dateInput = document.getElementById("date-input");
const descriptionInput = document.getElementById("description-input");

/**
 * The localStorage object allows you to save key/value pairs in the brower
 * The localStorage object stores data with no expiration date.
 * The data is not deleted when the browser is closed, and are available for future sessions.
 * getItem() method retuan value of the specified Storage Object item
 * SYNTAX: localStorage.getItem(keyname)
 */
const taskData = JSON.parse(localStorage.getItem("data")) || [];

//I think this is a key object
let currentTask = {};

/*
JSON.parse() method can convert the string which received from web server to become a JavaSrcipt object
const json = '{"result":true, "count":42}';
const obj = JSON.parse(json);
console.log(obj.count);// Expected output: 42
console.log(obj.result);// Expected output: true
*/ 


//1. add task: use findIndex() method to retuan the index which in taskData array have 
//the same id as currentTask object
const addOrUpdateTask = () => {
  //findIndex will return "-1" if no match is found
  const dataArrIndex = taskData.findIndex((item) => item.id === currentTask.id);
  //create a task object, use Date.now() method make the id unique
  const taskObj = {
    id: `${titleInput.value.toLowerCase().split(" ").join("-")}-${Date.now()}`,
    title: titleInput.value,
    date: dateInput.value,
    description: descriptionInput.value,
  };

  //if there is no match in taskData, use unshift() method to add taskObj 
  //as the first item in taskData
  //if there is match, update the taskObj to the dataArrIndex of taskData
  if (dataArrIndex === -1) {
    taskData.unshift(taskObj);
  } else {
    taskData[dataArrIndex] = taskObj;
  }

  /**
   * localStorage.setItem is to save the data in to the localStorage
   * JSON.stringify() is to convert the taskData to a string
   */
  localStorage.setItem("data", JSON.stringify(taskData));
  
  //call functions
  updateTaskContainer()
  reset()
};

//update the task container
const updateTaskContainer = () => {
  tasksContainer.innerHTML = "";
  taskData.forEach(
    //these values are destructured from taskData
    ({ id, title, date, description }) => {
        (tasksContainer.innerHTML += `
        <div class="task" id="${id}">
          <p><strong>Title:</strong> ${title}</p>
          <p><strong>Date:</strong> ${date}</p>
          <p><strong>Description:</strong> ${description}</p>
          <button onclick="editTask(this)" type="button" class="btn">Edit</button>
          <button onclick="deleteTask(this)" type="button" class="btn">Delete</button> 
        </div>
      `)
    }
  );
};

//delete function
const deleteTask = (buttonEl) => {
    //this parentElement is defined in the update task container
    //it is a <div>
    const dataArrIndex = taskData.findIndex(
    (item) => item.id === buttonEl.parentElement.id
  );
  //remove the whole <div>
  buttonEl.parentElement.remove();
  //the splice() method adds and/or removes array elements
  //the splice() method overwrites the orginal array
  //SYNTAX: array.splice(index, count, item1, ....., itemX) count is optional
  //count: number of items to be removed
  //items: optional, the new elements to be added
  taskData.splice(dataArrIndex, 1);
  //store the new taskData in to the local storage
  localStorage.setItem("data", JSON.stringify(taskData));
}

//edit function
const editTask = (buttonEl) => {
    //first of all, find the item you want to edit
    const dataArrIndex = taskData.findIndex(
    (item) => item.id === buttonEl.parentElement.id
  );
  //add the task you want edit to the current object
  currentTask = taskData[dataArrIndex];
  //add the task's title, date, description the elements
  titleInput.value = currentTask.title;
  dateInput.value = currentTask.date;
  descriptionInput.value = currentTask.description;
  //change the button text
  addOrUpdateTaskBtn.innerText = "Update Task";
  //taskForm has two classes "task-form hidden"
  //classList.toggle() method can toggles between tokens in the list
  //add or delete
  taskForm.classList.toggle("hidden");  
}

//just reset
const reset = () => {
addOrUpdateTaskBtn.innerText = "Add Task";
  titleInput.value = "";
  dateInput.value = "";
  descriptionInput.value = "";
  taskForm.classList.toggle("hidden");
  currentTask = {};
}

//return true when taskData has one or more task
//return false when length === 0 which means it is empty
if (taskData.length) {
  updateTaskContainer();
}

//switch hidden class when click the "open-task-form-btn"
openTaskFormBtn.addEventListener("click", () =>
  taskForm.classList.toggle("hidden")
);

//determine whether the current data is empty or has been modified
closeTaskFormBtn.addEventListener("click", () => {
  //whether is empty
  const formInputsContainValues = titleInput.value || dateInput.value || descriptionInput.value;
  //whether is modified
  const formInputValuesUpdated = titleInput.value !== currentTask.title || dateInput.value !== currentTask.date || descriptionInput.value !== currentTask.description;
  
  if (formInputsContainValues && formInputValuesUpdated) {
    //show the dialog "confirm-close-dialog"
    confirmCloseDialog.showModal();
  } else {
    reset();
  }
});

//cancel button on the dialog, if it clicked, close the dialog
cancelBtn.addEventListener("click", () => confirmCloseDialog.close());
//discard button on the dialog, if it clicked, close the dialog and reset value
discardBtn.addEventListener("click", () => {
  confirmCloseDialog.close();
  reset()
});

//The preventDefault() method cancels the event if it is cancelable, 
//meaning that the default action that belongs to the event will not occur.
/**
 * By default, when a form is submitted, the browser performs a full page reload
 * and sends the form data to the server,
 * as specified by the form’s action attribute (if present).
 */
taskForm.addEventListener("submit", (e) => {
  e.preventDefault();
  addOrUpdateTask();
});
