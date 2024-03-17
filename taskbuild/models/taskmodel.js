const mongoose = require("mongoose");

const taskschema = new mongoose.Schema({
    date: {
        type: Date
    },
    task: {
        type: Array,
        required: true,
        validate: {
            validator: function (v) {
                return v.length <= 30 && v.length > 0;
            },
            message: 'Task array must have a length less than or equal to 30.'
        }
    },
    completed: {
        type: Boolean,
        default: false
    },
    category: {
        type: [String],
        default: []
    }
});

const taskmodel = mongoose.model('task', taskschema);
module.exports = taskmodel;
