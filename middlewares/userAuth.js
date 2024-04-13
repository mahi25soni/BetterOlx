const jwt = require("jsonwebtoken")

const authentic = (req, res, next) => {
    try{
        const token = req.cookies[process.env.LOGIN_AUTH_TOKEN_NAME]
        if(!token) {
            return res.status(401).json({
                success : false,
                message : "Login!"
            }) 
        }

        jwt.verify(token, process.env.JWT_SECRET_KEY, (error, result) => {
            if(error) {
                return res.status(401).json({
                    success : false,
                    message : "There is some problem with auth token!"
                }) 
            }
            else{
                if(result.active === false) {
                    return res.status(401).json({
                        success : false,
                        message : "SignUp to BetterOlx to explore more!"
                    })    
                }
                req.user = result;
                next();
            }

        })
    }
    catch(error) {
        console.log(error.message)
        res.status(500).json({
            success : false,
            message : "Internal error while authenticating!"
        })
    }
}

const isCustomer = (req, res, next) => {
    try{
        if(req.user.role != "CUSTOMER") {
            return res.status(401).json({
                success : false,
                message : `Only customer can use this functionality `
            })   
        }
        next();

    }
    catch(error) {
        console.log(error.message)
        res.status(500).json({
            success : false,
            message : `Internal error while authorizing you as customer`
        })
    }
}


const isAdmin = (req, res, next) => {
    try{
        if(req.user.role != "ADMIN") {
            return res.status(401).json({
                success : false,
                message : `Only Admin can use this functionality `
            })   
        }
        next();

    }
    catch(error) {
        console.log(error.message)
        res.status(500).json({
            success : false,
            message : `Internal error while authorizing you as Admin`
        })
    }
}
module.exports = {
    authentic,
    isCustomer,
    isAdmin
}