const express = require('express');
const cors = require('cors');
const { Logs, isAdmin} = require('./Modules/middleware');
const { CreateUser, CheckByToken, DeleteUser, checkUsers } = require('./Modules/Login');
const { Welcome, UpdateItem, AddItem, CheckItemByID, checkItems, DeleteItem } = require('./Modules/products');
const { UpdateCategory, AddCategory, checkCategory, DeleteCategory } = require('./Modules/Category');

const server = express();
const port = process.env.PORT || 3050;

server.use(cors());
server.use(express.json());

// Middleware
server.use(Logs);

// Routes
server.get('/', Welcome);
server.get('/products', checkItems);
server.get('/products/:id', CheckItemByID);
server.post('/products', AddItem);
server.put('/products/:id', UpdateItem);
server.delete('/products/:id', DeleteItem);

server.get('/category', checkCategory);
server.post('/category', AddCategory);
server.put('/category/:name', UpdateCategory);
server.delete('/category/:name', DeleteCategory);

server.get('/Login/checkUsers', isAdmin, checkUsers);//u need the token of admin for it 
server.post('/Login/CreateUser', CreateUser);
server.post('/Login/checkUsers/:token', CheckByToken);
server.delete('/Login/:token', DeleteUser);

server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
