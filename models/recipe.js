// require the library
const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
  },
  step: {
    type: String,
    required: true,
  },
  ingredients: {
    type: String,
    required: true,
  },
});

const Recipe = mongoose.model('Recipe', recipeSchema);

// exporting the Schema
module.exports = Recipe;
