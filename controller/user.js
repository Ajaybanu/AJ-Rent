const database = require("../config/server");
const { User } =require("../model/userdb");
const bcrypt = require("bcrypt");
const { Dog } = require("../model/dogdb");
const { Cat } = require("../model/catdb");
const { Bird } = require("../model/birddb");
const { Fish } = require("../model/fishdb");




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
const home =async (req,res)=>{
    let id = req.params.id
 let product = [] 
 let dog = await Dog.find({catagory:"pet"})
 let cat = await Cat.find({catagory:"pet"})
 let bird = await Bird.find({catagory:"pet"})
 let fish = await Fish.find({catagory:"pet"})
 dog.forEach(element=>product.push(element))
 cat.forEach(element=>product.push(element))
 bird.forEach(element=>product.push(element))
 fish.forEach(element=>product.push(element))
 
        
  res.render("home",{product,dog,cat,bird,fish,layout:"partials/layout"});
};
const login = (req,res)=>{
        res.render("userlogin",{layout:"partials/layout"})
}
const dp = (req,res)=>{
    res.render("dog-catagory",{layout:"partials/layout"})
}

const cp = (req,res)=>{
    res.render("cat-catagory",{layout:"partials/layout"})
}
const bp = (req,res)=>{
    res.render("bird-catagory",{layout:"partials/layout"})
}
const fp = (req,res)=>{
    res.render("fish-catagory",{layout:"partials/layout"})
}
const dog = (req,res)=>{
    res.render("dogcart")
}
const dogcart = async(req,res)=>{
    await Dog.find({catagory:"pet"}).then((pet)=>{
        res.render("dogcart",{pet,layout:"partials/layout"});
    })  
    }
const catcart =(req,res)=>{
    let id = req.params.id
    Cat.find(id).then((result)=>{
        res.render("catcart",{result,layout:"partials/layout"})
    })
}

const birdcart=(req,res)=>{
    let id = req.params.id;
    Bird.find(id).then((result)=>{
     res.render("birdcart",{result,layout:"partials/layout"});
    })
     
 }

const fishcart=(req,res)=>{
    let id = req.params.id;
    Fish.find(id).then((result)=>{
        res.render("fishcart",{result,layout:"partials/layout"})
    }) 
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
const dogfood = (req,res)=>{
    Dog.find({catagory:"food"}).then((food)=>{
    res.render("dogfood",{food,layout:"partials/layout"})
    
})
}
const dogclothes =async(req,res)=>{
   await Dog.find({catagory:"clothe"}).then((clothe)=>{
        res.render("dogclothes",{clothe,layout:"partials/layout"})
        
    })

   
}

const dogshampo = async (req,res)=>{
    await Dog.find({catagory:"shampo"}).then((shampo)=>{
        res.render("dogshampo",{shampo,layout:"partials/layout"})
    })
   
}
const dogtoy = async (req,res)=>{
    await Dog.find({catagory:"toy"}).then((toy)=>{
        res.render("dogtoy",{toy,layout:"partials/layout"})
    })
   
}

const dogaccessories = async (req,res)=>{
    await Dog.find({catagory:"accessories"}).then((accessories)=>{
        res.render("dogaccessories",{accessories,layout:"partials/layout"})
    })
    
}
    



const wishlist =  (req, res) => {
   
        res.render('userwishlist', { userData,layout:"partials/layout" })
}
  

       
   
    
    


module.exports={
   
    home,
    dp,
    cp,
    bp,
    fp,
    login,
    dog,
    signup,
    postsignup,
    postlogin,
    usercart,
    dogcart,
    catcart,
    wishlist,
    addToCart,
    birdcart,
    fishcart,
    dogfood,
    dogclothes,
    dogshampo,
    dogtoy,
    dogaccessories,
    

}
