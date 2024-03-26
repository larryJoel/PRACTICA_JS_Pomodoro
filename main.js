document.addEventListener('DOMContentLoaded', function() {
    const tasks = [];
    let time = 0;
    let timer = null;
    let timerbreak = null;
    let current = null;

    const bAdd = document.querySelector("#bAdd");
    const itTask = document.querySelector("#itTask");
    const form = document.querySelector("#form");
    const taskName = document.querySelector('#time #taskname');
    
    renderTime();
    renderTasks();

    form.addEventListener('submit', e => {
        e.preventDefault();
        if (itTask.value !== '') {
            createTask(itTask.value);
            itTask.value = '';
            renderTasks();
        }
    });

    function createTask(value) {
        const newTask = {
            id: Math.round(Math.random() * 10),
            title: value,
            completed: false
        };
        tasks.unshift(newTask);
    }

    function renderTasks() {
        const html = tasks.map(task => {
            return `
                <div class="task">
                    <div class="completed">${task.completed ? `<span class="done">Done</span>` : `<button class="start-button" data-id="${task.id}">Start</button>`}</div>
                    <div class="title">${task.title}</div>
                </div>
            `;
        });
        const tasksContainer = document.querySelector('#tasks');
        tasksContainer.innerHTML = html.join("");

        const startButtons = document.querySelectorAll('.task .start-button');
        startButtons.forEach(button => {
            button.addEventListener('click', e => {
                if (!timer) {
                    const id = button.getAttribute('data-id');
                    startButtonHandler(id);
                    button.textContent = 'In progress...';
                    bAdd.disabled = true;
                }
            });
        });
    }

    function startButtonHandler(id) {
        time = 25 * 60; // 25 minutes
        current = id;
        const taskIndex = tasks.findIndex(task => task.id == id);
        taskName.textContent = tasks[taskIndex].title;
        renderTime();
        timer = setInterval(() => {
            timeHandler(id);
        }, 1000);
    }

    function timeHandler(id) {
        time--;
        renderTime();
        if (time === 0) {
            clearInterval(timer);
            markCompleted(id);
            timer = null;
            renderTasks();
            startBreak();
        }
    }

    function startBreak() {
        time = 5 * 60; // 5 minutes break
        taskName.textContent = "Break";
        renderTime();
        timerbreak = setInterval(() => {
            timerBreakHandler();
        }, 1000);
    }

    function timerBreakHandler() {
        time--;
        renderTime();

        if (time === 0) {
            clearInterval(timerbreak);
            current = null;
            timerbreak = null;
            taskName.textContent = "";
            renderTasks();
        }
    }

    function renderTime() {
        const timeDiv = document.querySelector('#time #value');
        const minutes = parseInt(time / 60);
        const seconds = parseInt(time % 60);
        timeDiv.textContent = `${minutes < 10 ? "0" : ""}${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    }

    function markCompleted(id) {
        const taskIndex = tasks.findIndex(task => task.id == id);
        tasks[taskIndex].completed = true;
    }
});
