const database = require("../config/server");
const { User } = require("../model/userdb");
const bcrypt = require("bcrypt");
const { Products } = require("../model/productdb")
const { Category } = require("../model/category")

const login = (req, res) => {
  res.render("userlogin",{ layout: "partials/layout"} )
}


const signup = (req, res) => {
  res.render("usersignup", { layout: "partials/layout" })
}

const postsignup = async (req, res, next) => {
  try {
    console.log(req.body);
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      address: req.body.address,
      number: req.body.number,
      password: req.body.password,
    });
    user.save().then(result => {
      console.log(result);
      res.redirect('/login');
    })
  }
  catch (err) {
    next(err);
  }
}

const postlogin = async (req, res) => {
  try {
    console.log(req.body);
    const email = req.body.email;
    const password = req.body.password;
    const userData = await User.findOne({ email: email })
   
    if(!userData){
      res.send('not user')
    }
       
     else{

        const data = await bcrypt.compare(password, userData.password);
     
if(!data){
  res.send('not user')
}
    else {
            console.log(data);

            req.session.userLogged = data;
            req.session.user_id = userData._id;

            // Redirect to home page
            res.redirect('/');
        } 
      }
  } catch (error) {
    console.log(error.message);
  }
};


  
const home = async (req, res) => {

  await Category.findOne({ name: "ACCESSORIES" }).then(data => {
    Category.findOne({ name: "TOYS" }).then(toy => {
      Category.findOne({ name: "FOOD" }).then(food => {
        Category.findOne({ name: "CLOTHES" }).then(clothe => {
          res.render("home", { layout: "partials/layout", data, toy, food, clothe });
        })


      })

    })
  })



};

const dp = async (req, res) => {
  try {
    let id = req.params.id;
    console.log(id);
    const product_list = await Products.find({ category: id })
    const categor = await Category.findOne({ _id: id })

    console.log(product_list)
    res.render("dog-catagory", { product_list, categor, layout: "partials/layout" });

  }
  catch (err) {
    console.log(err);
  }
}

const toypage = async (req, res) => {
  try {
    let id = req.params.id;
    console.log(id);
    const toylist = await Products.find({ category: id })
    const categor = await Category.findOne({ _id: id })
    console.log(toylist)
    res.render("toy-page", { toylist, categor, layout: "partials/layout" });
  }
  catch (err) {
    console.log(err);
  }
}






const usercart = async (req, res) => {
  console.log(req.params);
  try {
    const user_id = req.session.user_id;
    if (!user_id) {
      return res.status(401).send('Unauthorized');
    }

    let productExist = await Dog.findById(req.params.id)



    let price = productExist.price
    let productId = productExist.id
    let image = productExist.image

    let object = {
      product: productId,
      price: price,
      image: image


    }

    if (productExist) {

      let updateCart = await User.findOne({ _id: user_id })
      console.log(updateCart)
      updateCart.cart.push(object);
      await updateCart.save();
      res.redirect('/')
    }
    else {
      res.send('product already added to cart')

    }
  }
  catch (err) { console.log(err); }
}

const addToCart = (req, res) => {
  res.render("usercart", { layout: "partials/layout" })
}








// Step 1: Define the cart schema
// const mongoose = require('mongoose');

// const cartSchema = new mongoose.Schema({
//   items: [{
//     name: String,
//     price: Number,
//     quantity: Number
//   }],
//   total: Number
// });

// const Cart = mongoose.model('Cart', cartSchema);

// // Step 2: Create an endpoint for selecting a cart
// app.get('/carts/:id', async (req, res) => {
//   const { id } = req.params;
//   const cart = await originalCollection.findById(id);
//   if (cart) {
//     // Step 3: Save the selected cart to the new schema
//     const newCart = new Cart({
//       items: cart.items,
//       total: cart.total
//     });
//     await newCart.save();
//     res.json(newCart);
//   } else {
//     res.status(404).send('Cart not found');
//   }
// });

// // Step 4: Create an endpoint for retrieving the selected cart
// app.get('/selected-cart/:id', async (req, res) => {
//   const { id } = req.params;
//   const selectedCart = await Cart.findById(id);
//   if (selectedCart) {
//     res.json(selectedCart);
//   } else {
//     res.status(404).send('Selected cart not found');
//   }
// });


const postwishlist = async (req, res) => {
  console.log(req.body);
  const itemID = req.body.itemID;
  const userID = req.session.user_id; // In this example we will hardcode the userID
  let user = await User.findById(userID)

  if (!user) {
    // User not found
    return res.status(404).send();
  }
  const index = user.wishlist.indexOf(itemID);
  if (index === -1) {
    user.wishlist.push(itemID);
    await user.save();
    res.status(200).send({ message: 'Product added to wishlist.' });
  } else {
    user.wishlist.splice(index, 1);
    await user.save();
    res.status(200).send({ message: 'Product removed from wishlist.' });
  }
}



const wishlist = async (req, res) => {
    // retrieve the wishlist array from the userSchema for the current user
    const currentUser = await User.findById(req.session.user_id).populate('wishlist');
    const wishlistProducts = currentUser.wishlist;

    // fetch the product details for each product id in the wishlist array
    const products = [];
    for (let i = 0; i < wishlistProducts.length; i++) {
        const product = await Products.findById(wishlistProducts[i]);
      products.push(product);
// 
    }
    console.log(products);

    // pass the array of product details to the wishlist.hbs page
    res.render("userwishlist", { layout: "partials/layout",products })
};


const deletewishlist = async (req, res, next) => {
  try {
      let userId = req.session.user_id
      await User.findByIdAndUpdate(userId, { $pull: { wishlist: req.params.id  } }).then(() => {

          res.redirect('/userwishlist')
      })

  }


  catch (error) {
      next(error)
  }
}

  











module.exports = {

  home,
  dp,
  login,

  signup,
  postsignup,
  postlogin,
  usercart,
  toypage,


  addToCart,
  wishlist,

  postwishlist,
  deletewishlist,


}
