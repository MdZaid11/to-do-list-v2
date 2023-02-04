const mongoose = require('mongoose')
mongoose.set('strictQuery', true);
const express = require('express');
const bodyParser = require('body-parser')
const app = express();
var _=require('lodash')
var day;


app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(express.static("public"))
app.set('view engine', 'ejs')
mongoose.connect("mongodb+srv://admin-zaid:test123@cluster0.lm9q5kw.mongodb.net/todoList")
const itemSchema = new mongoose.Schema({
  name: String
})

const Item = new mongoose.model("Item", itemSchema)
const item1 = new Item({
  name: "welcome to your todolist"
})
const item2 = new Item({
  name: "Hit + to add a items"
})
const item3 = new Item({
  name: "<-- click icon to delete item"
})
const defaultItems = [item1, item2, item3];
const listSchema = {
  name: String,
  items: [itemSchema]
}
const List1 = new mongoose.model('List', listSchema)
// Item.insertMany(defaultItems,function(err){
//   if(err){
//     console.log(err)
//   }
//   else {
//     console.log("success")
//   }
// })

app.get("/", function(req, res) {
  var options = {
    weekday: "long",
    day: "numeric",
    month: "long"

  }
  var today = new Date();
  day = today.toLocaleDateString("en-US", options)

  Item.find({}, function(err, results) {
    if (err) {
      console.log(err)
    } else if (results.length === 0) {
      Item.insertMany(defaultItems, function(err) {
        if (err) {
          console.log(err)
        } else {
          console.log("success")
        }
      })
      res.redirect('/')

    } else {
      res.render("list", {
        kindOfPage: day,
        newItems: results //  here the value of item is send to the web page
      })
    }
  })
  // res.render("list", {
  //   kindOfPage: day,
  //   newItems: results //  here the value of item is send to the web page
  // })
})
app.post('/', function(req, res) {
  var itemName = req.body.newItem
  var listName=  req.body.list;
  console.log(listName);
  const item = new Item({
    name: itemName
  });
if (listName===day){
  item.save();
  res.redirect('/')
}else {
  List1.findOne({name:listName},function(err,foundList){
    foundList.items.push(item);
    foundList.save();
    res.redirect('/' + listName)
  })
}

  // if (req.body.list === "work") {
  //   if (item === "") {
  //     res.redirect('/work')
  //   } else {
  //     workItem.push(item)
  //     res.redirect('/work')
  //   }
  //
  // } else {
  //   if (item === "") {
  //     res.redirect('/')
  //   } else {
  //     items.push(item)
  //       res.redirect('/')
  //   }
  // }



})
app.post('/delete', function(req, res) {
  const itemId = (req.body.deleteItem)
   const listItem=(req.body.listItem);
   console.log(listItem)
   console.log(itemId)
if(listItem===day){
  Item.findByIdAndDelete(itemId, function(err) {
    if (err) {
      console.log(err)
    } else {
      res.redirect('/')
    }
  })

}else {
   List1.findOneAndUpdate({name:listItem},{$pull:{items:{_id:itemId}}},function(err,foundItem){
     if(err){
       console.log(err)
}
     else {
       res.redirect(listItem)
     }
   })
}



})
app.get('/:customListName', function(req, res) {
  const listP = _.capitalize((req.params.customListName));
      List1.findOne({
        name: listP
      }, function(err, foundItem) {
        if (!err) {
          if (!foundItem) {
            const list = new List1({
              name: listP,
              items: defaultItems
            })
            list.save();
            res.redirect("/" + listP)
          } else {
            res.render("list", {
              kindOfPage: listP,
              newItems: foundItem.items
            })
          }
        }

      })
    })

      app.post('/:customListName', function(req, res) {
        const params = req.body.newItem
        console.log(params);



      })
      // app.post('/work',function(req,res){
      //
      //   workItem.push(item1);
      //
      // })
      app.get("/about", function(req, res) {
        res.render("about")
      })
      var PORT = 3000;
      app.listen(PORT, function(err) {
        if (err) console.log("Error in server setup")
        console.log("Server listening on Port", PORT);
      })
