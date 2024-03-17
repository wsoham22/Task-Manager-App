// utils.js

// Pagination logic
function paginate(array, page = 1, limit = 10) {
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    return array.slice(startIndex, endIndex);
}

// Sorting logic
function sortTasks(tasks, sortBy = 'date') {
    // Assuming sortBy can be 'date', 'completed', or 'default'
    switch (sortBy) {
        case 'date':
            tasks.sort((a, b) => new Date(a.date) - new Date(b.date));
            break;
        case 'completed':
            tasks.sort((a, b) => a.completed - b.completed);
            break;
        // Add more sorting options as needed
        default:
            // Default sorting logic
            break;
    }
    return tasks;
}

// Filtering logic
function filterTasks(tasks, filters) {
    // Assuming filters can include 'completed', 'category', etc.
    // Implement your filtering logic here
    // ...

    return tasks;
}
// Validation logic
// Validation logic
function validateTaskData(data) {
    // Assuming you want to validate task data before saving
    if (!data.date || !data.task || !Array.isArray(data.task) || data.task.length === 0) {
        throw new Error('Invalid task data. Date and non-empty task array are required.');
    }

    // Add more validation logic as needed

    return true;
}

module.exports = { paginate, sortTasks, filterTasks, validateTaskData };

