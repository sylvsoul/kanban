// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId")) || 1;





// Function to generate a unique task id
function generateTaskId() {
    let id = nextId;
    nextId++; // Increment the nextId for the next task
    localStorage.setItem('nextId', JSON.stringify(nextId)); // Store the updated nextId
    return id;
}

// Function to create a task card
function createTaskCard(task) {
    // Create elements
    const div = document.createElement('div');
    const p = document.createElement('p');
    const button = document.createElement('button');
    
    // Set attributes and content
    div.className = 'task-card';
    div.id = `task-${task.id}`;
    div.setAttribute('draggable', 'true');
    p.textContent = task.title;
    button.textContent = 'Delete';
    button.className = 'delete-task-btn';
    button.onclick = () => handleDeleteTask(task.id);

    // Append elements
    div.appendChild(p);
    div.appendChild(button);

    // Return the outermost element
    return div;
}

// Function to render the task list
function renderTaskList() {
    ['todo', 'in-progress', 'done'].forEach(status => {
        const lane = document.getElementById(`${status}-cards`);
        lane.innerHTML = ''; // Clear existing tasks
        taskList.filter(task => task.status === status).forEach(task => {
            lane.appendChild(createTaskCard(task));
        });
    });
}

// Function to handle adding a new task
function handleAddTask(event) {
    event.preventDefault();
    const taskTitle = document.getElementById('taskTitle').value;
    if (taskTitle) {
        const newTask = {
            id: generateTaskId(),
            title: taskTitle,
            status: 'todo' // Default status
        };
        taskList.push(newTask);
        localStorage.setItem('tasks', JSON.stringify(taskList));
        renderTaskList(); // Re-render the task list
        $('#formModal').modal('hide');
    }
}

// Function to handle deleting a task
function handleDeleteTask(taskId) {
    taskList = taskList.filter(task => task.id !== taskId);
    localStorage.setItem('tasks', JSON.stringify(taskList));
    renderTaskList(); // Re-render the task list
}

// Initialization to set up the page and event listeners
document.addEventListener('DOMContentLoaded', () => {
    const lanes = document.querySelectorAll('.lane'); // Assuming '.lane' is the class for your task containers
    lanes.forEach(lane => {
        lane.addEventListener('click', function(event) {
            if (event.target.classList.contains('delete-task-btn')) {
                // Extract task ID from the closest task card to the clicked button
                const taskId = event.target.closest('.task-card').id.replace('task-', '');
                handleDeleteTask(parseInt(taskId));
            }
        });
    });
    
    renderTaskList();
    document.getElementById('addTaskForm').addEventListener('submit', handleAddTask);
    setUpDragAndDrop();


    // Call these functions inside your document.addEventListener('DOMContentLoaded', ...)
    function setUpDragAndDrop() {
        const cards = document.querySelectorAll('.task-card');
        const lanes = document.querySelectorAll('.lane');
    
        // Handling drag start
        cards.forEach(card => {
            card.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', card.id);
            });
        });
    
        // Handling drag over and drop on lanes
        lanes.forEach(lane => {
            lane.addEventListener('dragover', (e) => {
                e.preventDefault(); // Necessary to allow dropping
            });
    
            lane.addEventListener('drop', (e) => {
                e.preventDefault();
                const id = e.dataTransfer.getData('text/plain');
                const card = document.getElementById(id);
                const droppingZone = e.target.closest('.lane');
                droppingZone.appendChild(card);
    
                // Update task status based on drop location
                let newStatus = droppingZone.id; // Assuming the lane ids are 'todo', 'in-progress', 'done'
                newStatus = newStatus.replace('lane-', ''); // Correcting if lane IDs are prefixed
                
                updateTaskStatus(id.replace('task-', ''), newStatus);
            });
        });
    }
    
    // Adjust the rest of your code to call `setUpDragAndDrop()` at the right time, ensuring it encapsulates all cards, including newly added ones.
    

function updateTaskStatus(taskId, newStatus) {
    taskId = parseInt(taskId); // Ensure taskId is an integer
    const task = taskList.find(task => task.id === taskId);
    if (task) {
        task.status = newStatus;
        localStorage.setItem('tasks', JSON.stringify(taskList));
        //renderTaskList(); // Optional: if you want to refresh the list
    }
}

// Remember to call setUpDragAndDrop() inside your DOMContentLoaded listener, after renderTaskList();

});
