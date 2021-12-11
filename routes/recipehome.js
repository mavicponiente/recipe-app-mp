const express = require('express');
const db = require('mongoose');
const Recipe = require('../models/recipe');
const app = express();
const multer = require('multer');
const path = require('path');

app.use(express.static('./views'));
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set('views', './views');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/uploads');
  },

  filename: (req, file, cb) => {
    cb(null, file.originalname.slice(0, -4) + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

app.get('/home', function (req, res) {
  Recipe.find({}, function (err, recipe) {
    if (err) {
      console.log('Error in fetching recipes from db');
      return;
    }

    return res.render('home', {
      tittle: 'Recipe Home',
      recipe: recipe,
    });
  });
});

app.post('/create-recipe', upload.single('image'), function (req, res) {
  Recipe.create(
    {
      description: req.body.description,
      step: req.body.step,
      ingredients: req.body.ingredients,
      image: req.file.filename,
    },

    function (err, newrecipe) {
      if (err) {
        console.log('error in creating recipe', err);
        res.send('Error in creating recipe');

        return;
      }
      return res.redirect('back');
    }
  );
});
app.get('/delete-recipe', function (req, res) {
  // get the id from query
  var id = req.query;

  // checking the number of recipe selected to delete
  var count = Object.keys(id).length;
  for (let i = 0; i < count; i++) {
    // finding and deleting tasks from the DB one by one using id
    Recipe.findByIdAndDelete(Object.keys(id)[i], function (err) {
      if (err) {
        // console.log('error in deleting recipe');
      }
    });
  }
  return res.redirect('back');
});

module.exports = app;
