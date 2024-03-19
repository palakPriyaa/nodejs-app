//import http from "http";
//import palak from "./features.js";
import express from 'express';
import path from "path";
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

mongoose.connect("mongodb://127.0.0.1:27017" , {
    dbName : "backend",
}).then(c=>console.log("database connected"))
.catch((e) => console.log(e));


const UserSchema = new mongoose.Schema({
    name : String ,
    email : String,
    password: String,
}); 

const User = mongoose.model("User" , UserSchema);

//node js
// console.log(palak);

// const server = http.createServer((req, res) => {
//     res.end("plk");
// });

// server.listen(5000 , () => {
//     console.log("server is working");
// });


//express

const server = express();


//making a temp array for database that will store all the nmes and email of the user
//const users =[];



// server.get("/" , (req , res) => {
//     res.sendStatus(500);
// });

//an api 

// server.get("/getproducts" , (req , res) => {
//     res.json({
//         success: true,
//         products: [],
//     }

//     );
// });


//now if we want to send an html file like index.html and have its value we can get that by

// server.get("/" , (req , res) => {
//     const pathlocation = path.resolve();
//     res.sendFile(path.join(pathlocation , "./index.html") );
// });


//or we not this then we will need ejs as follow
//ejs is basically writing js in html in a syntax
//if we want to use or import css or any frontend video and image we use it with ejs

//middlewares
//imp for acessing anything in public folder(static)

server.use(express.static(path.join(path.resolve() , "public")));

server.use(express.urlencoded({extended:true}));
server.use(cookieParser());

//setting up view engine
server.set("view engine" , "ejs");

const isAuthenticated = async(req , res , next)=>{
    const {token} = req.cookies;
    
    if(token){
        const decoded = jwt.verify(token , "jkdnndmkekeddndn" );

        //console.log(decoded);

        req.user = await User.findById(decoded._id);
        next();
    }
    else{
        res.render("login");
    }
}
 
server.get("/" , isAuthenticated,(req , res) => {
    
    res.render("logout" , {name : req.user.name});
    
  

  // res.sendFile("index");
});

server.get("/login" , (req , res) => {
    
    res.render("login" );
    
  

  // res.sendFile("index");
});


server.get("/register" , (req , res) => {
    
    res.render("register" );
    
  

  // res.sendFile("index");
});

server.post("/login", async (req, res) => {
    const { email, password } = req.body;
  
    let user = await User.findOne({ email });
  
    if (!user) return res.redirect("/register");
  
    const isMatch = await bcrypt.compare(password,user.password);
  
    if (!isMatch)
      return res.render("login", {  message: "Incorrect Password" });
  
    const token = jwt.sign({ _id: user._id }, "jkdnndmkekeddndn" );
  
    res.cookie("token", token, {
      httpOnly: true,
      expires: new Date(Date.now() + 60 * 1000),
    });
    res.redirect("/");
  });


server.post("/register", async(req, res) => {
    const {name , email , password}  = req.body;


    let user = await User.findOne({email});
    if(user){
        return res.redirect("/login");
    }

    const hashedPassword = await bcrypt.hash(password ,10);
      user =  await User.create({
        name , 
        email,
        password: hashedPassword,
    });

    const token = jwt.sign({_id:user._id} , "jkdnndmkekeddndn");

    res.cookie("token" ,token, {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
        expires: new Date(Date.now() + 60 * 1000),
    });
    res.redirect("/");
});


server.get("/logout" , (req , res) =>{
 //   console.log("iamnnnnn");
    res.cookie("token" , null,{
        httpOnly:true,
        expires:new Date(Date.now()),
    });
    res.redirect("/");
    
});

// server.get("/add" , (req , res) => {
//     Message.create({name : "plk" , email : "sample@gmail.com"}).then(() => {
//         res.send("NICE");
//     });
//  });

 // or instead use async and await

//  server.get("/add" , async(req , res) => {
//    await Message.create({name : "plk1" , email : "samplee@gmail.com"});
//         res.send("NICE");
    
//  });

//  server.get("/success" , (req , res) => {
//      res.render("success");
//   });



// server.post("/contact" , async(req , res) => {
    
    
// //    const messageData =  {username: , email:};
// //    console.log(messageData);
// const {name , email} = req.body;

//    await Message.create({name : name , email: email});

//     res.redirect("/success");
//  });

//  server.post("/" , (req , res) => { 
    
//     //pushig all the values name , email of the users in an temp arrays users
//     users.push({username:req.body.name , email:req.body.email});

//     res.render("success");
//  });



 //es api par hit hote hi users ka sara data miljaye
//  server.get("/users",(req,res)=>{
//     res.json({
//         users,
//     });
//  });

//lets assume we want to acess static folder like public(index.html) 
//express.static(path.join)



server.listen(5000, () =>{
    console.log("server is working");
});  