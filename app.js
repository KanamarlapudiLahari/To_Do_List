let tasks = [];
let editingTaskId = null;

function addTask() {
    const taskInput = document.getElementById('task-input');
    const descriptionInput = document.getElementById('description-input');
    const dueDate = document.getElementById('due-date').value;
    const taskText = taskInput.value;
    const descriptionText = descriptionInput.value;

    if (taskText === '' || descriptionText === '') return;

    const task = {
        id: Date.now(),
        text: taskText,
        description: descriptionText,
        completed: false,
        dueDate: new Date(dueDate)
    };

    if (editingTaskId) {
        // Update existing task
        const index = tasks.findIndex(t => t.id === editingTaskId);
        tasks[index] = task;
        editingTaskId = null;
    } else {
        // Add new task
        tasks.push(task);
    }

    taskInput.value = '';
    descriptionInput.value = '';
    document.getElementById('due-date').value = '';
    sortTasks();
    renderTasks();
    toggleTaskForm(false);
}

function renderTasks() {
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = '';

    tasks.forEach(task => {
        const tr = document.createElement('tr');
        tr.className = task.completed ? 'table-success' : '';

        const taskCell = document.createElement('td');
        taskCell.textContent = task.text;
        const descriptionCell = document.createElement('td');
        descriptionCell.textContent = task.description;
        const dueDateCell = document.createElement('td');
        dueDateCell.textContent = task.dueDate.toISOString().split('T')[0];

        const actionCell = document.createElement('td');
        const completeButton = document.createElement('button');
        completeButton.className = 'btn btn-success btn-sm';
        completeButton.textContent = task.completed ? 'Completed' : 'Complete';
        completeButton.onclick = () => toggleComplete(task.id);
        
        const editButton = document.createElement('button');
        editButton.className = 'btn btn-warning btn-sm mx-2';
        editButton.textContent = 'Edit';
        editButton.onclick = () => editTask(task.id);
        
        if (task.completed) {
            completeButton.disabled = true;
            editButton.style.display = 'none';
        }
        
        const deleteButton = document.createElement('button');
        deleteButton.className = 'btn btn-danger btn-sm';
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = () => deleteTask(task.id);

        actionCell.appendChild(completeButton);
        actionCell.appendChild(editButton);
        actionCell.appendChild(deleteButton);

        tr.appendChild(taskCell);
        tr.appendChild(descriptionCell);
        tr.appendChild(dueDateCell);
        tr.appendChild(actionCell);
        taskList.appendChild(tr);
    });
}


function toggleComplete(taskId) {
    const task = tasks.find(t => t.id === taskId);
    
    // Check if the task is already completed
    if (task.completed) {
        alert("Editing is not possible if the task is completed.");
    } else {
        // Show confirmation to mark as completed
        if (confirm("Are you sure you want to mark this task as completed?")) {
            task.completed = true; 
            sortTasks();
            renderTasks();

            // Disable the edit button and complete button immediately after marking as completed
            const editButton = document.querySelector(`button[onclick="editTask(${taskId})"]`);
            const completeButton = document.querySelector(`button[onclick="toggleComplete(${taskId})"]`);
            if (editButton) {
                editButton.disabled = true;
                editButton.style.display = 'none';
            }
            if (completeButton) {
                completeButton.disabled = true;
                completeButton.style.display = 'none';
            }
        }
    }
}

function deleteTask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (confirm(`Are you sure you want to delete the task: "${task.text}"?`)) {
        tasks = tasks.filter(t => t.id !== taskId);
        renderTasks();
    }
}

function editTask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    document.getElementById('task-input').value = task.text;
    document.getElementById('description-input').value = task.description;
    document.getElementById('due-date').value = task.dueDate.toISOString().split('T')[0];
    editingTaskId = task.id;
    toggleTaskForm(true);
}

function toggleTaskForm(isEditing) {
    const addButton = document.getElementById('add-btn');
    const cancelButton = document.getElementById('cancel-btn');

    if (isEditing) {
        addButton.textContent = 'Update Task';
        addButton.classList.remove('btn-primary');
        addButton.classList.add('btn-warning');
        cancelButton.classList.remove('d-none');
    } else {
        addButton.textContent = 'Add Task';
        addButton.classList.remove('btn-warning');
        addButton.classList.add('btn-primary');
        cancelButton.classList.add('d-none');
        document.getElementById('task-input').value = '';
        document.getElementById('description-input').value = '';
        document.getElementById('due-date').value = '';
    }
}

function cancelEdit() {
    editingTaskId = null;
    toggleTaskForm(false);
}

// Sort tasks by completion status and due date
function sortTasks() {
    tasks.sort((a, b) => {
        if (a.completed !== b.completed) {
            return a.completed ? -1 : 1;
        }
        return a.dueDate - b.dueDate;
    });
}