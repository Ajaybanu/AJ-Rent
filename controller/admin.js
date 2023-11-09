
const db = require("../config/server");
const bcrypt = require("bcrypt");
const { Admin } = require('../model/admin_Schema')
const { Products } = require('../model/product_Shema')
const { Users } = require("../model/user_Schema")
const { Category } = require('../model/category_Schema')
const { Coupon } = require('../model/coupon_Schema');
const { Order } = require('../model/order_Schema')
const fs = require('fs');
const { remove } = require("lodash");
const { log } = require("console");

// admin login sign up functions
const adminlog = (req, res) => {
  res.render('adminLogin', { layout: '/partials/layout' });
}
const adminHome = async (req, res) => {
  const { addCategoryexist, addCategoryerror, addCategory } = req.session
  let data = await Category.find()
  let items = await Products.find()

  res.render("adminHome", { data, items, layout: '/partials/layout'});
  



}
const adminLogin = async (req, res) => {
  try {
    console.log(req.body);
    let Email = req.body.email;
    let PASS = req.body.password;
    const admin = await Admin.findOne({ email: Email })
    if (!admin) {
      res.redirect("/admin/adminlogin")
    }
    if (admin) {
      console.log(admin);
      let data = await bcrypt.compare(PASS, admin.password);
      console.log(data);
      if (data) {
        req.session.adminLogged = true;
        req.session.admin_id = admin._id
        res.redirect('/admin');
      }
      else {
        res.send('not allow')
      }
    }
  }
  catch {
    res.status(500).send()
  }
}
const adminSignup = async (req, res, next) => {
  try {
    console.log(req.body);
    const admin = new Admin({

      email: req.body.email,
      password: req.body.password
    });
    admin.save().then(result => {
      console.log(result);
      res.redirect('/admin');
    })
  }
  catch (err) {
    next(err);
  }
}

//manage admin profile
const UpdateProfile = async (req, res) => {
  try {
    const id = req.session.admin_id
    const email = req.body.email
    const password = req.body.password

    const updateUser = await Admin.findByIdAndUpdate({ _id: id }, { $set: { email: email, password: password } })

    if (updateUser) {

      res.redirect("/admin")
    }

  } catch (error) {
    console.log(error.message);
  }
}

//manage users
const adminViewUsers = async (req, res) => {
  await Users.find().then((user) => {
    console.log(user);
    res.render('adminViewUsers', { user, layout: '/partials/layout' })
  })
}
const adminManageUsers = async (req, res) => {

}

//manage category
const addCategory = async (req, res) => {
  try {
    const name = req.body.name;
    let regExp = new RegExp(`^${name}`, 'i')
    let find = await Category.findOne({ name: { $regex: regExp } })
    console.log(find);
    if (find) {
      req.session.addCategoryexist = true
      res.redirect("/admin/addcategory");
    } else {
      const category = new Category({
        name: req.body.name,
        image: req.file.filename,
        description: req.body.description
      })
      category.save().then(result => {
        console.log(result);
      })
      req.session.addCategory = true;
      res.redirect("/admin")
    }

  }
  catch {
    console.log(error);
  }
}
const adminViewCategory = (req, res) => {
  Category.find().then(categories => {

    res.render('adminviewcategory', { categories, layout: '/partials/layout' })

  })
}
const editCategory = async(req, res) => {
  let id = req.params.id;
  Category.findById(id).then((category) => {

    res.render('adEditCat', { category, layout: '/partials/layout' })
  })
}
const updateCategory = async (req, res) => {
  let id = req.params.id;
  let new_image = "";

  if (req.file) {
    new_image = req.file.filename;
    try {
      fs.unlinkSync("./public/images/uploads" + req.body.old_image);
    } catch (err) {
      console.log(err);
    }
  } else {
    new_image = req.body.old_image;
  }
  await Category.findByIdAndUpdate(id, {
    name: req.params.name,
    image: new_image,
    description: req.body.description
  }).then(data => {
    console.log(data);
    res.redirect('/admin/adminviewcategories')
  })
}
const deleteCategory = async (req, res) => {
  try {
    let { id } = req.params
    let del = await Category.deleteOne({ _id: id })

    if (del.deletedCount === 0) {
      res.send({ msg_deleteerr: true })
    }
    else if (del.deletedCount === 1) {
      res.send({ msg_delete: true })
    }
  }
  catch (err) {
    console.log(err);
  }
}


//manage product
const adminViewProduct = async (req, res) => {
  await Products.find().then((items) => {
    console.log(items);
    res.render('adminViewProduct', { items, layout: '/partials/layout' })
  })

}
const adminAddProduct = async (req, res) => {
  console.log(req.body);
  let Categories = req.body.category;
  console.log(Categories);
  const category = await Category.findOne({ name: Categories })
  if (!category) {
    console.log("category invalid");
  }
  if (category) {
    let data = category.id.toString();
    const product = new Products({

      name: req.body.name,
      description: req.body.description,
      richDescription: req.body.richDescription,
      brand: req.body.brand,
      image: req.file.filename,
      price: req.body.price,
      category: data,
      countInStock: req.body.countInStock,
      rating: req.body.rating,
      numReviews: req.body.numReviews,
      isFeatured: req.body.isFeatured,

    });
    product.save().then((productsadded) => {
      console.log(productsadded);
      let object = { product_Id: productsadded.id }
      category.products.push(object)
      category.save();
      res.redirect('/admin')

    })
  }
}
const listProducts = async (req, res) => {
  try {
    let id = req.params.id;
    console.log(id);
    const product_list = await Products.find({ category: id })
    console.log(product_list)
    res.render("adminViewCat", { product_list, layout: '/partials/layout' });

  }
  catch (err) {
    console.log(err);
  }
}
const updateProduct = async (req, res) => {
  let new_image = "";

  if (req.file) {
    new_image = req.file.filename;
    try {
      fs.unlinkSync("./public/images/uploads" + req.body.old_image);
    } catch (err) {
      console.log(err);
    }
  } else {
    new_image = req.body.old_image;
  }
  let featured = req.body.isFeatured;

  let id = req.params.id;
  let update = await Products.updateOne({ _id: id }, {
    $set: {
      name: req.body.name,
      description: req.body.description,
      richDescription: req.body.richDescription,
      brand: req.body.brand,
      image: new_image,
      price: req.body.price,
      category: req.body.category,
      countInStock: req.body.countInStock,
      rating: req.body.rating,
      numReviews: req.body.numReviews,
      isFeatured: Boolean(featured),
    }
  })
  if (update.modifiedCount == 0) {
    req.session.product_updateerr = true
    res.redirect("/admin/adminviewproducts");
  }
  else if (update.modifiedCount == 1) {
    req.session.product_update = true
    res.redirect("/admin/adminviewproducts");
  }
}
const editProduct = (req, res) => {
  let id = req.params.id;
  Products.findById(id).then(product => {
    res.render('adminEditProduct', { product, layout: '/partials/layout' })
  })
}
const deleteProduct = async (req, res) => {
  let id = req.params.id;
  console.log(id);

  try {
    const result = await Products.findByIdAndRemove(id);

    if (!result) {
      throw new Error('Product not found');
    }

    const imagePath = `./public/images/uploads/${result.image}`;
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    } else {
      console.log(`Image not found: ${result.image}`);
    }

    await Category.findByIdAndUpdate(result.category._id, { $pull: { products: { _id: result._id } } });

    res.redirect("/admin/adminviewproducts");
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};


// view wishlisted products and users.
const adminViewWish = async (req, res) => {
  // retrieve the wishlist array from the userSchema for the current user
  const currentProduct = await Products.findById(req.params.id).populate('wishList');
  const wishlistedUsers = currentProduct.wishList;

  // fetch the product details for each product id in the wishlist array
  const users = [];
  for (let i = 0; i < wishlistedUsers.length; i++) {
    const user = await Users.findById(wishlistedUsers[i]._id);
    users.push(user);
  }
  console.log(users);

  // pass the array of product details to the wishlist.hbs page
  res.render('adminViewWish', { users, layout: "partials/layout" });
};


//manage coupons
const postCreateCoupon = async (req, res, next) => {
  try {
    console.log(req.body)
    let { couponName, couponCode, percentDiscount, quantity, startDate, endDate, maximumDiscount, minimumSpend, } = req.body
    let couponFound = await Coupon.findOne({ couponCode })
    if (!couponFound) {
      let coupn = new Coupon({
        couponName: couponName,
        couponCode: couponCode,
        percentDiscount: percentDiscount,
        quantity: quantity,
        startDate: startDate,
        endDate: endDate,
        maximumDiscount: maximumDiscount,
        minimumSpend: minimumSpend,

      })
      coupn.save().then(data => {
        console.log(data);
        res.redirect('/admin')
      })
    }
    else {
      res.send({ exist: true })
    }
  }
  catch (err) {
    err.admin = true;
    next(err);
  }
};
const manageCoupons = async (req, res) => {
  await Coupon.find().then(data => {
    console.log(data);
    res.render('adminViewCoupons', { data, layout: '/partials/layout' })
  })
}
const deleteCoupon = async (req, res) => {
  let id = req.params.id
  await Coupon.findByIdAndRemove(id).then(() => {
    console.log("coupon deleted");
    res.redirect('/admin/managecoupons')
  })
}


//manage orders

const manageOrder = async (req, res) => {
  const orderList = await Order.find()
  // .populate('userId').sort({'dateOrdered': -1});
console.log(orderList);
  res.render('adminViewOrders', { orderList, layout: '/partials/layout',orderList})
}

// const orderDetails = async (req, res) => {
//   const order = await Order.findById(req.params.id)
//     .populate('user', 'name')
//     .populate({
//       path: 'orderItems', populate: {
//         path: 'product', populate: 'category'
//       }
//     });

//   if (!order) {
//     res.status(500).json({ success: false })
//   }
//   res.send(order);
// }
// const orderList = async function (req, res, next) {
//   try {
//     let { orderreq } = req.query
//     let { userId } = req.session
//     let orderHistory = await Order.find({}).populate("product.productId").sort({ createdAt: -1 })
//     if (!orderreq) {
//       res.render("admin_orders", { orderList: orderHistory })
//     }
//     else {
//       let orderHistory = await Order.findOne({ orderId: orderreq }).populate("product.productId")
//       res.render("admin_orderdetails", { orderList: orderHistory })
//     }
//   }
//   catch (err) {
//     err.admin = true;
//     next(err);
//   }
// }


const orderAction = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { newOrderStatus } = req.body;
    const { userId } = req.session;

    console.log(req.params);
    console.log(req.body);
    console.log(newOrderStatus);

    const orderHistory = await Order.findOne({ orderId: orderId });
    console.log(orderHistory);
    const orderChange = await Order.updateOne({orderId:orderId}, { $set: { orderStatus: newOrderStatus } });

    if (orderChange.modifiedCount === 0) {
      return res.send({ msg: false });
    }

    if (newOrderStatus === "cancelled" || newOrderStatus === "returned") {
      for (const product of orderHistory.products) {
        const { productId, quantity } = product;
        await Products.findByIdAndUpdate(productId, { $inc: { quantity: -quantity } });
      }
    }

    res.send({ msg: true, newOrderStatus }); // Assuming 'action' is defined somewhere in your code.

  } catch (err) {
    console.log(err);
    res.status(500).send({ error: "Internal Server Error" });
  }
};
const deleteOrder =  async (req, res) => {
  try {
    console.log(req.params);
    const orderId = req.params.orderId;

    // Find the order by ID and delete it
    const deletedOrder = await Order.findOneAndDelete({orderId:orderId});

    if (!deletedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.redirect('/admin')
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};


const getChart = async (req, res) => {
  try {
    console.log("hello");
    const orders = await Order.find();
    const totalSales = orders.reduce((acc, order) => acc + order.totalPrice, 0);
    res.render('chart',{ totalSales:totalSales });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}



let paymentAction = async (req, res) => {

  try {
    let { userId } = req.session
    let { orderId, action } = req.body
    orderHistory = await order.findOne({ orderId: orderId })
    let orderChange = await order.updateOne({ orderId: orderId }, { $set: { paymentStatus: action } })
    if (orderChange.modifiedCount == 0) {
      res.send({ msg: false })
    }
    else if (orderChange.modifiedCount == 1) {
      if (action == refund) {
        await user.updateOne({ _id: userId }, { walletBalance: orderHistory.totalPrice })
      }
      res.send({ msg: true, action })
    }


  }
  catch (err) {
    err.admin = true;
    next(err);
  }
}
const salesReport = async (req, res, next) => {
  try {
    let saleReport = []
    let todayDate = new Date();
    let DaysAgo = new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000);
    console.log(DaysAgo);
    saleReport = await order.aggregate([
      {
        $match: { createdAt: { $gte: DaysAgo } },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%d-%m-%Y", date: "$createdAt" } },
          totalPrice: { $sum: "$totalPrice" },
          count: { $sum: 1 },
        },
      }, {
        $sort: { _id: 1 }
      }
    ])
    todayDate = moment(todayDate).format('YYYY-MM-DD')
    DaysAgo = moment(DaysAgo).format('YYYY-MM-DD')
    res.render('salesreport', { saleReport, todayDate, DaysAgo })
  }
  catch (err) {
    err.admin = true;
    next(err);
  }
}

const salesProject = async (req, res, next) => {
  try {
    let start = new Date(req.query.from)
    let end = new Date(req.query.to)
    let { filter, orderStatus, donutchart } = req.query
    let saleReport
    console.log(req.query.from, req.query.to, filter)
    if (orderStatus) {
      saleReport = await Order.aggregate([
        {
          $group: {
            _id: "$orderStatus",

            count: { $sum: 1 },
          }
        },
        , { $sort: { _id: 1 } }
      ])
    }
    else if (donutchart) {
      saleReport = await order.aggregate([
        {
          $group: {
            _id: "$Payment",
            count: { $sum: 1 },
          },
        }, { $sort: { _id: 1 } }
      ])
    }
    else {
      saleReport = await Order.aggregate([
        {
          $match: {
            "$and": [
              { createdAt: { $gte: start, $lte: end } },
              { orderStatus: "delivered" }
            ]
          }
        },
        {
          $group: {
            _id: { $dateToString: { format: filter, date: "$createdAt" } },
            totalPrice: { $sum: "$totalPrice" },
            count: { $sum: 1 },
          },
        }, { $sort: { _id: 1 } }
      ])
      if (filter == "%m-%Y" || filter == "%m") {
        const months = [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ];
        saleReport = saleReport.map((el) => {
          const newOne = { ...el };
          console.log(newOne);
          let id = newOne._id.slice(0, 2)
          if (id < 10) {
            id = newOne._id.slice(1, 2)
          }
          console.log(id)
          if (filter == "%m-%Y")
            newOne._id = months[id - 1] + ' ' + newOne._id.slice(3);
          else
            newOne._id = months[id - 1]

          return newOne;
        })
      }
      if (filter == "%U-%Y") {
        saleReport = saleReport.map((el) => {
          const newOne = { ...el };
          newOne._id = "week".concat(" ", newOne._id);
          return newOne;
        })
      }
    }
    res.json({ saleReport: saleReport })
  }
  catch (err) {
    err.admin = true;
    next(err);
  }
}

const sales = async (req, res) => {
  let orders = await Order.find()
  if (orders) {
    let totalSales = await Order.aggregate([
      {
        $group: {
          _id: "$orderStatus",
          totalPrice: { $sum: "$totalPrice" },
          count: { $sum: 1 },
        },
      }, { $sort: { _id: 1 } }
    ])
    console.log(totalSales);
    res.render('sales', { layout: "partials/layout", totalSales })
  }

}

const orderedUsers = async (req, res) => {
  let order = await Order.find()

  const user = [];
  for (let i = 0; i < order.length; i++) {
    const users = await Users.findById(order[i].userId);
    user.push(users);
  }
  console.log(user);
  res.render('adminViewUsers', { layout: "partials/layout", user });
}

const orderUdetails = async (req, res) => {
  res.render('adminVusers', { layout: "partials/layout", });
}

const adminLogout = (req, res) => {
  req.session.destroy(err => {
    if (err) throw err;
    res.redirect('/admin/adminlogin')
  })
}


module.exports = {
  adminLogin,
  adminViewProduct,
  adminlog,
  adminSignup,
  UpdateProfile,
  adminHome,
  adminAddProduct,
  adminViewUsers,
  adminLogout,
  addCategory,
  editCategory,
  editProduct,
  deleteProduct,
  deleteCategory,
  adminViewCategory,
  listProducts,
  updateCategory,
  updateProduct,
  postCreateCoupon,
  manageCoupons,
  adminViewWish,
  adminManageUsers,
  manageOrder,
  deleteCoupon,
  salesReport,
  salesProject,
  paymentAction,
  orderAction,
  getChart,
  sales,
  orderUdetails,
  orderedUsers,
  deleteOrder
  


}