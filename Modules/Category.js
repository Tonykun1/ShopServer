const fs = require('fs');
const path = require('path');
const { fsReadFile, fsWriteFile } = require('./products');

const fileCategory = 'data/Category.json';
const fileArchiveCat =  'data/ArchiveCategory.json';

const checkTheItem = (product) => {
  return product.slug !== '' && product.name !== '' && product.url !== '';
};

const UpdateCategory = async (req, res) => {
  const { name } = req.params;
  const updatedProduct = req.body;

  if (!checkTheItem(updatedProduct)) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const products = await fsReadFile(fileCategory);
    const productIndex = products.findIndex(item => item.name === name);
    if (productIndex === -1) {
      return res.status(404).json({ error: 'Category not found' });
    }
    products[productIndex] = { ...products[productIndex], ...updatedProduct };
    await fsWriteFile(fileCategory, products);
    res.json(products[productIndex]);
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(400).json({ error: 'Error updating category' });
  }
};

const AddCategory = async (req, res) => {
  const newProduct = req.body;

  if (!checkTheItem(newProduct)) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const products = await fsReadFile(fileCategory);
    products.push(newProduct);
    await fsWriteFile(fileCategory, products);
    res.json(newProduct);
  } catch (error) {
    console.error('Error adding category:', error);
    res.status(400).json({ error: 'Error adding category' });
  }
};

const checkCategory = async (req, res) => {
  try {
    const products = await fsReadFile(fileCategory);
    res.json(products);
  } catch (error) {
    console.error('Error reading the file:', error);
    res.status(404).json({ error: 'Error reading the file' });
  }
};

const DeleteCategory = async (req, res) => {
  const { name } = req.params;

  try {
    let products = await fsReadFile(fileCategory);
    
    if (products.length === 0) {
      return res.status(404).json({ message: 'Category.json is missing or empty' });
    }

    const index = products.findIndex(item => item.name === name);
    if (index === -1) {
      return res.status(404).json({ error: 'Category not found' });
    }

    const removedProduct = products.splice(index, 1);
    let archivedProducts;
    try {
      archivedProducts = await fsReadFile(fileArchiveCat);
    } catch (error) {
      archivedProducts = [];
    }

    archivedProducts.push(removedProduct);

    await fsWriteFile(fileCategory, products);
    
    await fsWriteFile(fileArchiveCat, archivedProducts);

    res.json({ message: `Category with name ${name} deleted and archived` });
  } catch (error) {
    console.error('Error during delete and archive operation:', error);
    res.status(404).json({ error: 'Error deleting and archiving category' });
  }
};

module.exports = { UpdateCategory, AddCategory, checkCategory, DeleteCategory };
