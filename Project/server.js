const express= require("express");
const app=express();
const path=require("path");
const mongoose=require('mongoose');
const bodyParser=require('body-parser');
// const homeRouter=require('./routers/homeRouter');
const port=process.env.port || 3000;
const homeSchema=require('./models/homeSchema');
const { response, Router } = require("express");
const traderSchema=require('./models/traderSchema');
const restrictSchema=require('./models/restrictSchema');
const session = require("express-session");
const { appendFile } = require("fs");
const MongoDBStore = require("connect-mongodb-session")(session);

const store = new MongoDBStore({
    uri: 'mongodb://localhost:27017/FFSDProject',
    collection: "Sessions",
});


app.use(
    session({
        secret: "this is top secret",
        resave: false,
        saveUninitialized: false,
        store: store,
    })
);

app.get("/logout",function(req,res){
    req.session.destroy();
    res.redirect("/");
});

const isAuth = (req, res, next) => {
    if (req.session.isAuth) {
        next();
    } else {
        res.redirect("/login");
    }
};



//db connection
mongoose.connect('mongodb://localhost:27017/FFSDProject',{useNewUrlParser:true});
const db=mongoose.connection;

db.on("error",()=>{console.log("Error in connection");});
db.once('open',()=>{console.log("Connected with database");});






app.set('view engine','ejs');
// app.use('/',homeRouter);



app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());



app.get("/register.html",function(req,res){
    res.render('register',{title:'Fill Form',password:'',email:''});
});



app.get("/logintrader.html",function(req,res){
    res.render('logintrader',{title:'Fill Form',password:'',email:''});
});






//login Consumer
app.post('/register',async(req,res)=>{
   
    try {
        const name=req.body.name;
        const email=req.body.email;
        const password=req.body.password;
        const mobile=req.body.mobile;
               homeSchema.findOne({email:email},(err,result)=>{
               if(result != null)
               res.render('register',{title:'Email Address Already in Use',password:'',email:''});
    //         else if(email === result1.email && password ===result1.password && email.includes('@'))
    //         res.render('dashboard',{name:result1.name});
           })
         if(email.includes('@')){
             const userData=new homeSchema({
                 name,email,password,mobile
             })
             userData.save(err=>{
                 if(err)
             console.log('error is here');
                 else
                 res.render('register',{title:'Submitted Successfully',password:'',email:''});
             })
         }else{
            res.render('register',{title:'Not Done',password:'',email:''});
         }

        //  homeSchema.findOne({email:email},function(err,data)
        //  {

        //  })


        // const useremail=await homeSchema.findOne({email:email});
        // console.log(useremail)
        //  if(email ===useremail.email){
            
        // //    res.render('register',{title:'Email already in Use',password:'',email:''});

        //  }else{
        //    console.log('Error');
        //  }

    } catch (error) {
        console.log(error);
   res.render('register',{title:'Error in Code',password:'',email:''});
    // console.log(error);
    }

});



//signIn
app.post('/login',(req,res)=>{
  const email1=req.body.emails;
  const password=req.body.passwords;
  //console.log(email1);
 // console.log(password);
 homeSchema.findOne({email:email1},(err,result1)=>{
    //console.log(result1);
    // if(email===result1.email)
   // res.render('register',{title:'You Are restricted',password:'',email:''});
    //else{
  restrictSchema.findOne({email:email1},(err,result)=>{
       if(result != null)
      res.render('register',{title:'You Are restricted',password:'',email:''});
       else if(email1 === result1.email && password ===result1.password && email1.includes('@')){
       //res.render('dashboard',{name:result1.name});

        homeSchema.findOne({email:email1},(err,result)=>{
        req.session.data=result;
        req.session.isAuth=true;
        return res.status(201).redirect("/dashboard");
        //res.render('dashboard',{name:req.session.data.name,email:req.session.data.email,mobile:req.session.data.mobile});
        })
    }


  })
//}
 })
})

// app.post('/login',(req,res)=>{
//   const email=req.body.emails;
//   const password=req.body.passwords;
// restrictSchema.findOne({email:email},(err,result1)=>{
//     if(email===result1.email)
//     res.render('register',{title:'You Are restricted',password:'',email:''});
//     else{
//   homeSchema.findOne({email:email},(err,result)=>{
//       if(email === result.email && password ===result.password && email.includes('@'))
//      res.render('dashboard',{name:result.name})
//       else
//       console.log(err);
//   })
// }
// })
// })




//Login Signup for trader
app.post('/logintrader',async(req,res)=>{
   
    try {
        const name=req.body.name;
        const email=req.body.email;
        const password=req.body.password;
        const mobile=req.body.mobile;
        traderSchema.findOne({email:email},(err,result)=>{
            if(result != null)
            res.render('register',{title:'Email Address Already in Use',password:'',email:''});
 //         else if(email === result1.email && password ===result1.password && email.includes('@'))
 //         res.render('dashboard',{name:result1.name});
        })
         if(email.includes('@')){
             const userData=new traderSchema({
                 name,email,password,mobile
             })
             userData.save(err=>{
                 if(err)
             console.log('error is here');
                 else
                 res.render('logintrader',{title:'Submitted Successfully',password:'',email:''});
             })
         }else{
            res.render('logintrader',{title:'Not done',password:'',email:''});
         }

        //  const useremail=await traderSchema.findOne({email:email});
        //  if(email===useremail.email){
          
        //    // res.render('logintrader',{title:'Email already in Use',password:'',email:''});

        //  }else{
        //      console.log('Error');
        //  }


    } catch (error) {
    res.render('logintrader',{title:'Error in Code',password:'',email:''});
    console.log(error);
    }

});


//Search by Category
app.post('/',(req,res)=>{
const route =  req.body.search;
if(route ==='mens'){
    res.render('mens',{});
    
}
if(route ==='womens'){
    res.render('mens',{});
}
if(route ==='staples'){
    res.render('staples',{});
}
if(route ==='fruits'){
    res.render('fruits',{});
}
if(route ==='vegetables'){
    res.render('fruits',{});
}
if(route ==='cloths'){
    res.render('cloths',{});
}
if(route ==='kids'){
    res.render('cloths',{});
}
if(route ==='dairys'){
    res.render('dairys',{});
}
if(route ==='bakery'){
    res.render('dairys',{});
}


})



app.post('/dashboardrestrict',(req,res)=>{
    restrictSchema.find({}, (err,result)=> {
        console.log(result);
       // res.render('dashboardrestrict',{});
      })   


})

//Restrict User Portal
app.post('/restrict',async(req,res)=>{
 
    
    try {
        const name=req.body.name;
        const email=req.body.email;
        const password=req.body.password;
        const mobile=req.body.mobile;

         if(name.includes('hk')&&(password.includes('123'))){
             const userData=new restrictSchema({
                 name,email,password,mobile
             })
             userData.save(err=>{
                 if(err)
             console.log(err);
                 else{
                 restrictSchema.find({}, (err,result)=> {
                    console.log(result);
                    res.render('dashboardrestrict',{items:result});
                  })   } })
         }else{
            res.render('restrict',{title:'Not Done',password:'',email:''});
         }

        //  homeSchema.findOne({email:email},function(err,data)
        //  {

        //  })


        // const useremail=await homeSchema.findOne({email:email});
        // console.log(useremail)
        //  if(email ===useremail.email){
            
        // //    res.render('register',{title:'Email already in Use',password:'',email:''});

        //  }else{
        //    console.log('Error');
        //  }

    } catch (error) {
        console.log(error);
   res.render('restrict',{title:'Error in Code',password:'',email:''});
    // console.log(error);
    }








//     try {
//         const name=req.body.name;
//         const email=req.body.email;
//         const password=req.body.password;
//         const mobile=req.body.mobile;
        
//          if(name === 'hk' && password === '123'){
//              const userData=new restrictSchema({
//                  name,email,password,mobile
//              })
//              userData.save(err=>{
//                  if(err)
//              console.log(err);
//                  else
//                  res.render('dashboardrestrict',{title:'User Restricted',password:'',email:''});
//              })
//          }else{
//             res.render('restrict',{title:'Email is Not Valid',password:'',email:''});
//          }


//         //  homeSchema.findOne({email:email},function(err,data)
//         //  {

//         //  })


//         // const useremail=await restrictSchema.findOne({email:email});
//         // console.log(useremail)
//         //  if(email === useremail.email){
            
//         // //    res.render('register',{title:'Email already in Use',password:'',email:''});

//         //  }else{
//         //    console.log('Error');
//         //  }

//     } catch (error) {
//         console.log(error);
//    res.render('restrict',{title:'Error in Code',password:'',email:''});
//     // console.log(error);
//     }

});



//signIntrader
app.post('/logintrad',(req,res)=>{
//   const email=req.body.emails;
//   const password=req.body.passwords;

// //   traderSchema.findOne({email:email},(err,result)=>{
// //       if(email === result.email && password ===result.password && email.includes('@'))
// //      res.render('dashboardtrader',{name:result.name,email:result.email,mobile:result.mobile})
// //       else
// //       console.log(err);
// //   })

// traderSchema.findOne({email:email},(err,result)=>{
// req.session.data=result;
// req.session.isAuth=true;
// return res.status(201).redirect("/dashboardtrader");








// })

const email1=req.body.emails;
const password=req.body.passwords;
//console.log(email1);
// console.log(password);
traderSchema.findOne({email:email1},(err,result1)=>{
  //console.log(result1);
  // if(email===result1.email)
 // res.render('register',{title:'You Are restricted',password:'',email:''});
  //else{
restrictSchema.findOne({email:email1},(err,result)=>{
     if(result != null)
    res.render('register',{title:'You Are restricted',password:'',email:''});
     else if(email1 === result1.email && password ===result1.password && email1.includes('@')){
     //res.render('dashboard',{name:result1.name});

      traderSchema.findOne({email:email1},(err,result)=>{
      req.session.data=result;
      req.session.isAuth=true;
      return res.status(201).redirect("/dashboardtrader");
      //res.render('dashboard',{name:req.session.data.name,email:req.session.data.email,mobile:req.session.data.mobile});
      })
  }


})
//}
})

})






app.get('/dashboardtrader',(req,res)=>{
    res.render('dashboardtrader',{name:req.session.data.name,email:req.session.data.email,mobile:req.session.data.mobile});
});

app.get('/dashboard',(req,res)=>{
     res.render('dashboard',{name:req.session.data.name,email:req.session.data.email,mobile:req.session.data.mobile});
});

const tradeItemSchema = {
    item: {
        required: [true, "Please enter name"],
        type: String,
    },
    price: {
        required: [true, "Please enter price"],
        type: String,
    },
    tradername: String
}

const Item = mongoose.model("tradeItem",tradeItemSchema)

app.get('/Itemsdashboard',(req,res)=>{

    Item.find({tradername:req.session.data.name}, (err,founditems)=> {
    res.render('Itemsdashboard',{name:req.session.data.name,email:req.session.data.email,mobile:req.session.data.mobile,items: founditems});
    })
});

app.post('/Itemsdashboard',(req,res)=> {
    const x = req.body.items
    const nam=req.session.data.name;
    const item = new Item({
        item: x,
        tradername: nam,
        price : req.body.price
    })
   

    item.save()
    res.redirect('Itemsdashboard')
})

app.get('/restrict.html',(req,res)=>{
    res.render('restrict',{title:'Want to Restrict some user' })
});



const tradesaveItemSchema = {
    item: {
        required: [true, "Please enter name"],
        type: String,
    },
    price: {
        required: [true, "Please enter price"],
        type: String,
    },
    tradername: String
}

const saveItem = mongoose.model("tradesaveItem",tradesaveItemSchema)

app.get('/dashboard',(req,res)=>{

    saveItem.find({item:req.session.data.name}, (err,founditems)=> {
        console.log(founditems);
    //res.render('Itemsdashboard',{name:req.session.data.name,email:req.session.data.email,mobile:req.session.data.mobile,items: founditems});
    })
});

// app.post('/Itemsdashboard',(req,res)=> {
//     const x = req.body.items
//     const nam=req.session.data.name;
//     const item = new Item({
//         item: x,
//         tradername: nam,
//         price : req.body.price
//     })
   

//     item.save()
//     res.redirect('Itemsdashboard')
// })











//main Index file
app.get('/',(req,res)=>{
    if(req.session.isAuth){
        return res.render('index',{name:req.session.data.name});
    }
    else
    res.render('index',{name:'sign Up/Log in'});
});


//Signup page
app.get('/signUpPage.html',(req,res)=>{
    res.render('signUpPage',{});
});

app.get('/login.html',(req,res)=>{
    res.render('login',{});
});

app.get('/logintrader.html',(req,res)=>{
    res.render('logintrader',{});
});


//Fruits pages
app.get('/fruits.html',(req,res)=>{
    if (req.session.isAuth) {
        return res.render('fruits', { name: req.session.data.name });
    }
    else {
        res.render('fruits', { name: 'sign Up/Log in' });

    }
});

app.get('/fruit1.html', (req, res) => {
    // res.sendFile(__dirname+"/html/fruit1.html");
    traderSchema.find({ mobile: req.session.data.mobile }, (err, result1) => {
        //console.log(result1);
        var ele = new Array()
        result1.forEach(element1 => {
            Item.find({ item: "apple", tradername: element1.name }, (err, result) => {
                // console.log(result);
                result.forEach(elem => {
                    ele.push(elem)

                })
                //console.log(ele);
                res.render('fruit1', { da: ele });
                //ele.push(result) 
            });



        })


    })
});

app.get('/fruit2.html', (req, res) => {
    // res.sendFile(__dirname+"/html/fruit1.html");
    traderSchema.find({ mobile: req.session.data.mobile }, (err, result1) => {
        //console.log(result1);
        var ele = new Array()
        result1.forEach(element1 => {
            Item.find({ item: "mango", tradername: element1.name }, (err, result) => {
                // console.log(result);
                result.forEach(elem => {
                    ele.push(elem)

                })
                //console.log(ele);
                res.render('fruit2', { da: ele });
                //ele.push(result) 
            });


        })



    })
});

app.get('/fruit3.html', (req, res) => {
        // res.sendFile(__dirname+"/html/fruit1.html");
        traderSchema.find({ mobile: req.session.data.mobile }, (err, result1) => {
            //console.log(result1);
            var ele = new Array()
            result1.forEach(element1 => {
                Item.find({ item: "cranberry", tradername: element1.name }, (err, result) => {
                    // console.log(result);
                    result.forEach(elem => {
                        ele.push(elem)

                    })
                    //console.log(ele);
                    res.render('fruit3', { da: ele });
                    //ele.push(result) 
                });


            })



        })
    });


app.get('/fruit4.html', (req, res) => {
       // res.sendFile(__dirname+"/html/fruit1.html");
       traderSchema.find({ mobile: req.session.data.mobile }, (err, result1) => {
        //console.log(result1);
        var ele = new Array()
        result1.forEach(element1 => {
            Item.find({ item: "pomegranate", tradername: element1.name }, (err, result) => {
                // console.log(result);
                result.forEach(elem => {
                    ele.push(elem)

                })
                //console.log(ele);
                res.render('fruit4', { da: ele });
                //ele.push(result) 
            });


        })



    })
});

app.get('/fruit5.html', (req, res) => {
         // res.sendFile(__dirname+"/html/fruit1.html");
         traderSchema.find({ mobile: req.session.data.mobile }, (err, result1) => {
            //console.log(result1);
            var ele = new Array()
            result1.forEach(element1 => {
                Item.find({ item: "grapes", tradername: element1.name }, (err, result) => {
                    // console.log(result);
                    result.forEach(elem => {
                        ele.push(elem)
    
                    })
                    //console.log(ele);
                    res.render('fruit5', { da: ele });
                    //ele.push(result) 
                });
    
    
            })
    
    
    
        })
});

app.get('/fruit6.html', (req, res) => {
        // res.sendFile(__dirname+"/html/fruit1.html");
        traderSchema.find({ mobile: req.session.data.mobile }, (err, result1) => {
            //console.log(result1);
            var ele = new Array()
            result1.forEach(element1 => {
                Item.find({ item: "banana", tradername: element1.name }, (err, result) => {
                    // console.log(result);
                    result.forEach(elem => {
                        ele.push(elem)
    
                    })
                    //console.log(ele);
                    res.render('fruit6', { da: ele });
                    //ele.push(result) 
                });
    
    
            })
    
    
    
        })
});

app.get('/fruit7.html', (req, res) => {
      // res.sendFile(__dirname+"/html/fruit1.html");
      traderSchema.find({ mobile: req.session.data.mobile }, (err, result1) => {
        //console.log(result1);
        var ele = new Array()
        result1.forEach(element1 => {
            Item.find({ item: "pineapple", tradername: element1.name }, (err, result) => {
                // console.log(result);
                result.forEach(elem => {
                    ele.push(elem)

                })
                //console.log(ele);
                res.render('fruit7', { da: ele });
                //ele.push(result) 
            });


        })



    })
});

app.get('/fruit8.html', (req, res) => {
     // res.sendFile(__dirname+"/html/fruit1.html");
     traderSchema.find({ mobile: req.session.data.mobile }, (err, result1) => {
        //console.log(result1);
        var ele = new Array()
        result1.forEach(element1 => {
            Item.find({ item: "kiwi", tradername: element1.name }, (err, result) => {
                // console.log(result);
                result.forEach(elem => {
                    ele.push(elem)

                })
                //console.log(ele);
                res.render('fruit8', { da: ele });
                //ele.push(result) 
            });


        })



    })
});

//boys girl clothes
app.get('/cloths.html', (req, res) => {
    if (req.session.isAuth) {
        return res.render('cloths', { name: req.session.data.name });
    }
    else {
        res.render('cloths', { name: 'sign Up/Log in' });

    }
    
});

app.get('/cloth1.html', (req, res) => {
        // res.sendFile(__dirname+"/html/fruit1.html");
        traderSchema.find({ mobile: req.session.data.mobile }, (err, result1) => {
            //console.log(result1);
            var ele = new Array()
            result1.forEach(element1 => {
                Item.find({ item: "cloth1", tradername: element1.name }, (err, result) => {
                    // console.log(result);
                    result.forEach(elem => {
                        ele.push(elem)
    
                    })
                    //console.log(ele);
                    res.render('cloth1', { da: ele });
                    //ele.push(result) 
                });
    
    
            })
    
    
    
        })
});

app.get('/cloth2.html', (req, res) => {
        // res.sendFile(__dirname+"/html/fruit1.html");
        traderSchema.find({ mobile: req.session.data.mobile }, (err, result1) => {
            //console.log(result1);
            var ele = new Array()
            result1.forEach(element1 => {
                Item.find({ item: "cloth2", tradername: element1.name }, (err, result) => {
                    // console.log(result);
                    result.forEach(elem => {
                        ele.push(elem)
    
                    })
                    //console.log(ele);
                    res.render('cloth2', { da: ele });
                    //ele.push(result) 
                });
    
    
            })
    
    
    
        })
});

app.get('/cloth3.html', (req, res) => {
         // res.sendFile(__dirname+"/html/fruit1.html");
         traderSchema.find({ mobile: req.session.data.mobile }, (err, result1) => {
            //console.log(result1);
            var ele = new Array()
            result1.forEach(element1 => {
                Item.find({ item: "cloth3", tradername: element1.name }, (err, result) => {
                    // console.log(result);
                    result.forEach(elem => {
                        ele.push(elem)
    
                    })
                    //console.log(ele);
                    res.render('cloth3', { da: ele });
                    //ele.push(result) 
                });
    
    
            })
    
    
    
        })
});

app.get('/cloth4.html', (req, res) => {
        // res.sendFile(__dirname+"/html/fruit1.html");
        traderSchema.find({ mobile: req.session.data.mobile }, (err, result1) => {
            //console.log(result1);
            var ele = new Array()
            result1.forEach(element1 => {
                Item.find({ item: "cloth4", tradername: element1.name }, (err, result) => {
                    // console.log(result);
                    result.forEach(elem => {
                        ele.push(elem)
    
                    })
                    //console.log(ele);
                    res.render('cloth4', { da: ele });
                    //ele.push(result) 
                });
    
    
            })
    
    
    
        })
});

app.get('/cloth5.html', (req, res) => {
        // res.sendFile(__dirname+"/html/fruit1.html");
        traderSchema.find({ mobile: req.session.data.mobile }, (err, result1) => {
            //console.log(result1);
            var ele = new Array()
            result1.forEach(element1 => {
                Item.find({ item: "cloth5", tradername: element1.name }, (err, result) => {
                    // console.log(result);
                    result.forEach(elem => {
                        ele.push(elem)
    
                    })
                    //console.log(ele);
                    res.render('cloth5', { da: ele });
                    //ele.push(result) 
                });
    
    
            })
    
    
    
        })
});

app.get('/cloth6.html', (req, res) => {
        // res.sendFile(__dirname+"/html/fruit1.html");
        traderSchema.find({ mobile: req.session.data.mobile }, (err, result1) => {
            //console.log(result1);
            var ele = new Array()
            result1.forEach(element1 => {
                Item.find({ item: "cloth6", tradername: element1.name }, (err, result) => {
                    // console.log(result);
                    result.forEach(elem => {
                        ele.push(elem)
    
                    })
                    //console.log(ele);
                    res.render('cloth6', { da: ele });
                    //ele.push(result) 
                });
    
    
            })
    
    
    
        })
});

app.get('/cloth7.html', (req, res) => {
        // res.sendFile(__dirname+"/html/fruit1.html");
        traderSchema.find({ mobile: req.session.data.mobile }, (err, result1) => {
            //console.log(result1);
            var ele = new Array()
            result1.forEach(element1 => {
                Item.find({ item: "cloth7", tradername: element1.name }, (err, result) => {
                    // console.log(result);
                    result.forEach(elem => {
                        ele.push(elem)
    
                    })
                    //console.log(ele);
                    res.render('cloth7', { da: ele });
                    //ele.push(result) 
                });
    
    
            })
    
    
    
        })
});



//Mens Section
app.get('/mens.html', (req, res) => {
    if (req.session.isAuth) {
        return res.render('mens', { name: req.session.data.name });
    }
    else {
        res.render('mens', { name: 'sign Up/Log in' });

    }
    
     
});

app.get('/product1.html', (req, res) => {
       // res.sendFile(__dirname+"/html/fruit1.html");
       traderSchema.find({ mobile: req.session.data.mobile }, (err, result1) => {
        //console.log(result1);
        var ele = new Array()
        result1.forEach(element1 => {
            Item.find({ item: "product1", tradername: element1.name }, (err, result) => {
                // console.log(result);
                result.forEach(elem => {
                    ele.push(elem)

                })
                //console.log(ele);
                res.render('product1', { da: ele });
                //ele.push(result) 
            });


        })



    })
});
app.get('/product2.html', (req, res) => {
      // res.sendFile(__dirname+"/html/fruit1.html");
      traderSchema.find({ mobile: req.session.data.mobile }, (err, result1) => {
        //console.log(result1);
        var ele = new Array()
        result1.forEach(element1 => {
            Item.find({ item: "product2", tradername: element1.name }, (err, result) => {
                // console.log(result);
                result.forEach(elem => {
                    ele.push(elem)

                })
                //console.log(ele);
                res.render('product2', { da: ele });
                //ele.push(result) 
            });


        })



    })
});

app.get('/product3.html', (req, res) => {
     // res.sendFile(__dirname+"/html/fruit1.html");
     traderSchema.find({ mobile: req.session.data.mobile }, (err, result1) => {
        //console.log(result1);
        var ele = new Array()
        result1.forEach(element1 => {
            Item.find({ item: "product3", tradername: element1.name }, (err, result) => {
                // console.log(result);
                result.forEach(elem => {
                    ele.push(elem)

                })
                //console.log(ele);
                res.render('product3', { da: ele });
                //ele.push(result) 
            });


        })



    })
});

app.get('/product4.html', (req, res) => {
        // res.sendFile(__dirname+"/html/fruit1.html");
        traderSchema.find({ mobile: req.session.data.mobile }, (err, result1) => {
            //console.log(result1);
            var ele = new Array()
            result1.forEach(element1 => {
                Item.find({ item: "product4", tradername: element1.name }, (err, result) => {
                    // console.log(result);
                    result.forEach(elem => {
                        ele.push(elem)
    
                    })
                    //console.log(ele);
                    res.render('product4', { da: ele });
                    //ele.push(result) 
                });
    
    
            })
    
    
    
        })
});

app.get('/product5.html', (req, res) => {
        // res.sendFile(__dirname+"/html/fruit1.html");
        traderSchema.find({ mobile: req.session.data.mobile }, (err, result1) => {
            //console.log(result1);
            var ele = new Array()
            result1.forEach(element1 => {
                Item.find({ item: "product5", tradername: element1.name }, (err, result) => {
                    // console.log(result);
                    result.forEach(elem => {
                        ele.push(elem)
    
                    })
                    //console.log(ele);
                    res.render('product5', { da: ele });
                    //ele.push(result) 
                });
    
    
            })
    
    
    
        })
});

app.get('/product6.html', (req, res) => {
         // res.sendFile(__dirname+"/html/fruit1.html");
         traderSchema.find({ mobile: req.session.data.mobile }, (err, result1) => {
            //console.log(result1);
            var ele = new Array()
            result1.forEach(element1 => {
                Item.find({ item: "product6", tradername: element1.name }, (err, result) => {
                    // console.log(result);
                    result.forEach(elem => {
                        ele.push(elem)
    
                    })
                    //console.log(ele);
                    res.render('product6', { da: ele });
                    //ele.push(result) 
                });
    
    
            })
    
    
    
        })
});
app.get('/product7.html', (req, res) => {
       // res.sendFile(__dirname+"/html/fruit1.html");
       traderSchema.find({ mobile: req.session.data.mobile }, (err, result1) => {
        //console.log(result1);
        var ele = new Array()
        result1.forEach(element1 => {
            Item.find({ item: "product7", tradername: element1.name }, (err, result) => {
                // console.log(result);
                result.forEach(elem => {
                    ele.push(elem)

                })
                //console.log(ele);
                res.render('product7', { da: ele });
                //ele.push(result) 
            });


        })



    })
});

app.get('/product8.html', (req, res) => {
         // res.sendFile(__dirname+"/html/fruit1.html");
         traderSchema.find({ mobile: req.session.data.mobile }, (err, result1) => {
            //console.log(result1);
            var ele = new Array()
            result1.forEach(element1 => {
                Item.find({ item: "product8", tradername: element1.name }, (err, result) => {
                    // console.log(result);
                    result.forEach(elem => {
                        ele.push(elem)
    
                    })
                    //console.log(ele);
                    res.render('product8', { da: ele });
                    //ele.push(result) 
                });
    
    
            })
    
    
    
        })
});

app.get('/product9.html', (req, res) => {
        // res.sendFile(__dirname+"/html/fruit1.html");
        traderSchema.find({ mobile: req.session.data.mobile }, (err, result1) => {
            //console.log(result1);
            var ele = new Array()
            result1.forEach(element1 => {
                Item.find({ item: "product9", tradername: element1.name }, (err, result) => {
                    // console.log(result);
                    result.forEach(elem => {
                        ele.push(elem)
    
                    })
                    //console.log(ele);
                    res.render('product9', { da: ele });
                    //ele.push(result) 
                });
    
    
            })
    
    
    
        })
});

app.get('/product10.html', (req, res) => {
         // res.sendFile(__dirname+"/html/fruit1.html");
         traderSchema.find({ mobile: req.session.data.mobile }, (err, result1) => {
            //console.log(result1);
            var ele = new Array()
            result1.forEach(element1 => {
                Item.find({ item: "product10", tradername: element1.name }, (err, result) => {
                    // console.log(result);
                    result.forEach(elem => {
                        ele.push(elem)
    
                    })
                    //console.log(ele);
                    res.render('product10', { da: ele });
                    //ele.push(result) 
                });
    
    
            })
    
    
    
        })
});

app.get('/product11.html', (req, res) => {
      // res.sendFile(__dirname+"/html/fruit1.html");
      traderSchema.find({ mobile: req.session.data.mobile }, (err, result1) => {
        //console.log(result1);
        var ele = new Array()
        result1.forEach(element1 => {
            Item.find({ item: "product11", tradername: element1.name }, (err, result) => {
                // console.log(result);
                result.forEach(elem => {
                    ele.push(elem)

                })
                //console.log(ele);
                res.render('product11', { da: ele });
                //ele.push(result) 
            });


        })



    })
});
app.get('/product12.html', (req, res) => {
         // res.sendFile(__dirname+"/html/fruit1.html");
         traderSchema.find({ mobile: req.session.data.mobile }, (err, result1) => {
            //console.log(result1);
            var ele = new Array()
            result1.forEach(element1 => {
                Item.find({ item: "product12", tradername: element1.name }, (err, result) => {
                    // console.log(result);
                    result.forEach(elem => {
                        ele.push(elem)
    
                    })
                    //console.log(ele);
                    res.render('product12', { da: ele });
                    //ele.push(result) 
                });
    
    
            })
    
    
    
        })
});

app.get('/product13.html', (req, res) => {
        // res.sendFile(__dirname+"/html/fruit1.html");
        traderSchema.find({ mobile: req.session.data.mobile }, (err, result1) => {
            //console.log(result1);
            var ele = new Array()
            result1.forEach(element1 => {
                Item.find({ item: "product13", tradername: element1.name }, (err, result) => {
                    // console.log(result);
                    result.forEach(elem => {
                        ele.push(elem)
    
                    })
                    //console.log(ele);
                    res.render('product13', { da: ele });
                    //ele.push(result) 
                });
    
    
            })
    
    
    
        })
});

app.get('/product14.html', (req, res) => {
     // res.sendFile(__dirname+"/html/fruit1.html");
     traderSchema.find({ mobile: req.session.data.mobile }, (err, result1) => {
        //console.log(result1);
        var ele = new Array()
        result1.forEach(element1 => {
            Item.find({ item: "product14", tradername: element1.name }, (err, result) => {
                // console.log(result);
                result.forEach(elem => {
                    ele.push(elem)

                })
                //console.log(ele);
                res.render('product14', { da: ele });
                //ele.push(result) 
            });


        })



    })
});


app.get('/product15.html', (req, res) => {
         // res.sendFile(__dirname+"/html/fruit1.html");
         traderSchema.find({ mobile: req.session.data.mobile }, (err, result1) => {
            //console.log(result1);
            var ele = new Array()
            result1.forEach(element1 => {
                Item.find({ item: "product15", tradername: element1.name }, (err, result) => {
                    // console.log(result);
                    result.forEach(elem => {
                        ele.push(elem)
    
                    })
                    //console.log(ele);
                    res.render('product15', { da: ele });
                    //ele.push(result) 
                });
    
    
            })
    
    
    
        })
});

app.get('/product16.html', (req, res) => {
       // res.sendFile(__dirname+"/html/fruit1.html");
       traderSchema.find({ mobile: req.session.data.mobile }, (err, result1) => {
        //console.log(result1);
        var ele = new Array()
        result1.forEach(element1 => {
            Item.find({ item: "product16", tradername: element1.name }, (err, result) => {
                // console.log(result);
                result.forEach(elem => {
                    ele.push(elem)

                })
                //console.log(ele);
                res.render('product16', { da: ele });
                //ele.push(result) 
            });


        })



    })
});


//Dairys
app.get('/dairys.html', (req, res) => {
    if (req.session.isAuth) {
        return res.render('dairys', { name: req.session.data.name });
    }
    else {
        res.render('dairys', { name: 'sign Up/Log in' });

    }
});



//Staples
app.get('/staples.html', (req, res) => {
    if (req.session.isAuth) {
        return res.render('staples', { name: req.session.data.name });
    }
    else {
        res.render('staples', { name: 'sign Up/Log in' });

    }
});


app.get('/staple1.html', (req, res) => {
       // res.sendFile(__dirname+"/html/fruit1.html");
       traderSchema.find({ mobile: req.session.data.mobile }, (err, result1) => {
        //console.log(result1);
        var ele = new Array()
        result1.forEach(element1 => {
            Item.find({ item: "staple1", tradername: element1.name }, (err, result) => {
                // console.log(result);
                result.forEach(elem => {
                    ele.push(elem)

                })
                //console.log(ele);
                res.render('staple1', { da: ele });
                //ele.push(result) 
            });


        })



    })
});

app.get('/staple2.html', (req, res) => {
        // res.sendFile(__dirname+"/html/fruit1.html");
        traderSchema.find({ mobile: req.session.data.mobile }, (err, result1) => {
            //console.log(result1);
            var ele = new Array()
            result1.forEach(element1 => {
                Item.find({ item: "staple2", tradername: element1.name }, (err, result) => {
                    // console.log(result);
                    result.forEach(elem => {
                        ele.push(elem)
    
                    })
                    //console.log(ele);
                    res.render('staple2', { da: ele });
                    //ele.push(result) 
                });
    
    
            })
    
    
    
        })
});

app.get('/staple3.html', (req, res) => {
        // res.sendFile(__dirname+"/html/fruit1.html");
        traderSchema.find({ mobile: req.session.data.mobile }, (err, result1) => {
            //console.log(result1);
            var ele = new Array()
            result1.forEach(element1 => {
                Item.find({ item: "staple3", tradername: element1.name }, (err, result) => {
                    // console.log(result);
                    result.forEach(elem => {
                        ele.push(elem)
    
                    })
                    //console.log(ele);
                    res.render('staple3', { da: ele });
                    //ele.push(result) 
                });
    
    
            })
    
    
    
        })
});


app.get('/staple4.html', (req, res) => {
         // res.sendFile(__dirname+"/html/fruit1.html");
         traderSchema.find({ mobile: req.session.data.mobile }, (err, result1) => {
            //console.log(result1);
            var ele = new Array()
            result1.forEach(element1 => {
                Item.find({ item: "staple4", tradername: element1.name }, (err, result) => {
                    // console.log(result);
                    result.forEach(elem => {
                        ele.push(elem)
    
                    })
                    //console.log(ele);
                    res.render('staple4', { da: ele });
                    //ele.push(result) 
                });
    
    
            })
    
    
    
        })
});

app.get('/staple5.html', (req, res) => {
         // res.sendFile(__dirname+"/html/fruit1.html");
         traderSchema.find({ mobile: req.session.data.mobile }, (err, result1) => {
            //console.log(result1);
            var ele = new Array()
            result1.forEach(element1 => {
                Item.find({ item: "staple5", tradername: element1.name }, (err, result) => {
                    // console.log(result);
                    result.forEach(elem => {
                        ele.push(elem)
    
                    })
                    //console.log(ele);
                    res.render('staple5', { da: ele });
                    //ele.push(result) 
                });
    
    
            })
    
    
    
        })
});

app.get('/staple6.html', (req, res) => {
        // res.sendFile(__dirname+"/html/fruit1.html");
        traderSchema.find({ mobile: req.session.data.mobile }, (err, result1) => {
            //console.log(result1);
            var ele = new Array()
            result1.forEach(element1 => {
                Item.find({ item: "staple6", tradername: element1.name }, (err, result) => {
                    // console.log(result);
                    result.forEach(elem => {
                        ele.push(elem)
    
                    })
                    //console.log(ele);
                    res.render('staple6', { da: ele });
                    //ele.push(result) 
                });
    
    
            })
    
    
    
        })
});
app.get('/staple7.html', (req, res) => {
       // res.sendFile(__dirname+"/html/fruit1.html");
       traderSchema.find({ mobile: req.session.data.mobile }, (err, result1) => {
        //console.log(result1);
        var ele = new Array()
        result1.forEach(element1 => {
            Item.find({ item: "staple7", tradername: element1.name }, (err, result) => {
                // console.log(result);
                result.forEach(elem => {
                    ele.push(elem)

                })
                //console.log(ele);
                res.render('staple7', { da: ele });
                //ele.push(result) 
            });


        })



    })
});
app.get('/staple8.html', (req, res) => {
       // res.sendFile(__dirname+"/html/fruit1.html");
       traderSchema.find({ mobile: req.session.data.mobile }, (err, result1) => {
        //console.log(result1);
        var ele = new Array()
        result1.forEach(element1 => {
            Item.find({ item: "staple8", tradername: element1.name }, (err, result) => {
                // console.log(result);
                result.forEach(elem => {
                    ele.push(elem)

                })
                //console.log(ele);
                res.render('staple8', { da: ele });
                //ele.push(result) 
            });


        })



    })
});


app.use(express.static(path.join(__dirname, 'public')));

app.listen(port,function(req,res){
    console.log("Server is running Successfully");


});

// buy section
require('dotenv').config()


app.use(express.json())
app.use(express.static('public'))

const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY)




// traderSchema.find({mobile:req.session.data.mobile},(err,result1)=>{
//     let ele = new Array()
//     let max = 1000;
//     result1.forEach(element1 => {
//            Item.find({item:"apple",tradername:element1.name},(err,result)=>{
//           console.log(result);
//            result.forEach(elem => {
//                ele.push(elem)
//                if(elem.price<max)
//                max = elem; 

//            })      
//     });
// })    

// })



app.get("/cart",function(req,res){

res.render("cartform",{});
})




Item.find({item:"apple"},(err,result)=>{

    const storeItems = new Map([
      [1, { price: result[0].price*100, name: "Mango" }]
  ])


    
app.post('/create-checkout-session', async(req, res) => {
console.log(req.body.item);
console.log(req.body.items);


const item = new Item({
    item: req.body.buyer,
    tradername: req.body.seller,
    price : req.body.item
})

item.save();



        try {
            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                mode: 'payment',
                line_items:[{price_data: {
                                currency: 'usd',
                                product_data: {
                                    name: 'rgtrgtrg'
                                },
                                unit_amount: req.body.item
                            },
                            quantity: 1}],
                // line_items: req.body.items.map(item => {
                //     const storeItem = storeItems.get(item.id)
                //     return {
                //         price_data: {
                //             currency: 'usd',
                //             product_data: {
                //                 name: 'rgtrgtrg'
                //             },
                //             unit_amount: storeItem.price
                //         },
                //         quantity: 1
                //     }
                // }),
    
                success_url: `${process.env.SERVER_URL}/success.html`,
                cancel_url: `${process.env.SERVER_URL}/cancel.html`
            })
            console.log(session)
            res.redirect(`${session.url}`)
            // res.json({ url: session.url })
        } catch (err) {
            console.log(err)
            res.status(500).json({ error: err.message })
        }
    
    }) 
});







