const database = require("../config/server");
const { User } =require("../model/userdb");
const bcrypt = require("bcrypt");
const { Products } = require("../model/productdb")
const { Category } = require("../model/category")

const async = require("hbs/lib/async");




const signup = (req,res)=>{
    res.render("usersignup",{layout:"partials/layout"})
}

const postsignup= async(req,res,next)=>{
try{
    console.log(req.body);
    const user = new User({
        name:req.body.name,
        email:req.body.email,
        address:req.body.address,
        number:req.body.number,
        password:req.body.password,
    });
    user.save().then(result=>{
        console.log(result);
        res.redirect('/login');
    })
}
catch(err){
    next(err);
}
}

 const postlogin = async (req,res)=>{
    try{
        // console.log(req.body);
        const user = await User.findOne({email:req.body.email})
        if(user){
            // console.log(user)
            let data = await bcrypt.compare(req.body.password,user.password)
            // console.log(data)
            if(data) {
                req.session.userLogged = true;
                req.session.user_id = user._id
                console.log('sdfasdf')
                res.redirect("/")
            } else{
                req.session.userLogged = false;
                console.log('blaaah');
                res.send("notpassword")
            }
           
        }

    }
    catch{
        res.send("NOT ALLOWED")
    }
}
const home =async(req,res)=>{
  let categoies = await Category.find()
   
        
  res.render("home",{layout:"partials/layout",categoies});
};
const login = (req,res)=>{
        res.render("userlogin",{layout:"partials/layout"})
}
const dp = async(req,res)=>{
  try {
    let id = req.params.id;
    console.log(id);
    const product_list = await Products.find({ category: id })
    const categor = await Category.findOne({_id:id})
    console.log(product_list)
    res.render("dog-catagory", { product_list,categor, layout: '/partials/layout' });

  }
  catch (err) {
    console.log(err);
  }
}




const usercart =  async (req, res) => {
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
     
    let object={
        product:productId,
        price:price,
        image:image
        
      
    }

    if(productExist){
   
     let updateCart = await User.findOne({_id: user_id})
     console.log(updateCart)
     updateCart.cart.push(object);
    await updateCart.save();
    res.redirect('/')
      }
      else{
        res.send('product already added to cart')

      }
    }
 catch (err){console.log(err);}
}

const addToCart= (req,res)=>{
res.render("usercart",{layout:"partials/layout"})
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


const postwishlist = async(req,res)=>{
  const user_id = req.session.user_id;
  console.log(user_id);
  try {
      const user = await User.findById(user_id)
      const product = await Products.findById(req.params.id);
console.log(product);
      if (!product.wishList.includes({ user_id: user_id })) {
          let object = { productId: product.id }
          product.wishList.push({user_id:user_id});
      
          user.wishlist.push(object)
          await product.save();
          await user.save();
          res.redirect('/wishlist');
      }
      else {
          return res.status(400).json({ msg: 'you have already liked this product' });
      }
  } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
  }
  res.render("userwishlist",{layout:"partials/layout"})
}


const wishlist = (req,res)=>{
  res.render("userwishlist",{layout:"partials/layout"})
}
 
 
  
    

   


    
    


module.exports={
   
    home,
    dp,
    login,
   
    signup,
    postsignup,
    postlogin,
    usercart,
   
    
    addToCart,
    wishlist,

    postwishlist,
    

}
