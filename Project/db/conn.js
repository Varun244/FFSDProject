const mongoose =require('mongoose');

mongoose.connect("mongo://localhost:27017/FFSDProject",{
    newUrlParser:true,
    newUnifiedTopology:true,
    useCreateIndex:true
}).then(()=>{
    console.log('Connection Successfull');
}).catch((e)=>{
    console.log('No connEction');
})