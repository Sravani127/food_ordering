import React, { useState } from "react";
import { Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import "./food-items.css";

const FoodItems = ({
  items = [
    {
      name: "Appetizers",
      items: [
        {
          name: "Bruschetta",
          image: "bruschetta.jpg",
          price: 8.99,
        },
        {
          name: "Caprese Salad",
          image: "caprese_salad.jpg",
          price: 10.99,
        },
        {
          name: "Garlic Bread",
          image: "garlic_bread.jpg",
          price: 6.99,
        },
      ],
    },
    {
      name: "Main Courses",
      items: [
        {
          name: "Margherita Pizza",
          image: "margherita_pizza.jpg",
          price: 12.99,
        },
        {
          name: "Spaghetti Carbonara",
          image: "spaghetti_carbonara.jpg",
          price: 14.99,
        },
        {
          name: "Chicken Parmesan",
          image: "chicken_parmesan.jpg",
          price: 16.99,
        },
      ],
    },
    {
      name: "Extra Dishes",
      items: [
        {
          id: 7,
          name: "Cheeseburger",
          image: "cheeseburger.jpg",
          price: 9.99,
        },
        {
          id: 8,
          name: "Caesar Salad",
          image: "caesar_salad.jpg",
          price: 11.99,
        },
        {
          id: 9,
          name: "Fettuccine Alfredo",
          image: "fettuccine_alfredo.jpg",
          price: 15.99,
        },
      ],
    },
    {
      name: "Soft Drinks",
      items: [
        {
          id: 10,
          name: "Coca-Cola",
          image: "cocacola.jpg",
          price: 1.99,
        },
        {
          id: 11,
          name: "Sprite",
          image: "sprite.jpg",
          price: 1.99,
        },
        {
          id: 12,
          name: "Fanta",
          image: "fanta.jpg",
          price: 1.99,
        },
      ],
    },
  ],
}) => {
    const [cartItems, setCartItems] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [open, setOpen] = useState(false); // State for modal visibility
    const [selectedItem, setSelectedItem] = useState(null); // State to store the selected food item
    const [selectedSoftDrinks, setSelectedSoftDrinks] = useState([]); // State to store selected soft drinks
  
    const handleAddToCart = (item) => {
      setSelectedItem(item); // Set the selected item
      setOpen(true); // Open the modal
    };
  
    const handleClose = () => {
      setOpen(false); // Close the modal
      setSelectedItem(null); // Clear selected item
      setSelectedSoftDrinks([]); // Clear selected soft drinks
    };
  
    const handleSkip = () => {
      if (selectedItem) {
        setCartItems([...cartItems, selectedItem]);
        setTotalAmount(totalAmount + selectedItem.price);
        handleClose(); // Close the modal after skipping soft drink selection
      }
    };
  
    const handleAddSoftDrink = (softDrink) => {
      setSelectedSoftDrinks([...selectedSoftDrinks, softDrink]);
    };
  
    const handleContinue = () => {
      if (selectedItem) {
        const updatedCartItem = { ...selectedItem, softDrinks: selectedSoftDrinks };
        setCartItems([...cartItems, updatedCartItem]);
        setTotalAmount(totalAmount + selectedItem.price);
        handleClose(); // Close the modal after adding soft drinks
      }
    };
  
    return (
      <div className="food-items">
        {items.map((category, index) => (
          <div key={index}>
            <Typography variant="h5" gutterBottom>{category.name}</Typography>
            <div className="items-container">
              {category.items.map((item, idx) => (
                <div key={idx} className="item">
                  <img src={item.image} alt={item.name} />
                  <Typography variant="body1">{item.name}</Typography>
                  <Typography variant="body2">${item.price.toFixed(2)}</Typography>
                  <div className="quantity-buttons">
                    <Button variant="outlined" onClick={() => handleAddToCart(item)}>Add</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        <Box className="cart-summary" mt={2} p={2} bgcolor="#f0f0f0" borderRadius={10}>
          <Typography variant="h6">Cart Summary</Typography>
          <Typography variant="body1">Total Items: {cartItems.length}</Typography>
          <Typography variant="body1">Total Amount: ${totalAmount.toFixed(2)}</Typography>
        </Box>
  
        {/* Soft Drink Popup */}
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Add Soft Drink</DialogTitle>
          <DialogContent>
            {items.find(category => category.name === "Soft Drinks").items.map((softDrink, idx) => (
              <Button key={idx} variant="outlined" onClick={() => handleAddSoftDrink(softDrink)}>
                {softDrink.name} - ${softDrink.price.toFixed(2)}
              </Button>
            ))}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleSkip}>Skip</Button>
            <Button onClick={handleContinue} disabled={!selectedSoftDrinks.length}>Continue</Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  
};

export default FoodItems;
