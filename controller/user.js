const database = require("../config/server");
const { User } = require("../model/userdb");
const bcrypt = require("bcrypt");
const { Products } = require("../model/productdb")
const { Category } = require("../model/category");
const async = require("hbs/lib/async");
const {Order} = require('./../model/order')
const Razorpay = require('razorpay')
var instance = new Razorpay({
  key_id:'rzp_test_kbvBZsVLBZtPhJ',
  key_secret: '3fchbYPikODmu8IAVVAdTD5u'
})
const crypto = require('crypto');











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
    res.render("viewpage",{ layout: "partials/layout",view});
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
      let userId = req.session.user_id;
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
console.log(req.body);
console.log("addcart.......");
  console.log(req.params);
  try {
      const user_id = req.session.user_id;
      if (!user_id) {
          // If the user is not logged in, return an error
          return res.status(401).send('Unauthorized');
      }

      const productExist = await Products.findOne({ _id: productId });
      console.log(productExist);
      // Create a new cart item
      let product = productExist.id;
      let price = productExist.price;
      let name = productExist.name;
      let image = productExist.image;
      let quantity = req.body.quntity;
    
      if (productExist) {
          let object = {
              productId: product,
              price: price,
              quantity: quantity,
              name: name,
              image:image,
              total:price*quantity
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


const checkout = (req,res)=>{
  res.render("payment",{layout: "partials/layout"})
}

const checkoutPage = async (req, res) => {

  let totalPrice = req.body.totalPrice;
  let user_id = req.session.user_id


  
  const user = await User.findOne({ _id: user_id })
  const address = user.address[0];
 const grandTotal = totalPrice

      res.render("payment", { layout: "partials/layout", grandTotal, cartDetails: user.cart, totalPrice, address })
  

}


const deletecart = async (req,res,next)=>{
  try {
    let userId = req.session.user_id;
    await User.findByIdAndUpdate(userId, { $pull: { cart:{productId : req.params.id }  } }).then(() => {
console.log('llll');
        res.redirect('/usercart')
    })

}


catch (error) {
    next(error)
}
}








const placeorder = async (req, res) => {

  console.log(req.body);
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
      let userad = await User.findById(user_id)
      userad.address.push(AddressObj)
      userad.save().then(data => console.log(data))
      // let coupon = req.body.couponcode;
      // const randomstring = uuidv4().slice(0, 5);
      // console.log(randomstring, "random string");

      // let coup = await Coupon.findOneAndUpdate({ coupenCode: coupon })
      // coup.users.push(user_id)
      // coup.quantity--
      // coup.save();
      const user = await User.findOne({ _id: user_id })
      let Cart = user.cart
      let items = []
      items.push(Cart)
      console.log(items);
  
      const totalPrice = user.cart.reduce((total, item) => {
          return total + item.total
      }, 0);
      const grandTotal = totalPrice
//const discount = totalPrice - grandTotal;

      
      let order = new Order({
          products: items,
          Address: AddressObj,
          status: req.body.status,
          userId: user_id,
          deliveryAddress: delivery,
         
          payment: req.body.payment,
          subTotalPrice: totalPrice,
  
          totalPrice: grandTotal,

      })
      order = order.save().then(async (data) => {
          const orderId = data._id.toString()
          console.log(orderId);
          req.session.orderdata = data;
          if (data.payment == 'COD') {
              await User.updateOne({ _id: user_id }, { $set: { cart: [] } })
              console.log(data);
              // res.json({ status: true })
              res.render('orderSucccess', {
                  data,
                  layout: "partials/mainlayout"
              })
          }
          else {
           
              let amount = totalPrice
              req.session.amount = totalPrice*100
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
                  layout: "partials/layout"
              });
          }
      })
  } catch (error) {
      console.log(error);
      res.status(500).send(error);
  }


}


let orderSuccess = async (req, res,next) => {
  console.log(req.body);
  const amount = req.session.amount;
  const order_id = req.body.order_id;
  const payment_id = req.body.payment_id;
  const signature = req.body.signature;
  let user_id = req.body.user_id;

  try {
const message = order_id + '|' + payment_id;
const generated_signature = crypto.createHmac('sha256', instance.key_secret)
  .update(message)
  .digest('hex');
if (generated_signature === signature) {
  console.log(req.session);
  const orderid = req.session.orderdata._id
 let order = await Order.findOneAndUpdate({ _id: orderid }, {
      $set: {
          paymentStatus: "Completed",
      },
  })
  order.save();
  let user = await User.findOneAndUpdate({_id:user_id})
     
      await Products.find().then(async productsIn => {
        
      for (let i = 0; i < user.cart.length; i++) {
          for (let j = 0; j < productsIn.length; j++) {
              if (user.cart[i].productId == productsIn[j]._id) {
                  const pdtq = productsIn[j].countInStock - user.cart[i].quantity
                  console.log(pdtq);
                    await  Products.findOneAndUpdate({ _id: productsIn[j]._id }, { $set: { countInStock: pdtq } })
                
              }
             
          }
      }
  })
  
         user.set({cart:[]})
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



const orderSuccessVerified = async (req, res) => {
  let id = req.params.id
  let order = await Order.findById(id).populate('products.Object').exec()
  console.log(order);

  console.log(order);
  // const orderedProducts = order.products;
  // const products = order.products.map((product) => {
  //     return {
  //       name: product.productName,
  //     };
  //   });

   res.render('orderSuccess', {
       order,
       layout: "partials/layout"
   })

}













const deleteOrder = async (req, res) => {
  Order.findByIdAndRemove(req.params.id).then(async order => {
      if (order) {
        
              await Order.findByIdAndRemove(req.params.id)
      
          res.redirect('/getOrder')
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

const getOrders = async (req, res) => {
  let userId = req.session.user_id
  let user = await Users.findOne({_id:userId})
 
  let order = await Order.findById(user.orders).populate('products.Object').exec()
  console.log(order);

  res.render("orderPage",{ layout: "partials/mainlayout" , order,user:user});
}




const checkoutaddAddress = async (req, res) => {
  try {

      console.log("inside checkout address");
      if (req.session.user_id) {
          Id = req.session.user_id;
          console.log(Id, "idd");
          const AddressObj = {
              city: req.body.city,
              county: req.body.country,
              phone: req.body.phone,
              state: req.body.state,
              firstname: req.body.firstname,
              lastname: req.body.lastname,
              pincode: req.body.pincode,
              Address: req.body.address
          }
          const userAddress = await Users.findOneAndUpdate({ userId: Id })
          userAddress.address.push(AddressObj)
          await userAddress.save().then(() => {
              res.redirect('/checkout')
          })
      }

  }
  catch (error) {
      console.log(error.message);
  }
}



const getAccessories= async (req, res) => {
  try {
    let id = req.params.id;
    console.log(id);
    const access = await Products.find({ category: id })
    const categor = await Category.findOne({ _id: id })
    console.log(access)
    res.render("accessories", { access, categor, layout: "partials/layout" });
  }
  catch (err) {
    console.log(err);
  }
}

const food = async (req,res)=>{
  let id = req.params.id;
  console.log(id);
  const food = await Products.find({category: id })
  const categor = await Category.findOne({ _id: id })
  console.log(food)
  res.render("food",{ food, categor, layout: "partials/layout" })

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
  viewpage,
  checkout,
  deletecart,
  checkoutPage,
  placeorder,
  orderSuccess,
  orderSuccessVerified,
  getAccessories,
  food,
 

}
