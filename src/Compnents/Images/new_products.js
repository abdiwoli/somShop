import product1 from './logo.png';
import product2 from './logo.png'; // You might want to use different images if available
import product3 from './logo.png';
import product4 from './logo.png';

const new_products = [
    {
        id: 1,
        catagory: "shoes", // Fixed spelling
        name: "test1",
        image: product1,
        price: 30.1,
        prev_price: 22
    },
    {
        id: 2, // Changed ID to be unique
        catagory: "clothes", // Fixed spelling
        name: "test2", // Changed name for uniqueness
        image: product2,
        price: 25.5, // Different price for variation
        prev_price: 20
    },
    {
        id: 3,
        catagory: "shoes",
        name: "test3",
        image: product3,
        price: 22.0,
        prev_price: 18
    },
    {
        id: 4, 
        catagory: "electronics",
        name: "test4", 
        image: product4,
        price: 50.0,
        prev_price: 45
    }
];

export default new_products;