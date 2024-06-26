const jwt = require('jsonwebtoken');

module.exports= function(req,res,next){

    const token=req.header('auth-token');
    if(!token){
        return res.status(401).send({"errors": [{
            "type": "auth",
            "msg": "Access denied !",
            "location": "header"
        }]})
    }
    //Verifiy the token
    try{
        const verified=jwt.verify(token,'SUPERKEYSECRETCRTRAVEL2024');
        req.user = verified;
        next(); 
    }catch(error){
        res.status(400).send({"errors": [{
            "type": "token",
            "msg": "Invalid token !",
            "location": "header"
        }]});
    }

}