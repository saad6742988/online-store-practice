const mongoose =require('mongoose')
const express=require('express')
const bodyParser=require('body-parser');
const cookieParser=require('cookie-parser');
const cors=require('cors');
require('dotenv').config()
const e=express();
const authRoutes=require('./routes/auth')
const userRoutes=require('./routes/user')


const User=require('./models/user')
const Category =require('./models/category')
const Product =require('./models/product')

mongoose.connect(process.env.DataBase,
{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useCreateIndex:true
}).then(()=>{console.log('DB Connected')})

//middlewares
e.use(bodyParser.json())
e.use(cookieParser())
e.use(cors())


//routes
e.get('/',(req,res)=>
{
    res.send(<>
    <h1>Saad's store backend hosting</h1>
    </>)
})
e.use('/api',authRoutes)
e.use('/api',userRoutes)


e.listen(process.env.PORT||8000,()=>{console.log('listening express server from heroku')})
