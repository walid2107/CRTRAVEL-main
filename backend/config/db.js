const mongoose=require("mongoose");
const config=require("config");
const db=config.get("mongoURI");

//calling database

const connectDB= async ()=>{

    try{
        await mongoose.connect(db)
        console.log('MongoDB Connected..');

    }catch (err){
        console.error(err.message);
        // exit processus with failer
        process.exit(1);
    }

}

module.exports= connectDB;