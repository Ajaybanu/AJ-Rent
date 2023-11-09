
const db = require("../config/server")
const { Users } = require("../model/user_Schema")
const { Category } = require("../model/category_Schema")
const { Products } = require('../model/product_Shema')
const bcrypt = require('bcrypt')
const { Coupon } = require("../model/coupon_Schema")
const { Order } = require('../model/order_Schema')
const mongoose = require("mongoose")
const { sum } = require("lodash")
const Razorpay = require('razorpay')
const { v4: uuidv4 } = require('uuid');
var instance = new Razorpay({
    key_id:'rzp_test_kbvBZsVLBZtPhJ',
  key_secret: '3fchbYPikODmu8IAVVAdTD5u',
})
const crypto = require('crypto');
const { error } = require("console")



const validatePasswordStrength = (password) => {
    // Define your custom password strength rules here
    // For example, you can check for minimum length, presence of special characters, etc.

    const minLength = 8;
    const hasSpecialCharacter = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasDigit = /[0-9]/.test(password);

    if (password.length < minLength) {
        return 'Password must be at least 8 characters long.';
    }

    if (!hasSpecialCharacter) {
        return 'Password must contain at least one special character.';
    }

    if (!hasUpperCase) {
        return 'Password must contain at least one uppercase letter.';
    }

    if (!hasLowerCase) {
        return 'Password must contain at least one lowercase letter.';
    }

    if (!hasDigit) {
        return 'Password must contain at least one digit.';
    }

    return null; // Password meets all criteria
};


// home page
const homePage = async (req, res) => {
    try {
        let item = await Products.find().sort({ dateCreated: -1 })
        let items = await Products.find()
        let categories = await Category.find()
        let user = await Users.findById(req.session.user_id)
        req.session.user = user
        console.log(req.session);
        res.render("userHome", { items, item, user, categories: categories, layout: "partials/mainlayout" })
    }
    catch {
        res.status(500).send()
    }
}

// user login and signup
const userLogin = (req, res) => {
    res.render("userLogin", { layout: "partials/loginlayout" })
}
const userSignup = async (req, res, next) => {
    try {
        console.log(req.body);
        const { name, email, password, mobile } = req.body

        await Users.findOne({ email: email }).then((data) => {
            if (data) {
                req.flash('error', 'email already registered');
            } else {
                const passwordError = validatePasswordStrength(password);
                if (passwordError) {
                    req.flash('error', passwordError);
                } else {
                    // ...
                    const user = new Users({
                        name: name,
                        email: email,
                        mobile: mobile,
                        password: password
                    });
                    user.save()
                    req.flash('success', 'registration completed successfully');
                }
            }
            res.redirect('/login'); // Redirect to signup page
        });
    }
    catch (err) {
        next(err);
    }
}


const postSignIn = async (req, res) => {
    try {
        console.log(req.body);
        let Email = req.body.email;
        let PASS = req.body.password;
        const user = await Users.findOne({ email: Email })
        if (!user) {
            req.flash('error', "please enter your registered email");

            res.redirect('/login')
        }
        if (user) {
            console.log(user);
            let data = await bcrypt.compare(PASS, user.password);
            console.log(data);
            if (data) {
                req.session.userLogged = true;
                req.session.user_id = user._id;
                req.session.cart = user.cart;
                req.session.name = user.name;
                res.redirect('/');
            }
            else {
                req.flash('error', "please enter valid password");
                res.redirect('/login')
            }
        }
    }
    catch {
        res.status(500).send()
    }
}


//products
const productDetails = async (req, res, next) => {
    try {
        console.log(req.params);
        let id = req.params.id;
        await Products.findOne({ _id: id }).then(data => res.render('product', { data, layout: "partials/mainlayout" }))
    }
    catch (err) {
        next(err);
    }
}
let getSearch = async (req, res) => {
    const query = req.query.name;
    console.log(query);

    let regExp = new RegExp(`${query}`, 'i')
    let product = await Products.findOne({ name: { $regex: regExp } });

    if (product) {
        await Products.findOne({ name: { $regex: regExp } })
            .then(cat => {
                console.log(cat);

                res.render('searchPage', { cat, layout: "partials/mainlayout" });
            })
    }
    else if (!product) {
        await Category.find({ name: { $regex: regExp } })
            .then(data => {
                console.log(data);

                res.render('searchPage', { data, layout: "partials/mainlayout" });
            })

    }

    else {
        res.send('tools not found')
    }


}
const viewProducts = async (req, res) => {
    await Products.find().then(data => {
        res.render("wholeProducts", { layout: "partials/mainlayout", data })
    })
}


//category
const getCategory = async (req, res) => {

    try {

        let id = req.params.id;

        console.log(id);
        const items = await Products.find({ category: id })
        const category = await Category.findById(id)
        console.log(items)
        res.render("viewProducts", { items, layout: '/partials/mainlayout', category });

    }
    catch (err) {
        console.log(err);
    }
}
const getAllCategory = async (req, res) => {
    try {
        const category = await Category.find()
        res.render("viewCategory", { layout: '/partials/mainlayout', category });
    } catch (error) {
        console.log(error);
    }
}
//other pages
const contactPage = (req, res) => {
    res.render("contact", { layout: "partials/mainlayout" })
}
const aboutPage = (req, res) => {
    res.render("about", { layout: "partials/mainlayout" })
}
const faqPage = (req, res) => {
    res.render("faq", { layout: "partials/mainlayout" })
}

//manage profile
const profilePage = async (req, res) => {
    const user_id = req.session.user_id;
    try {
        await Users.findById(user_id).then(data => {
            res.render("userProfile", { data, layout: "partials/mainlayout" })
        })
    }
    catch (err) {
        console.log(err);
    }

}
const UpdateProfile = async (req, res) => {
    try {
        const Id = req.session.user_id
        const name = req.body.name
        const email = req.body.email
        const mobile = req.body.mobile
        const password = req.body.password

        const updateUser = await Users.findByIdAndUpdate({ _id: Id }, { $set: { name: name, email: email, mobile: mobile, password: password } })

        if (updateUser) {

            res.redirect("/profile")
        }

    } catch (error) {
        console.log(error.message);
    }
}


//manage cart
const cartPage = async (req, res) => {
    // retrieve the caart array from the userSchema for the current user
    const currentUser = await Users.findById(req.session.user_id).populate('cart');
    console.log(req.session);
    const cartProducts = currentUser.cart;
    // fetch the product details for each product id in the CArtarray
    const Cart = [];
    for (let i = 0; i < cartProducts.length; i++) {
        const product = await Products.findById(cartProducts[i].product);
        Cart.push(product);
    }
    console.log(Cart);
    let coupdata = await Coupon.find()
    // pass the array of product details to the wishlist.hbs page
    res.render("userCart", { layout: "partials/mainlayout", Cart, coupdata, cartProducts })
};
const addToCart = async (req, res) => {
    const productId = req.params.id;

    console.log(req.params);
    try {
        const user_id = req.session.user_id;
        if (!user_id) {
            // If the user is not logged in, return an error
            return res.status(401).send('Unauthorized');
        }

        const productExist = await Products.findOne({ _id: productId })
        console.log(productExist);
        // Create a new cart item
        let product = productExist.id
        let price = productExist.price
        let name = productExist.name;
        let quantity = req.body.quantity;
        let daysOfRent = req.body.daysofrent;
        if (productExist) {
            let object = {
                product: product,
                price: price,
                quantity: quantity,
                daysOfRent: daysOfRent,
                productName: name,
                total: price * quantity * daysOfRent
            }
            let isproductexist = await Users.findOne({ _id: user_id, "cart.product": product })
            if (!isproductexist) {


                let updateCart = await Users.updateOne({ _id: user_id }, { $push: { cart: object } }).then(result => console.log(result));
                console.log(updateCart)

                if (!req.session.cart) {
                    req.session.cart = [];
                }
                req.session.cart.push({ price: price, quantity: quantity, product: product });
                req.session.cartCount = (req.session.cartCount || 0) + 1;
                console.log(req.session.cart);
                res.redirect('/Cart')
            }

            //   else if(productExist){
            //     let user = await Users.findOne({user:user_id,"cart.product":product},{"cart": 1,_id:0})
            //      let productData= user.cart.filter(val=>val.product==product)
            //     let actualQuantity = +productData[0].quantity+ +quantity
            //      if(actualQuantity<=product.quantity){

            //     let cartUpdate =await Users.updateOne({user:user_id,"cart.product":product},{$inc:{"items.$.quantity": quantity,"items.$.totalPrice":price}})
            //     .then(val=>{
            //     console.log(val);
            //     res.redirect('/')
            //      })

            // }}

            // else if (isproductexist){
            //     let cart = isproductexist.cart
            //         cart.quantity++;
            //         cart.price = cart.quantity * cart.price;

            // }
            else {
                res.redirect('/Cart')
            }
        }
    }
    catch (err) { console.log(err); }

}
const cartUpdate = async (req, res, next) => {
    try {
        let userId = req.session.user_id
        await Products.findById(req.params.id, { quantity: 1, _id: -1, shopPrice: 1 }).then(product => {
            let { quantity } = product
            let count = req.body.count
            let price = product.price;
            let totalsing = price * count
            if (count <= quantity) {
                Users.updateOne({ _id: userId, 'cart._id': req.body.cartid }, { $set: { 'cart.$.quantity': count, 'cart.$.total': totalsing } }).then(() => {
                    subTotal(userId).then(async (total) => res.json({ response: true, total: total }))
                })
            }
            else {
                totalsing = price * quantity
                Users.updateOne({ _id: userId, 'cart._id': req.body.cartid }, { $set: { 'cart.$.quantity': quantity, 'cart.$.total': totalsing } }).then(() => {
                    res.json({ response: false })
                })

            }
        })
    } catch (error) {
        next(error)
    }
}
const cartDelete = (req, res, next) => {
    try {
        let userId = req.session.user_id
        Users.findByIdAndUpdate(userId, { $pull: { cart: { product: req.params.id } } }).then(() => {

            res.redirect('/Cart')
        })
    } catch (error) {
        next(error)
    }
}

// manage wishlist
const wishlistCount = async (req, res) => {
    console.log(req.body);
    const itemID = req.body.itemID;
    const userID = req.session.user_id; // In this example we will hardcode the userID
    let user = await Users.findById(userID)
    let product = await Products.findById(itemID)
    if (!user) {
        // User not found
        return res.status(404).send();
    }
    const index = user.wishList.indexOf(itemID);
    const wish = product.wishList.indexOf(userID);
    if (index === -1 || wish === -1) {

        user.wishList.push(itemID);
        product.wishList.push(userID);
        await user.save();
        await product.save();
        res.status(200).send({ message: 'Product added to wishlist.' });
    } else {
        user.wishList.splice(index, 1);
        product.wishList.splice(wish, 1)
        await user.save();
        await product.save();
        res.status(200).send({ message: 'Product removed from wishlist.' });
    }

}
const deleteWishlist = async (req, res, next) => {
    try {
        let userId = req.session.user_id
        await Users.findByIdAndUpdate(userId, { $pull: { wishList: req.params.id } }).then(() => {

            res.redirect('/wishlist')
        })

    }


    catch (error) {
        next(error)
    }
}
const wish = async (req, res) => {
    // retrieve the wishlist array from the userSchema for the current user
    const currentUser = await Users.findById(req.session.user_id).populate('wishList');
    const wishlistProducts = currentUser.wishList;

    // fetch the product details for each product id in the wishlist array
    const products = [];
    for (let i = 0; i < wishlistProducts.length; i++) {
        const product = await Products.findById(wishlistProducts[i]);
        products.push(product);
    }
    console.log(products);

    // pass the array of product details to the wishlist.hbs page
    res.render('userWishlist', { products, layout: "partials/mainlayout" });
};



//check out functions
const checkoutPage = async (req, res) => {
    let coupon = req.body.couponcode;
    let totalPrice = req.body.totalPrice;
    let user_id = req.session.user_id


    let couponData = await Coupon.findOne({ couponCode: coupon })
    if (couponData) {

        const user = await Users.findOne({ _id: user_id })
        const address = user.address[0];
        const grandTotal = (couponData.percentDiscount * totalPrice) / 100;
        await Coupon.find().then(coupons => {
            res.render("userCheckout", { layout: "partials/mainlayout", couponData, grandTotal, cartDetails: user.cart, coupons, totalPrice, address })
        })
    }
    else {
        const user = await Users.findOne({ _id: user_id })
        const address = user.address[0];
        const grandTotal = totalPrice
        await Coupon.find().then(coupons => {
            res.render("userCheckout", { layout: "partials/mainlayout", couponData, grandTotal, cartDetails: user.cart, coupons, totalPrice, address })
        })
    }

}
const placeOrder = async (req, res) => {

    let user_id = req.session.user_id
    const delivery = {
        city: req.body.city,
        country: req.body.country,
        state: req.body.state,
        pin: req.body.pincode,
        Address: req.body.address
    }
    const AddressObj = {
        city: req.body.city,
        country: req.body.country,
        phone: req.body.phone,
        state: req.body.state,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        pincode: req.body.pincode,
        Address: req.body.address,
    }
    try {
        let userad = await Users.findByIdAndUpdate(user_id, { $set: { "address": AddressObj } })
        userad.save().then(data => console.log(data))
        let coupon = req.body.couponcode;
        const randomstring = uuidv4().slice(0, 5);

        let coup = await Coupon.findOneAndUpdate({ coupenCode: coupon })
        if (coup) {
            coup.users.push(user_id)
            coup.quantity--
          await  coup.save();
        }
        const user = await Users.findOne({ _id: user_id })
        let Cart = user.cart
        let items = []
        items.push(Cart)
        const totalPrice = user.cart.reduce((total, item) => {
            return total + item.total
        }, 0);
        // Calculate the total amount with discount
        let grandTotal = totalPrice;
        if (coup) {
            const discountAmount = totalPrice * coup.percentDiscount / 100;
            grandTotal -= discountAmount;
        }
        let order = new Order({
            products: items,
            Address: AddressObj,
            status: req.body.status,
            userId: user_id,
            deliveryAddress: delivery,
            couponCode: coup ? coup.couponCode : null,
            payment: req.body.payment,
            subTotalPrice: totalPrice,
            discountPrice: coup ? coup.percentDiscount : null,
            totalPrice: grandTotal,
            orderId: randomstring
        })
        order = order.save().then(async (data) => {
            const orderId = data._id.toString()
            req.session.orderdata = data;
            try {
                if (data.payment === 'COD') {
                    try {
                        const user = await Users.findByIdAndUpdate(user_id);
                        const productsIn = await Products.find();
                        for (const cartItem of user.cart) {
                            for (const product of productsIn) {
                                if (cartItem.product.toString() === product._id.toString()) {
                                    const currentCount = product.countInStock - cartItem.quantity;
                                    console.log(currentCount, "llllllllllllllllll");
                                    await Products.findByIdAndUpdate(product._id, { $set: { countInStock: currentCount } });
                                }
                            }
                        }
                        user.cart = [];
                        user.orders.push(data._id);
                        await user.save();
                        // Set a success flash message
                        req.flash('success', 'Order placed successfully!');
                        // Redirect to a thank-you page
                        res.redirect(`/thank-you?orderId=${data.orderId}`);
                    } catch (error) {
                        console.error(error);
                        res.redirect('/');
                    }
                }

                else {
                    let amount = grandTotal
                    req.session.amount = totalPrice * 100
                    const response = await instance.orders.create({
                        amount: amount * 100,
                        currency: "INR",
                        receipt: orderId,

                    })
                    console.log(response);
                    res.render('checkoutform', {
                        key_id: instance.key_id,
                        orderId: response.id,
                        amount: amount,
                        name: user.name,
                        email: user.email,
                        contactNumber: user.mobile,
                        response: response,
                        layout: "partials/mainlayout"
                    });
                }
            } catch (err) {
                console.log(err);
            }
        })
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
}
let orderSuccessOnline = async (req, res, next) => {
    const order_id = req.body.order_id;
    const payment_id = req.body.payment_id;
    const signature = req.body.signature;
    try {
        const message = order_id + '|' + payment_id;
        const generated_signature = crypto.createHmac('sha256', instance.key_secret)
            .update(message)
            .digest('hex');
        if (generated_signature === signature) {
            const orderid = req.session.orderdata._id
            let object = {
                orderId: order_id,
                paymentId: payment_id
            }
            let order = await Order.findOneAndUpdate({ _id: orderid }, {
                $set: {
                    paymentStatus: "Completed",
                    razorPayDetails: object
                },
            })
            await order.save();
            const userId = req.session.user_id
        
            const user = await Users.findByIdAndUpdate(userId);
            const productsIn = await Products.find();
            for (const cartItem of user.cart) {
                for (const product of productsIn) {
                    if (cartItem.product.toString() === product._id.toString()) {
                        const currentCount = product.countInStock - cartItem.quantity;
                        console.log(currentCount, "llllllllllllllllll");
                        await Products.findByIdAndUpdate(product._id, { $set: { countInStock: currentCount } });
                    }
                }
            }


                user.set({ cart: [] })
                user.orders.push(order._id)
                user.save()
        
            res.json({
                payment: true,
                orderid: req.session.orderdata._id,
            })
        } else {
            res.json({
                payment: false,
                orderid: req.session.orderid
            })
        }
    } catch (error) {
        console.log(error.message)
        next(error)
    }
}
const orderSuccessCOD = async (req, res) => {
    let id = req.query.orderId
    console.log(id);
    let order = await Order.findOne({ orderId: id })
    console.log(order);
    res.render('orderSucccess', {
        order, successFlash: req.flash('success'),
        layout: "partials/mainlayout"
    })

}
const paymentVerified = async (req, res) => {
    let id = req.params.id
    console.log("hello");
    let order = await Order.findById(id).populate('products.Object').exec()
    res.render('orderSucccess', {
        order,
        layout: "partials/mainlayout"
    })

}

//manage orders
const deleteOrder = async (req, res) => {
    await Order.findByIdAndUpdate(req.params.id).then(async order => {
        if (order) {

            order.set({ orderStatus: "cancelled" })
            order.save();
            console.log(order);
            res.redirect('/')
            // return res.status(200).json({ success: true, message: 'the order is deleted!' })
        } else {
            return res.status(404).json({ success: false, message: "order not found!" })
        }
    }).catch(err => {
        return res.status(500).json({ success: false, error: err })
    })
}
const getOrderCount = async (req, res) => {
    const orderCount = await Order.countDocuments((count) => count)

    if (!orderCount) {
        res.status(500).json({ success: false })
    }
    res.send({
        orderCount: orderCount
    });
}
// const getOrders = async (req, res) => {
//     let userId = req.session.user_id

//     const currentUser = await Users.findById(userId)
//     const orders = currentUser.orders;

//     // fetch the product details for each product id in the wishlist array
//     const allOrders = [];
//     for (let i = 0; i < orders.length; i++) {
//         const order = await Order.findById(orders[i]).exec();
//         allOrders.push(order);
//     }
//     console.log(allOrders);



//     res.render("orderPage", { layout: "partials/mainlayout", allOrders, user: currentUser });
// }

const getOrders = async (req, res, next) => {
    try {
        let userId = req.session.user_id;
        const currentUser = await Users.findById(userId);
        const orders = currentUser.orders;

        const orderPromises = orders.map(orderId => Order.findById(orderId).exec());
        const allOrders = await Promise.all(orderPromises);

        console.log(allOrders);

        res.render("orderPage", { layout: "partials/mainlayout", allOrders, user: currentUser });
    } catch (error) {
        console.error(error);
        next(error)
        // Handle the error (e.g., display an error page or send an error response)
    }
}

// user logout
const userLogout = (req, res) => {
    req.session.destroy(err => {
        if (err) throw err;
        res.redirect('/')
    })
}


module.exports = {
    userLogin,
    contactPage,
    aboutPage,
    homePage,
    profilePage,
    UpdateProfile,
    wishlistCount,
    cartPage,
    checkoutPage,
    faqPage,
    viewProducts,
    userSignup,
    postSignIn,
    userLogout,
    addToCart,
    getSearch,
    getCategory,
    productDetails,
    deleteWishlist,
    wish,
    cartDelete,
    cartUpdate,
    placeOrder,
    getOrderCount,
    getOrders,
    deleteOrder,
    orderSuccessCOD,
    orderSuccessOnline,
    getAllCategory,
    paymentVerified
}