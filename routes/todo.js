const router = require("express").Router();
const bcrypt = require("bcrypt");
const Todo = require('../models/Todo');
const token = require("../middleware/auth");
const user = require("../models/User");
const {
  verifyToken,
  verifyTokenAndAuthorization,
} = require("../middleware/auth");



router.get("/server", (req, res) => {
  res.json({ message: "Server connected" });
});

// CREATE a New Todo //

router.post('/Todo', async (req, res,) => {
   

  console.log('inside the todo list route')
  const todo = new Todo({
    
    title: req.body.title,
    description: req.body.description,
    email: req.body.email
 
  });

  try {
  

    const newTodo = await todo.save();
    res.status(201).json(newTodo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
// GET All Todos //
router.get('/List', async (req, res, next) => {
   // destructure page and limit and set default values
   const { page = 1, limit = 10 } = req.query;

   try {

   //  var id = new require('mongodb').ObjectID(req.userId);//req.params.id
   const { email } = req.body;
   var Users = await Todo.find({email:req.body.email});

     // Filter by completed status if specified in query params
     const completed = req.query.completed;
     const filter = completed === 'true' ? { completed: true } :
                    completed === 'false' ? { completed: false } :
                    {};
 
     // Find all TODO items for the current user
     const todos = await Todo.find({ email, ...filter });

   // console.log(JSON.stringify(Users));

   
     // execute query with page and limit values
     const posts = await Todo.find({email:req.body.email})
       .limit(limit * 1)
       .skip((page - 1) * limit)
       .exec();
 
     // get total documents in the Posts collection 
     const count = await Todo.countDocuments();
 
     // return response with posts, total pages, and current page
     res.json({
       posts,
       totalPages: Math.ceil(count / limit),
       currentPage: page
     });
   } catch (err) {
     console.error(err.message);
   }
 });

// GET a specific Todo //
router.get('/User:id', async (req, res) => {
  try {
    const { id } = req.body;
    const todo = await Todo.findById(id);
    return res.json({ todo });

}catch (error) {
    return res.status(500).json({ error: error.message});
}
});
  
// Completed statement //
router.put('/completed/:id', async (req, res) => {
  try {
   
    const { id } = req.params;
    const { completed } = req.body;
    const todo = await Todo.findById(id);
    if (!todo) {
      return res.status(404).json({ msg: 'Todo not found' });
    }
    todo.completed = completed;
    await todo.save();
    res.json(todo);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// UPDATE a todo
router.patch('/update/:id', async (req, res) => {
 
  try {
    const { email } = req.body;
  const { id } = req.params;
  const title = req.body;
      const todo = await Todo.findByIdAndUpdate(id,title,email, {new: true });
      if( !todo){
      return res.status(404).json({error: 'user not found'});
      }
      return res.json({message: 'user updated'})
  }catch (error) {
      return res.status(500).json({ error: error.message});
  }
});

// Update a TODO item by ID
router.put('/todos/:id', async (req, res) => {
  try {
    const { title, description, completed } = req.body;
    const todoId = req.params.id;
    const { email } = req.body;
    var Users = await Todo.find({email:req.body.email});

    // Get the user ID from the JWT token
    //const { userId } = jwt.verify(req.headers.authorization, 'secret');

    // Find the TODO item by ID and user ID
    const todo = await Todo.findOne({ _id: todoId, email });
    if (!todo) {
      return res.status(404).json({ message: 'TODO item not found' });
    }

    // Update the TODO item and save
    todo.title = title || todo.title;
    todo.description = description || todo.description;
    todo.completed = completed === undefined ? todo.completed : completed;
    await todo.save();

    res.json(todo);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete Todo //
router.delete('/delete/:id', async (req, res) => {
    try {
      const { email } = req.body;
      const { id } = req.params;
      const todo = await Todo.findById(id,email);
      console.log(todo);
      if (!todo) {
        return res.status(404).json({ msg: 'Todo not found' });
      }
      await todo.deleteOne();
      
      res.json({ msg: 'Todo Removed' });
    }catch (err) {
      res.status(400).json({ message: err.message });
    }
});
 

module.exports = router;
