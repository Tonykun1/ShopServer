const express = require('express');
const cors = require('cors'); 
const server = express();
const {Logs}= require("./Modules/middleware")
const {CreateUser,CheckByToken}=require("./Modules/Login")
const {Welcome , UpdateItem,AddItem,CheckItemByID,checkItems,DeleteItem} = require("./Modules/products")

const port = process.env.PORT || 3050;

server.use(cors()); 
server.use(express.json());
//Login.js
server.use(Logs);
//Products.js
server.get('/', Welcome);
server.get('/products', checkItems);
server.get('/products/:id', CheckItemByID);
server.post('/products', AddItem);
server.put('/products/:id', UpdateItem);
server.delete('/products/:id', DeleteItem);
//Login.js
server.post('/Login/CreateUser',CreateUser);
server.post('/Login/:token',CheckByToken);


server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
