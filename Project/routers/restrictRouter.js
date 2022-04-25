const express=require('express');
const app = express();
const Router =express.Router();
app.use(express.json());
app.use(express.urlencoded({extended:false}));
const userSchema=require('./models/restrictSchema');

Router.get("/",function(req,res){
    res.render('restrict',{title:'Lets Restrict',password:'',email:''});
});

//Router.post('/register',async(req,res)=>{
  //  console.log(req.body);
    // try {
    //     const name=req.body.name;
    //     const email=req.body.email;
    //     const password=req.body.password;
    //     const mobile=req.body.mobile;
    //     console.log(name);
       
    // } catch (error) {
    // res.render('register',{title:'Error in Code',password:'',email:''});
    // console.log(error);
    // }

//});


module.exports = Router;