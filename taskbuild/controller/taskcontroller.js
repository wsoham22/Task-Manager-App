const Task = require("./../models/taskmodel");
const { paginate, sortTasks, filterTasks, validateTaskData } = require('./../utils/utils');

exports.createTask = async (req, res, next) => {
    try {
        const { date, task } = req.body; // Update from "tasks" to "task"
        // validateTaskData(req.body);
        // Create a new task document using the Task model
        const newTask = new Task({
            date: date,
            task: task // Update from "tasks" to "task"
        });

        // Save the task to the database
        await newTask.save();

        // Send a response indicating success
        res.status(201).json({ message: "Task created successfully", task: newTask });
    } catch (error) {
        // Handle errors
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
exports.gettask = async (req, res, next) => {
    try {
        const id = req.params.id; // Correct variable name to lowercase 'id'
        const getTask = await Task.findById(id);

        if (!getTask) {
            return res.status(404).json({
                status: 'fail',
                message: 'Task not found with this ID!'
            });
        }

        res.status(200).json({
            status: 'success',
            data: {
                task: getTask
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'error',
            message: 'Internal Server Error'
        });
    }
};
exports.getallTasks = async(req,res,next) =>{
    try {
        const tasks = await Task.find();

        // Use pagination, sorting, and filtering
        const paginatedTasks = paginate(tasks, req.query.page, req.query.limit);
        const sortedTasks = sortTasks(paginatedTasks, req.query.sortBy);
        const filteredTasks = filterTasks(sortedTasks, req.query.filters);

        res.status(200).json({
            tasks: filteredTasks
        });
    }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error getting all tasks' });
        }
    }
    exports.deletetask = async (req, res, next) => {
        try {
            const taskId = req.params.id;
    
            // Find and delete the task by ID
            const deletedTask = await Task.findByIdAndDelete(taskId);
    
            if (!deletedTask) {
                return res.status(404).json({
                    status: 'fail',
                    message: 'Task not found with this ID!'
                });
            }
    
            // Respond with only the relevant information, not the entire MongoDB client
            res.status(200).json({
                status: 'success',
                data: {
                    task: {
                        _id: deletedTask._id,
                        date: deletedTask.date,
                        // Add other relevant properties here
                    }
                }
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                status: 'error',
                message: 'Internal Server Error'
            });
        }
    };

    exports.updatetask = async (req, res, next) => {
        try {
            const taskId = req.params.id;
            const { date, task, completed } = req.body;
    
            // Find and update the task by ID
            const updatedTask = await Task.findByIdAndUpdate(
                taskId,
                { date: date, task: task, completed: completed },
                { new: true } // Ensure you get the updated document in the response
            );
            if (!updatedTask) {
                return res.status(404).json({
                    status: 'fail',
                    message: 'Task not found with this ID!'
                });
            }
    
            res.status(200).json({
                status: 'success',
                data: {
                    task: updatedTask
                }
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                status: 'error',
                message: 'Internal Server Error'
            });
        }
    };
    
    // Update your taskcontroller.js
    exports.deletealltasks = async(req,res,next) =>{
        try{
            await Task.deleteMany();
            res.status(200).json({
                status:'success',
                data:'null'
            });
        }
        catch(err){
            console.error(err);
            res.status(500).json({ message: 'Error deleting all tasks' });
        }
    }