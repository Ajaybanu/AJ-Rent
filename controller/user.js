const database = require("../config/server");
const { User } = require("../model/userdb");
const bcrypt = require("bcrypt");
const { Products } = require("../model/productdb")
const { Category } = require("../model/category");
const async = require("hbs/lib/async");

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

const viewpage =async (req,res)=>{
  const id = req.params.id;
  console.log(id);
  const view = await Products.findById(id);

   console.log(view);
    res.render("viewpage",{ layout: "partials/layout",view})
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
      let quantity = 1;
    
      if (productExist) {
          let object = {
              productId: product,
              price: price,
              quantity: quantity,
              name: name,
              total: price * quantity 
          }
          let isproductexist = await User.findOne({ _id: user_id, "cart.productId": product })
          if (!isproductexist) {


              let updateCart = await User.updateOne({ _id: user_id }, { $push: { cart: object } }).then(result => console.log(result));
              console.log(updateCart)

              if (!req.session.cart) {
                  req.session.cart = [];
              }
              req.session.cart.push({ price: price, quantity: quantity, product: product });
              req.session.cartCount = (req.session.cartCount || 0) + 1;
              console.log(req.session.cart);
              res.redirect('/')
          }
        
          else {
            res.redirect('/')
        }
    }
}
catch (err) { console.log(err); }

}






const usercart= async (req, res) => {
  // retrieve the caart array from the userSchema for the current user
  const currentUser = await User.findById(req.session.user_id).populate('cart');
  console.log(req.session);
  const cartProducts = currentUser.cart;

  // fetch the product details for each product id in the CArtarray
let Cart = [];
  for (let i = 0; i < cartProducts.length; i++) {
      const product = await Products.findById(cartProducts[i].productId);

      Cart.push(product);

  }
  console.log(Cart,"llllllllllllllllllllllll");
  res.render("usercart", { layout: "partials/layout", Cart,cartProducts})
};




  











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
  viewpage,
}
