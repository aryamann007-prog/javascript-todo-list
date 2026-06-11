const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const filterButtons = document.querySelectorAll(".filter-btn");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
    taskList.innerHTML = "";

    let filteredTasks = tasks.filter(task => {
        if (currentFilter === "active") return !task.completed;
        if (currentFilter === "completed") return task.completed;
        return true;
    });

    filteredTasks.forEach(task => {
        const li = document.createElement("li");
        li.classList.add("task-item");

        if (task.completed) {
            li.classList.add("completed");
        }

        li.innerHTML = `
            <span>${task.text}</span>
            <div class="task-actions">
                <button class="complete-btn" data-id="${task.id}">
                    ${task.completed ? "Undo" : "Done"}
                </button>
                <button class="edit-btn" data-id="${task.id}">Edit</button>
                <button class="delete-btn" data-id="${task.id}">Delete</button>
            </div>
        `;

        taskList.appendChild(li);
    });
}

addBtn.addEventListener("click", () => {
    const text = taskInput.value.trim();

    if (text === "") return;

    tasks.push({
        id: Date.now(),
        text,
        completed: false
    });

    saveTasks();
    renderTasks();
    taskInput.value = "";
});

taskList.addEventListener("click", (e) => {
    const id = Number(e.target.dataset.id);

    if (e.target.classList.contains("delete-btn")) {
        tasks = tasks.filter(task => task.id !== id);
    }

    if (e.target.classList.contains("complete-btn")) {
        tasks = tasks.map(task =>
            task.id === id
                ? { ...task, completed: !task.completed }
                : task
        );
    }

    if (e.target.classList.contains("edit-btn")) {
        const task = tasks.find(task => task.id === id);

        const newText = prompt("Edit Task:", task.text);

        if (newText && newText.trim() !== "") {
            task.text = newText.trim();
        }
    }

    saveTasks();
    renderTasks();
});

filterButtons.forEach(button => {
    button.addEventListener("click", () => {
        currentFilter = button.dataset.filter;
        renderTasks();
    });
});

renderTasks();