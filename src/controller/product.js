const Product = require('../models/product');
const shortid = require('shortid');
const slugify = require('slugify');
const Category = require('../models/category');
const SmartPhone = require('../models/smartphone');
const Clothing = require('../models/clothing');
const Televison = require('../models/televison');
const Laptop = require('../models/laptop');
const Furniture = require('../models/furniture');
const Book = require('../models/book');

exports.createProduct = (req, res) => {
 
    // res.status(200).json({ file: req.files, body: req.body });
    const { name, price, description, category, quantity, type, offer } = req.body;

    let productPictures = [];

    if(req.files.length > 0){
        productPictures = req.files.map(file => {
            return { img: file.filename }
        });
    }
    console.log({productPictures});
    const product = new Product({
        name: name,
        slug: slugify(name),
        price,
        offer,
        quantity,
        description,
        type,
        productPictures,
        category,
        createdBy: req.user._id
    });

    product.save(((error, product) => {
        if(error) return res.status(400).json({ error });
        if(product){
            res.status(201).json({ product });
        }
    }));

};

async function getProductVariants (type, products) {
    let productVariants = [];
    switch(type){
        case 'smartPhone':
            for (const product of products) {
                // const element = array[index];
                const p = await SmartPhone.find({ product: product._id }).exec();
                productVariants.push(p)              
            }
            break;
        case 'clothing':
            for (const product of products) {
                // const element = array[index];
                const p = await Clothing.find({ product: product._id }).exec();
                productVariants.push(p)              
            }
            break;
        case 'laptop':
            for (const product of products) {
                // const element = array[index];
                const p = await Laptop.find({ product: product._id }).exec();
                productVariants.push(p)              
            }
            break;
        case 'television':
            for (const product of products) {
                // const element = array[index];
                const p = await Televison.find({ product: product._id }).exec();
                productVariants.push(p)              
            }
            break;
        case 'furniture':
            for (const product of products) {
                // const element = array[index];
                const p = await Furniture.find({ product: product._id }).exec();
                productVariants.push(p)              
            }
            break;
        case 'book':
            for (const product of products) {
                // const element = array[index];
                const p = await Book.find({ product: product._id }).exec();
                productVariants.push(p)              
            }
            break;
    }
    // console.log({productVariants});
    return productVariants;
}

exports.getProductsBySlug = (req, res) => {
    const { slug } = req.params;
    Category.findOne({ slug: slug })
    .select('_id type')
    .exec((error, category) => {
        if(error){
            return res.status(400).json({ error });
        }

        if(category){
            Product.find({ category: category._id })
            .exec( async (error, products) => {

                if(error){
                    return res.status(400).json({error});
                }

                if(category.type){
                    if(products.length > 0){
                        let productVariants = [];

                        productVariants = await getProductVariants(products[0].type, products);
                        console.log({productVariants});
                        res.status(200).json({ 
                            products,
                            variants: productVariants,
                            priceRange: {
                                under5mil: 5000000,
                                under10mil: 10000000,
                                under15mil: 15000000,
                                under20mil: 20000000,
                                under30mil: 30000000,
                            },
                            productsByPrice: {
                                under5mil: products.filter(product => product.price <= 5000000),
                                under10mil: products.filter(product => product.price > 5000000 && product.price <= 10000000),
                                under15mil: products.filter(product => product.price > 10000000 && product.price <= 15000000),
                                under20mil: products.filter(product => product.price > 15000000 && product.price <= 20000000),
                                under30mil: products.filter(product => product.price > 20000000 && product.price <= 30000000),
                            }
                        });
                    }
                }else{
                    let productVariants = [];

                    productVariants = await getProductVariants(products[0].type, products);
                    res.status(200).json({ products, variants: productVariants });
                }
            });
        }
    });
    // res.status(200).json({ slug });
}

exports.getProductDetailsById = (req, res) => {
    const { productId, type } = req.params;
    if(productId){
        switch(type){
            case 'smartPhone':
                Product.findOne({ _id: productId })
                .exec((error, product) => {
                    if(error) return res.status(400).json({ error });
                    if(product){
                        // console.log(product);
                        SmartPhone.find({ product: productId })
                        .exec((err, smartPhone) => {
                            if(err) return res.status(400).json({ err });
                            if(smartPhone){
                                product.children = smartPhone;
                                const prod = product;
                                prod["children"] = smartPhone;
                                console.log(prod);
                                res.status(200).json({ product, children: smartPhone });
                            }
                        })
                    }
                });
                break;
            case 'clothing':
                Product.findOne({ _id: productId })
                .exec((error, product) => {
                    if(error) return res.status(400).json({ error });
                    if(product){
                        Clothing.find({ product: productId })
                        .exec((err, clothing) => {
                            if(err) return res.status(400).json({ err });
                            if(clothing){
                                product.children = clothing;
                                const prod = product;
                                prod["children"] = clothing;
                                res.status(200).json({ product, children: clothing });
                            }
                        })
                    }
                });
                break;
            case 'laptop':
                Product.findOne({ _id: productId })
                .exec((error, product) => {
                    if(error) return res.status(400).json({ error });
                    if(product){
                        Laptop.find({ product: productId })
                        .exec((err, clothing) => {
                            if(err) return res.status(400).json({ err });
                            if(clothing){
                                product.children = clothing;
                                const prod = product;
                                prod["children"] = clothing;
                                res.status(200).json({ product, children: clothing });
                            }
                        })
                    }
                });
                break;
            case 'television':
                Product.findOne({ _id: productId })
                .exec((error, product) => {
                    if(error) return res.status(400).json({ error });
                    if(product){
                        Televison.find({ product: productId })
                        .exec((err, clothing) => {
                            if(err) return res.status(400).json({ err });
                            if(clothing){
                                product.children = clothing;
                                const prod = product;
                                prod["children"] = clothing;
                                res.status(200).json({ product, children: clothing });
                            }
                        })
                    }
                });
                break;
            case 'furniture':
                Product.findOne({ _id: productId })
                .exec((error, product) => {
                    if(error) return res.status(400).json({ error });
                    if(product){
                        Furniture.find({ product: productId })
                        .exec((err, clothing) => {
                            if(err) return res.status(400).json({ err });
                            if(clothing){
                                product.children = clothing;
                                const prod = product;
                                prod["children"] = clothing;
                                res.status(200).json({ product, children: clothing });
                            }
                        })
                    }
                });
                break;
            case 'book':
            Product.findOne({ _id: productId })
            .exec((error, product) => {
                if(error) return res.status(400).json({ error });
                if(product){
                    Book.find({ product: productId })
                    .exec((err, clothing) => {
                        if(err) return res.status(400).json({ err });
                        if(clothing){
                            product.children = clothing;
                            const prod = product;
                            prod["children"] = clothing;
                            res.status(200).json({ product, children: clothing });
                        }
                    })
                }
            });
            break;
            default:
                Product.findOne({ _id: productId })
                .exec((error, product) => {
                    if(error) return res.status(400).json({ error });
                    if(product){
                        res.status(200).json({ product, children: [] });
                    }
                });
        }
    }else{
        return res.status(400).json({ error: 'Params required' });
    }  
}

exports.deleteProductById = (req, res) => {
    console.log(req.body);
    const { productId } = req.body.payload;
    if(productId){
        Product.deleteOne({ _id: productId }).exec((error, result) => {
            if(error) return res.status(400).json({ error });
            if(result){
                res.status(202).json({ result });
            }
        });
    }else{
        res.status(400).json({ error: "Params required" })
    }
};

exports.deleteSmartPhoneProductById = (req, res) => {
    const { productId, quantity, product } = req.body.payload;
    if(productId){
        SmartPhone.deleteOne({ _id: productId }).exec((error, result) => {
            if(error) return res.status(400).json({ error });
            if(result){
                res.status(202).json({ result });
            }
        });
        Product.updateOne(
            { _id: product },
            {
                $inc: {
                    quantity: -quantity
                }
            }
        ).exec();
    }else{
        res.status(400).json({ error: "Params required" })
    }
};

exports.deleteClothingProductById = (req, res) => {
    const { productId, quantity, product } = req.body.payload;
    if(productId){
        Clothing.deleteOne({ _id: productId }).exec((error, result) => {
            if(error) return res.status(400).json({ error });
            if(result){
                res.status(202).json({ result });
            }
        });
        Product.updateOne(
            { _id: product },
            {
                $inc: {
                    quantity: -quantity
                }
            }
        ).exec();
    }else{
        res.status(400).json({ error: "Params required" })
    }
};

exports.deleteTelevisionProductById = (req, res) => {
    const { productId, quantity, product } = req.body.payload;
    if(productId){
        Televison.deleteOne({ _id: productId }).exec((error, result) => {
            if(error) return res.status(400).json({ error });
            if(result){
                res.status(202).json({ result });
            }
        });
        Product.updateOne(
            { _id: product },
            {
                $inc: {
                    quantity: -quantity
                }
            }
        ).exec();
    }else{
        res.status(400).json({ error: "Params required" })
    }
};

exports.deleteLaptopProductById = (req, res) => {
    const { productId, quantity, product } = req.body.payload;
    if(productId){
        Laptop.deleteOne({ _id: productId }).exec((error, result) => {
            if(error) return res.status(400).json({ error });
            if(result){
                res.status(202).json({ result });
            }
        });
        Product.updateOne(
            { _id: product },
            {
                $inc: {
                    quantity: -quantity
                }
            }
        ).exec();
    }else{
        res.status(400).json({ error: "Params required" })
    }
};

exports.deleteFurnitureProductById = (req, res) => {
    const { productId, quantity, product } = req.body.payload;
    if(productId){
        Furniture.deleteOne({ _id: productId }).exec((error, result) => {
            if(error) return res.status(400).json({ error });
            if(result){
                res.status(202).json({ result });
            }
        });
        Product.updateOne(
            { _id: product },
            {
                $inc: {
                    quantity: -quantity
                }
            }
        ).exec();
    }else{
        res.status(400).json({ error: "Params required" })
    }
};

exports.deleteBookProductById = (req, res) => {
    const { productId, quantity, product } = req.body.payload;
    if(productId){
        Book.deleteOne({ _id: productId }).exec((error, result) => {
            if(error) return res.status(400).json({ error });
            if(result){
                res.status(202).json({ result });
            }
        });
        Product.updateOne(
            { _id: product },
            {
                $inc: {
                    quantity: -quantity
                }
            }
        ).exec();
    }else{
        res.status(400).json({ error: "Params required" })
    }
};

exports.getProducts = async (req, res) => {
    const products = await Product.find({ })
        .select("_id name price offer quantity slug description productPictures createdBy")
        .populate({ path: "category", select: "_id name" })
        .exec();

    res.status(200).json({ products });
};

exports.updateProducts = async (req, res) => {
    const { _id, name, price, offer, quantity, description, category, productPictures } = req.body;
    console.log(productPictures);
    let _productPictures = []; 
    let _oldProductPictures = [];
    let array = productPictures.split(",");
    console.log({ array });
    if(array.length > 0 && !array.includes('')){
        _oldProductPictures = array.map(file => {
            return { img: file }
        })
    }
    // _productPictures.push(productPictures);
    console.log(_oldProductPictures);
    // if(productPictures.length > 0){
    //     // console.log(name, price);
    //     _productPictures = productPictures.map(file => {
    //         return { img: file.img }
    //     })
    // }

    if(req.files.length > 0){
        _productPictures = req.files.map(file => {
            return { img: file.filename }
        })
    }
    

    let finalProductPitures = _oldProductPictures.concat(_productPictures);
    
    const _updatedProduct = {
        name,
        price,
        offer,
        quantity,
        description,
        category,
        productPictures: finalProductPitures,
        createdBy: req.user._id
    }
    console.log({_updatedProduct});
    if(_id){
        Product.findOneAndUpdate(
            { _id: _id },
            _updatedProduct,
            { new: true }
        ).exec((error, result) => {
            if(error) return res.status(400).json({ error });
            if(result){
                return res.status(201).json({ updatedProduct: result });
            }
        });
    }else{
        res.status(400).json({ error: "Params required" })
    }
}

exports.updateSmartPhoneProductDetails = async (req, res) => {
    const { 
        _id, 
        quantity, 
        ram, 
        storage, 
        capacity, 
        resolutionType, 
        primaryCamera, 
        secondaryCamera, 
        color, 
        screenSize, 
        product 
    } = req.body;

    
    const productDetails = {
        quantity,
        ram,
        storage,
        capacity,
        resolutionType,
        primaryCamera,
        secondaryCamera,
        color,
        screenSize,
        product,
        createdBy: req.user._id
    }
    
    if(_id){
        const smartPhone = await SmartPhone.findOne({ _id: _id }).exec();
        const oldQuantity = smartPhone.quantity;
        const newQuantity = quantity - oldQuantity;

        SmartPhone.findOneAndUpdate(
            { _id: _id},
            productDetails,
            { new: true }
        ).exec((error, result) => {
            if(error) return res.status(400).json({ error });
            if(result){
                return res.status(201).json({ productDetails: result });
            }
        });
        Product.updateOne(
            { _id: product },
            {
                $inc: {
                    quantity: newQuantity
                }
            }
        ).exec();
    }else{
        const smartPhoneProduct = await Product.findOne({ _id: product }).exec();
        const numberOfVariants = await SmartPhone.find({ product: product }).count().exec();
        const oldQuantity = smartPhoneProduct.quantity;
        const smartPhone = new SmartPhone(productDetails);
        smartPhone.save(((error, productDetail) => {
            if(error) return res.status(400).json({ error });
            if(productDetail){
                res.status(201).json({ productDetail });
            }
        }));
        if(oldQuantity === 0 || numberOfVariants > 0){
            Product.updateOne(
                { _id: product },
                {
                    $inc: {
                        quantity: quantity 
                    }
                }
            ).exec();
        }
    }
}

exports.getSmartPhoneProductDetailsById = (req, res) => {
    const { productId } = req.params;
    if(productId){
        SmartPhone.find({ product: productId })
        .exec((error, product) => {
            if(error) return res.status(400).json({ error });
            if(product){
                res.status(200).json({ product });
            }
        });
    }else{
        return res.status(400).json({ error: 'Params required' });
    }
}

exports.updateClothingProductDetails = async (req, res) => {
    const { 
        _id, 
        quantity, 
        size,
        color,
        fabric,
        product 
    } = req.body;

    
    const productDetails = {
        quantity,
        size,
        color,
        fabric,
        product,
        createdBy: req.user._id
    }
   
    console.log(productDetails);

    if(_id){
        const clothing = await Clothing.findOne({ _id: _id }).exec();
        const oldQuantity = clothing.quantity;
        const newQuantity = quantity - oldQuantity;

        Clothing.findOneAndUpdate(
            { _id: _id},
            productDetails,
            { new: true }
        ).exec((error, result) => {
            if(error) return res.status(400).json({ error });
            if(result){
                return res.status(201).json({ productDetails: result });
            }
        });
        Product.updateOne(
            { _id: product },
            {
                $inc: {
                    quantity: newQuantity
                }
            }
        ).exec();
    }else{
        const clothingProduct = await Product.findOne({ _id: product }).exec();
        const numberOfVariants = await Clothing.find({ product: product }).count().exec();
        const oldQuantity = clothingProduct.quantity;
        const clothing = new Clothing(productDetails);
        clothing.save(((error, productDetail) => {
            if(error) return res.status(400).json({ error });
            if(productDetail){
                res.status(201).json({ productDetail });
            }
        }));
        if(oldQuantity === 0 || numberOfVariants > 0){
            Product.updateOne(
                { _id: product },
                {
                    $inc: {
                        quantity: quantity 
                    }
                }
            ).exec();
        }
    }
}

exports.getClothingProductDetailsById = (req, res) => {
    const { productId } = req.params;
    if(productId){
        Clothing.find({ product: productId })
        .exec((error, product) => {
            if(error) return res.status(400).json({ error });
            if(product){
                res.status(200).json({ product });
            }
        });
    }else{
        return res.status(400).json({ error: 'Params required' });
    }
}

exports.updateTelevisionProductDetails = async (req, res) => {
    const { 
        _id, 
        quantity, 
        resolution,
        screenType,
        operatingSystem,
        screenSize,
        product 
    } = req.body;

    
    const productDetails = {
        quantity,
        resolution,
        screenType,
        operatingSystem,
        screenSize,
        product,
        createdBy: req.user._id
    }

    if(_id){
        const television = await Televison.findOne({ _id: _id }).exec();
        const oldQuantity = television.quantity;
        const newQuantity = quantity - oldQuantity;

        Televison.findOneAndUpdate(
            { _id: _id},
            productDetails,
            { new: true }
        ).exec((error, result) => {
            if(error) return res.status(400).json({ error });
            if(result){
                return res.status(201).json({ productDetails: result });
            }
        });
        Product.updateOne(
            { _id: product },
            {
                $inc: {
                    quantity: newQuantity
                }
            }
        ).exec();
    }else{
        const televisionProduct = await Product.findOne({ _id: product }).exec();
        const numberOfVariants = await Televison.find({ product: product }).count().exec();
        const oldQuantity = televisionProduct.quantity;
        const television = new Televison(productDetails);
        television.save(((error, productDetail) => {
            if(error) return res.status(400).json({ error });
            if(productDetail){
                res.status(201).json({ productDetail });
            }
        }));
        if(oldQuantity === 0 || numberOfVariants > 0){
            Product.updateOne(
                { _id: product },
                {
                    $inc: {
                        quantity: quantity 
                    }
                }
            ).exec();
        }
    }
}

exports.getTelevisionProductDetailsById = (req, res) => {
    const { productId } = req.params;
    if(productId){
        Televison.find({ product: productId })
        .exec((error, product) => {
            if(error) return res.status(400).json({ error });
            if(product){
                res.status(200).json({ product });
            }
        });
    }else{
        return res.status(400).json({ error: 'Params required' });
    }
}

exports.updateLaptopProductDetails = async (req, res) => {
    const { 
        _id, 
        quantity, 
        ram,
        hardDiskCapacity,
        screenResolution,
        operatingSystem,
        processor,
        graphicProcessor,
        weight,
        screenSize,
        product 
    } = req.body;

    
    const productDetails = {
        quantity,
        ram,
        hardDiskCapacity,
        screenResolution,
        operatingSystem,
        processor,
        graphicProcessor,
        weight,
        screenSize,
        product,
        createdBy: req.user._id
    }

    if(_id){
        const laptop = await Laptop.findOne({ _id: _id }).exec();
        const oldQuantity = laptop.quantity;
        const newQuantity = quantity - oldQuantity;

        Laptop.findOneAndUpdate(
            { _id: _id},
            productDetails,
            { new: true }
        ).exec((error, result) => {
            if(error) return res.status(400).json({ error });
            if(result){
                return res.status(201).json({ productDetails: result });
            }
        });
        Product.updateOne(
            { _id: product },
            {
                $inc: {
                    quantity: newQuantity
                }
            }
        ).exec();
    }else{
        const laptopProduct = await Product.findOne({ _id: product }).exec();
        const numberOfVariants = await Laptop.find({ product: product }).count().exec();
        const oldQuantity = laptopProduct.quantity;
        const laptop = new Laptop(productDetails);
        laptop.save(((error, productDetail) => {
            if(error) return res.status(400).json({ error });
            if(productDetail){
                res.status(201).json({ productDetail });
            }
        }));
        if(oldQuantity === 0 || numberOfVariants > 0){
            Product.updateOne(
                { _id: product },
                {
                    $inc: {
                        quantity: quantity 
                    }
                }
            ).exec();
        }
    }
}

exports.getLaptopProductDetailsById = (req, res) => {
    const { productId } = req.params;
    if(productId){
        Laptop.find({ product: productId })
        .exec((error, product) => {
            if(error) return res.status(400).json({ error });
            if(product){
                res.status(200).json({ product });
            }
        });
    }else{
        return res.status(400).json({ error: 'Params required' });
    }
}

exports.updateFurnitureProductDetails = async (req, res) => {
    const { 
        _id, 
        quantity, 
        primaryColor,
        material,
        product 
    } = req.body;

    
    const productDetails = {
        quantity,
        primaryColor,
        material,
        product,
        createdBy: req.user._id
    }

    if(_id){
        const furniture = await Furniture.findOne({ _id: _id }).exec();
        const oldQuantity = furniture.quantity;
        const newQuantity = quantity - oldQuantity;

        Furniture.findOneAndUpdate(
            { _id: _id},
            productDetails,
            { new: true }
        ).exec((error, result) => {
            if(error) return res.status(400).json({ error });
            if(result){
                return res.status(201).json({ productDetails: result });
            }
        });
        Product.updateOne(
            { _id: product },
            {
                $inc: {
                    quantity: newQuantity
                }
            }
        ).exec();
    }else{
        const furnitureProduct = await Product.findOne({ _id: product }).exec();
        const numberOfVariants = await Furniture.find({ product: product }).count().exec();
        const oldQuantity = furnitureProduct.quantity;
        const furniture = new Furniture(productDetails);
        furniture.save(((error, productDetail) => {
            if(error) return res.status(400).json({ error });
            if(productDetail){
                res.status(201).json({ productDetail });
            }
        }));
        if(oldQuantity === 0 || numberOfVariants > 0){
            Product.updateOne(
                { _id: product },
                {
                    $inc: {
                        quantity: quantity 
                    }
                }
            ).exec();
        }
    }
}

exports.getFurnitureProductDetailsById = (req, res) => {
    const { productId } = req.params;
    if(productId){
        Furniture.find({ product: productId })
        .exec((error, product) => {
            if(error) return res.status(400).json({ error });
            if(product){
                res.status(200).json({ product });
            }
        });
    }else{
        return res.status(400).json({ error: 'Params required' });
    }
}

exports.updateBookProductDetails = async (req, res) => {
    const { 
        _id, 
        quantity, 
        author,
        publisher,
        genre,
        product 
    } = req.body;

    
    const productDetails = {
        quantity,
        author,
        publisher,
        genre,
        product,
        createdBy: req.user._id
    }

    if(_id){
        const book = await Book.findOne({ _id: _id }).exec();
        const oldQuantity = book.quantity;
        const newQuantity = quantity - oldQuantity;

        Book.findOneAndUpdate(
            { _id: _id},
            productDetails,
            { new: true }
        ).exec((error, result) => {
            if(error) return res.status(400).json({ error });
            if(result){
                return res.status(201).json({ productDetails: result });
            }
        });
        Product.updateOne(
            { _id: product },
            {
                $inc: {
                    quantity: newQuantity
                }
            }
        ).exec();
    }else{
        const bookProduct = await Product.findOne({ _id: product }).exec();
        const numberOfVariants = await Book.find({ product: product }).count().exec();
        const oldQuantity = bookProduct.quantity;
        const book = new Book(productDetails);
        book.save(((error, productDetail) => {
            if(error) return res.status(400).json({ error });
            if(productDetail){
                res.status(201).json({ productDetail });
            }
        }));
        if(oldQuantity === 0 || numberOfVariants > 0){
            Product.updateOne(
                { _id: product },
                {
                    $inc: {
                        quantity: quantity 
                    }
                }
            ).exec();
        }
    }
}

exports.getBookProductDetailsById = (req, res) => {
    const { productId } = req.params;
    if(productId){
        Book.find({ product: productId })
        .exec((error, product) => {
            if(error) return res.status(400).json({ error });
            if(product){
                res.status(200).json({ product });
            }
        });
    }else{
        return res.status(400).json({ error: 'Params required' });
    }
}

exports.updateRatingProductDetails = (req, res) => {
    const { 
        _id, 
        rating,
        review,
    } = req.body;

    const str = `rating.${rating}`;

    let productPictures = [];

    if(req.files.length > 0){
        productPictures = req.files.map(file => {
            return { img: file.filename }
        });
    }
    console.log({productPictures});

    const reviewPayload = {
        userId: req.user._id,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        review,
        rating,
        productPictures,
        createdAt: new Date
    }

    Product.updateOne(
        { _id: _id },
        { 
            $inc: {
                [str]: 1
            }
        }
    ).exec();

    Product.findOneAndUpdate(
        { _id: _id },
        {
            $push: {
                reviews: reviewPayload,
            },
        },
        { new: true, upsert: true }
    ).exec((error, response) => {
        if(error) return res.status(400).json({ error });
        if(response){
            res.status(201).json({ response });
        }
    });
        
}

exports.searchProduct = (req, res) => {
    Product.find({ $text: { $search: req.body.search}}, { score: { $meta: "textScore" } })
    .sort( { score: { $meta: "textScore" } } )
    .exec((error, response) => {
        if(error) return res.status(400).json({ error });
        if(response){
            res.status(201).json({ response });
        }
    })
}

exports.getMostOfferProducts = (req, res) => {
    Product.find().sort( { offer:-1 }).limit(6)
    .exec((error, response) => {
        if(error) return res.status(400).json({ error });
        if(response){
            res.status(201).json({ response });
        }
    })
}