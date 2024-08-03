const express = require('express');
const cors = require('cors'); 
const server = express();
const {Logs}= require("./Modules/middleware")
const {CreateUser,CheckByToken}=require("./Modules/Login")
const {Welcome , UpdateItem,AddItem,CheckItemByID,checkItems,DeleteItem} = require("./Modules/products")
const { UpdateCategory, AddCategory ,checkCategory,DeleteCategory}=require("./Modules/Category")
const port = process.env.PORT || 3050;

server.use(cors()); 
server.use(express.json());
//middleware.js
server.use(Logs);
//Products.js
server.get('/', Welcome);
server.get('/products', checkItems);
server.get('/products/:id', CheckItemByID);
server.post('/products', AddItem);
server.put('/products/:id', UpdateItem);
server.delete('/products/:id', DeleteItem);

//Category.js
server.get('/category', checkCategory);
server.post('/category', AddCategory);
server.put('/category/:name', UpdateCategory);
server.delete('/category/:name', DeleteCategory);
//Login.js
server.post('/Login/CreateUser',CreateUser);
server.post('/Login/:token',CheckByToken);



server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
