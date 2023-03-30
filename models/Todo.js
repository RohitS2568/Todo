const mongoose = require("mongoose");
const auth = require("../middleware/auth")

const TodoSchema = new mongoose.Schema(
    {
        
        title: {type:String, required: true},
        description: {type: String, required: true},
        completed: {type: Boolean, default: false,},
       // email:{type:String, required: true, unique: true},
      //   token: {type: String, required: true},
        isAdmin: {
            type: Boolean,
            default: false,
        },
        email:{type:String, required: true},
        
    },
    { timestamps: true }
);

module.exports = mongoose.model("newTodo", TodoSchema);