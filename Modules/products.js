const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const fileProducts = "data/Products.json";
const fileArchive="data/Archive.json";
const Welcome = (req, res) => {
    res.send('Welcome to my ShitShop CRUD!');
}

const fsReadFile = (filePath) => {
    return new Promise((res, rej) => {
        fs.readFile(filePath, 'utf8', (error, data) => {
            if (!error) {
                if (data) {
                    res(JSON.parse(data));
                } else {
                    res([]);
                }
            } else if (error.code === 'ENOENT') {
                res([]); 
            } else {
                rej(error);
            }
        });
    });
};


const fsWriteFile = (filePath, data) => {
    return new Promise((res, rej) => {
        fs.writeFile(filePath, JSON.stringify(data), 'utf8', (err) => {
            if (err) {
                rej(err);
            } else {
                res('Success');
            }
        });
    });
}

const checkTheItem = (updatedProduct) => {
    return updatedProduct.title && updatedProduct.description && updatedProduct.category &&
        updatedProduct.price !== undefined && updatedProduct.discountPercentage !== undefined &&
        updatedProduct.rating !== undefined && updatedProduct.stock !== undefined && updatedProduct.tags &&
        updatedProduct.brand && updatedProduct.sku && updatedProduct.weight !== undefined &&
        updatedProduct.dimensions && updatedProduct.dimensions.width !== undefined &&
        updatedProduct.dimensions.height !== undefined && updatedProduct.dimensions.depth !== undefined &&
        updatedProduct.warrantyInformation && updatedProduct.shippingInformation &&
        updatedProduct.availabilityStatus && updatedProduct.reviews && updatedProduct.returnPolicy &&
        updatedProduct.minimumOrderQuantity !== undefined && updatedProduct.meta &&
        updatedProduct.meta.createdAt && updatedProduct.meta.updatedAt &&
        updatedProduct.meta.barcode && updatedProduct.meta.qrCode && updatedProduct.images && updatedProduct.thumbnail;
}
const CheckUpDate=(updatedProduct)=>{
    return updatedProduct.id|| updatedProduct.title || 
    updatedProduct.description || 
    updatedProduct.category || 
    updatedProduct.price !== undefined || 
    updatedProduct.discountPercentage !== undefined || 
    updatedProduct.rating !== undefined || 
    updatedProduct.stock !== undefined || 
    updatedProduct.tags || 
    updatedProduct.brand || 
    updatedProduct.sku || 
    updatedProduct.weight !== undefined || 
    updatedProduct.dimensions || 
    updatedProduct.warrantyInformation || 
    updatedProduct.shippingInformation || 
    updatedProduct.availabilityStatus || 
    updatedProduct.reviews || 
    updatedProduct.returnPolicy || 
    updatedProduct.minimumOrderQuantity !== undefined || 
    updatedProduct.meta || 
    updatedProduct.images || 
    updatedProduct.thumbnail;
}
const UpdateItem = async (req, res) => {
    const { id } = req.params;
    const updatedProduct = req.body;

    try {
        const products = await fsReadFile(fileProducts);
        const productIndex = products.findIndex(item => item.id === id);
        if (productIndex === -1) {
            return res.status(404).json({ error: 'Product not found' });
        }

        const currentProduct = products[productIndex];

        const hasUpdates = CheckUpDate(updatedProduct)
           
        if (!hasUpdates) {
            return res.json(currentProduct);
        }
        if (!checkTheItem(updatedProduct)) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        products[productIndex] = { ...currentProduct, ...updatedProduct };
        await fsWriteFile(fileProducts, products);
        res.json(products[productIndex]);
    } catch (error) {
        res.status(400).json({ error: 'Error updating product' });
    }
};
const AddItem = async (req, res) => {
    const newProduct = req.body;

    const id = uuidv4();
    const productID = { id, ...newProduct };

    if (!checkTheItem(productID)) {
        return res.status(400).json({ message: 'All fields are required' });
    }
        const products = await fsReadFile(fileProducts);
        products.push(productID);
        await fsWriteFile(fileProducts, products);
        res.json(productID);
}

const CheckItemByID = async (req, res) => {
    const { id } = req.params;

        const products = await fsReadFile(fileProducts);
        const product = products.find(item => item.id == id);
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ error: 'Product not found' });
        }
}
const checkItems = async (req, res) => {
    try {
        const products = await fsReadFile(fileProducts);
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(404).json({ error: 'Error reading the file' });
    }
}
const DeleteItem = async (req, res) => {
    const { id } = req.params;


        let products = [];
        products = await fsReadFile(fileProducts);
        if (products === null) {
            return res.status(404).json({ message: 'Products.json is missing or empty' });
        }
        const index = products.findIndex(item => item.id === id);
        if (index === -1) {
            return res.status(404).json({ error: 'Product not found' });
        }
        const removedProduct = products.splice(index, 1);

        let archivedProducts = [];
       
        archivedProducts = await fsReadFile(fileArchive);
        archivedProducts.push(removedProduct);
            await fsWriteFile(fileProducts, products);
            await fsWriteFile(fileArchive, archivedProducts);
        res.json({ message: `Product with ID ${id} deleted and archived` });

};

module.exports = { Welcome, UpdateItem, AddItem, CheckItemByID ,checkItems,DeleteItem,fsWriteFile,fsReadFile};
