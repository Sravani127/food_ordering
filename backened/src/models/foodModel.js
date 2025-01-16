const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({

    foodName: {
        type: String,
        required: [true, 'Food Name is required']
    },
    foodType: {
        type: String,
        required: [true, 'Food Type is required'],
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
    },
    foodCategory: {
        type: String,
        required: [true, 'Food Category is required'],
    },
    courseType: {
        type: String,
        required: [true, 'Course Type is required'],
    },
    image:{
        type: String,
        //required: [true, "Image is required"]
    },
    finalPrice:{
        type: String,
        required: [true, "Price is required"]
    },
    extraFoods:{
        type: Array,
    },
    isPopular:{
        type: Boolean,
    },
    // isFavourite:{
    //     type: Boolean,
    // },
    isLikedBy:{
        type: Array,
    }
});

const Food = mongoose.model('Food', foodSchema);

module.exports = Food;
