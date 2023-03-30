const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const userRoute = require("./routes/user");
const todoRoute = require("./routes/todo");


dotenv.config();

mongoose
.connect(process.env.MONGO_URL)
.then(() => console.log("DataBase Connected Successfully!"))
.catch((err) => {
    console.log(err);
});

app.use(cors());
app.use(express.json());
app.use("/api/user", userRoute);
app.use("/api/todo", todoRoute);

app.use('/server', todoRoute);




app.listen(process.env.PORT || 4000, () => {
    console.log("Server is running on port 4000");
});