const bodyParser = require("body-parser");
const mongoose = require("mongoose");

// Connect to the database
mongoose.connect(
  "mongodb+srv://<user>:<password>@<cluster>-bdovc.mongodb.net/TodoApp",
  {
    useNewUrlParser: true
  }
);

// Create a schema
const todoSchema = new mongoose.Schema({
  item: String
});

// Create a model
const Todo = mongoose.model("_todos", todoSchema);

let item1 = Todo({ item: "get flowers" }).save(err => {
  if (err) throw err;
  console.log("item saved");
});

// Middleware to handle req/res
let urlendcodedParser = bodyParser.urlencoded({ extended: false });

module.exports = app => {
  // GET
  app.get("/todo", (req, res) => {
    // get data from mongoDB and pass it to view
    Todo.find({}, (err, data) => {
      // find all of the items
      if (err) throw err;
      res.render("todo", { todos: data });
    });
  });

  // POST
  app.post("/todo", urlendcodedParser, (req, res) => {
    // get data from the view and add it to mongoDB
    let newTodo = Todo(req.body).save((err, data) => {
      if (err) throw err;
      res.json(data);
    });
  });

  // DELETE
  app.delete("/todo/:item", (req, res) => {
    // delete the requested item from mongoDB
    Todo.find({ item: req.params.item.replace(/\-/g, " ") }).remove(
      (err, data) => {
        if (err) throw err;
        res.json(data);
      }
    );
  });
};
