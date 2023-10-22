const express=require('express');
const app=express();
const mongoose=require('mongoose');
const dotenv=require('dotenv').config();
const cors=require('cors');
const authRoute=require('./routes/auth/auth');
const authDashboard=require('./routes/auth/authDashboard');
const port=3000;

mongoose.connect(process.env.DB_CONNECT, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('Connected to DB');
})
.catch(err => {
    console.error('Error connecting to the database', err);
});
app.use(express.json(),cors());

app.get('/',(req,res)=>{
    res.send('Hello World');
});

app.use('/api/user',authRoute);
app.use('/api/dashboard',authDashboard);

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
}); // listen to port 3000