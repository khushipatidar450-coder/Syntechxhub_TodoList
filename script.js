const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");

const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");

const emptyMessage = document.getElementById("emptyMessage");
const clearBtn = document.getElementById("clearBtn");


let tasks = [];

try {
    const savedTasks = localStorage.getItem("myTasks");
    tasks = savedTasks ? JSON.parse(savedTasks) : [];

    if (!Array.isArray(tasks)) {
        tasks = [];
    }
} catch (error) {
    tasks = [];
}

function saveTasks() {
    localStorage.setItem("myTasks", JSON.stringify(tasks));
}


function addTask() {
    const taskText = taskInput.value.trim();

    if (taskText === "") {
        alert("Please enter a task!");
        return;
    }

    const task = {
        id: Date.now() + Math.random(),
        text: taskText,
        completed: false
    };

    tasks.push(task);

    saveTasks();
    renderTasks();

    taskInput.value = "";
    taskInput.focus();
}


function renderTasks() {
    taskList.innerHTML = "";

    tasks.forEach(function(task) {
        const li = document.createElement("li");
        li.className = "task-item";

        if (task.completed) {
            li.classList.add("completed");
        }

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "task-checkbox";
        checkbox.checked = task.completed;
        checkbox.setAttribute("aria-label", "Mark task as complete");

        checkbox.addEventListener("change", function() {
            toggleTask(task.id);
        });

        const span = document.createElement("span");
        span.className = "task-text";
        span.textContent = task.text;

        const deleteBtn = document.createElement("button");
        deleteBtn.className = "delete-btn";
        deleteBtn.textContent = "🗑️";
        deleteBtn.setAttribute("aria-label", "Delete task");

        deleteBtn.addEventListener("click", function() {
            deleteTask(task.id);
        });

        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(deleteBtn);

        taskList.appendChild(li);
    });

    updateTaskInfo();
}


function toggleTask(id) {
    tasks = tasks.map(function(task) {
        if (task.id === id) {
            return {
                ...task,
                completed: !task.completed
            };
        }

        return task;
    });

    saveTasks();
    renderTasks();
}


function deleteTask(id) {
    tasks = tasks.filter(function(task) {
        return task.id !== id;
    });

    saveTasks();
    renderTasks();
}


function updateTaskInfo() {
    const completedCount = tasks.filter(function(task) {
        return task.completed;
    }).length;

    totalTasks.textContent = `Total: ${tasks.length}`;

    completedTasks.textContent =
        `Completed: ${completedCount}`;

    emptyMessage.style.display =
        tasks.length === 0 ? "block" : "none";
}


clearBtn.addEventListener("click", function() {
    if (tasks.length === 0) {
        return;
    }

    const confirmClear = confirm(
        "Are you sure you want to delete all tasks?"
    );

    if (confirmClear) {
        tasks = [];

        saveTasks();
        renderTasks();
    }
});


addBtn.addEventListener("click", addTask);


taskInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        addTask();
    }
});


renderTasks();