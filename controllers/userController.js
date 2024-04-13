const { User } = require("../middlewares/userModel")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const userSignUp = async(req, res) => {
    try{

        const {username, email, phone_number, password} = req.body

        let check_user = await User.findOne({email})
        if(check_user) {
            return res.status(401).json({
                message : "This email is already registed!"
            })
        }

        check_user = await User.findOne({phone_number})
        if(check_user) {
            return res.status(409).json({
                message : "This mobile number is already registed!"
            })
        }

        const hash_password = await bcrypt.hash(password, 10)

        const new_user = await User.create({
            username,
            email,
            phone_number,
            password : hash_password,
            active : true
        })

        res.status(201).json({
            message : "New user created!",
            data : new_user
        })


    }
    catch(error) {
        console.log(error.message) 
        return res.status(500).json({
            message : "Interal Server Error",
            data : ""
        })
    }
}

const userLogIn = async(req, res) => {
    try{
        const {password} = req.body;

        let isUser;
        if(req.body.email) {
            isUser = await User.findOne({email : req.body.email})
        }
        else if(req.body.phone_number) {
            isUser = await User.findOne({phone_number : req.body.phone_number})
        }

        if(!isUser) {
            return res.status(401).json({
                message : "Signup First!"
            })
        }

    
        bcrypt.compare(password, isUser.password, (error, result) => {
            if(error) {
                return res.status(401).json({
                    message : "Incorrect Password!"
                })
            }
            else{
                const payload = {
                    user_id  : isUser._id,
                    role : isUser.role,
                    active : isUser.active
                }
                jwt.sign(payload, process.env.JWT_SECRET_KEY, (err, token) => {
                    if(err) {
                        return res.status(401).json({
                            success : false,
                            message : "Error while creating jwt token"
                        }) 
                    }
                    else{
                        const cookie_option = {
                            httpOnly : true,
                            expires : new Date(Date.now() + 2*24*60*60*1000)
                        }
                        res.cookie(process.env.LOGIN_AUTH_TOKEN_NAME, token, cookie_option)

                        res.status(200).json({
                            message : "Welcome to olx!"
                        })
                    }
                })
            }
        })

    }
    catch(error) {
        console.log(error.message) 
        return res.status(500).json({
            message : "Interal Server Error",
            data : ""
        })
    }
}

// const userSignUp = async(req, res) => {
//     try{

//     }
//     catch(error) {
//         console.log(error.message) 
//         return res.status(500).json({
//             message : "Interal Server Error",
//             data : ""
//         })
//     }
// }