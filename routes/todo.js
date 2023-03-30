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
   

  console.log('insdie the todo list route')
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
router.post('/List', async (req, res, next) => {
   // destructure page and limit and set default values
   const { page = 1, limit = 10 } = req.query;

   try {

   //  var id = new require('mongodb').ObjectID(req.userId);//req.params.id

   var Users = await Todo.find({email:req.body.email});

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
router.get('/:id', async (req, res) => {
  try {
    const todo = await Todo.findById();
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

  const { id } = req.params;
  const title = req.body;
  try {
      const todo = await Todo.findByIdAndUpdate(id,title, {new: true });
      if( !todo){
      return res.status(404).json({error: 'user not found'});
      }
      return res.json({message: 'user updated'})
  }catch (error) {
      return res.status(500).json({ error: error.message});
  }
});

// Delete Todo //
router.delete('/delete/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const todo = await Todo.findById(id);
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