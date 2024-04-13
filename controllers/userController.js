const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const otpGenerator = require('otp-generator')


const { User } = require("../middlewares/userModel")
const { sendEmail } = require("../config/emailSetup")


const sendOtpViaEmail = (user) => {
    sendEmail(user.email, user.user_name, user.otp)

    setTimeout(async function() {
        try{
            user.otp = 0;
            console.log('userToken removed successfully after 30 seconds');
            user.save();
        }
        catch(error) {
            console.log("Error in removing otp: ", error.message)
        }
    }, 30*1000)
}

const otpVerification = (isUser, otp) => {
    if(!isUser) {
        return {
            status : 401,
            valid : false,
            message : "This user doesn't even exists!"
        }
    }
    if(isUser.otp === 0) {
        return {
            status : 409,
            valid : false,
            message : "OTP expired, try again!"
        }    
    }

    if(isUser.otp !== otp){
        return {
            status : 410,
            valid : false,
            message : "OTP doesn't match, try again!"
        }
    }

    return {
        status : 200,
        valid : true,
        message : ""
    }
}
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

        const otp = otpGenerator.generate(6, { 
            upperCaseAlphabets: false, 
            lowerCaseAlphabets: false,
            specialChars : false
         });

         
         const new_user = await User.create({
             username,
             email,
             phone_number,
             password : hash_password,
             otp
            })

        sendOtpViaEmail(new_user)



        // Mei isko redirect karna chahta hu to otp page directly!
        // means userSignUpVerify ye function run hoga iske baad
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

const userSignUpVerify = async (req, res) => {
    try{
        const {email, otp} = req.body;
        const isUser = await User.findOne({email : email})

        const {status, valid, message } = otpVerification(isUser, otp)

        if(!valid) {
            return res.status(status).json({
                success : valid,
                message
            })
        }
        // OTP matched
        isUser.active = true;
        isUser.save();
        res.status(201).json({
            success : true,
            message : "User actived!",
            data : isUser
        })

    } catch(error) {
        console.log(error.message)

        return res.status(500).json({
            success : false,
            message : "Unknown error while verifying user!"
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

        if(isUser.active == false) {
            return res.status(401).json({
                message : "This user is not active right now!"
            })     
        }

    
        bcrypt.compare(password, isUser.password, (error, result) => {

            if(result){
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
            else {
                return res.status(401).json({
                    message : "Incorrect Password!"
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

const userForgotPassword = async (req, res) => {
    try{

        const {email} = req.body
        const isUser = await User.findOne({email : email})
        if(!isUser) {
            return res.status(404).json({
                success : false,
                message : "This user doesn't exists!"
            })
        }

        // Similar to signing up
        const otp = otpGenerator.generate(6, {
            upperCaseAlphabets : false,
            lowerCaseAlphabets : false,
            specialChars : false
        })
        isUser.otp = otp;
        isUser.save();

        sendOtpViaEmail(isUser)

        // redirect to forgotPasswordVefiryURL
        res.json({
            message : "First part done, email sent",
            data : isUser
        })

    } catch(error) {
        return res.status(500).json({
            success : false,
            message : "Unknown error while forgot password!"
        })
    }
}

const forgotPasswordVerify = async (req, res) => {
    try{
        // ye joh email hai, ye wahin se utha lo jab user forgot pei aaye
        // fir iski req.body pei fenk maaro, simple chhe rey, simple
        const {email, otp} = req.body;
        const isUser = await User.findOne({email : email})

        const {status, valid, message } = otpVerification(isUser, otp)

        if(!valid) {
            return res.status(status).json({
                success : valid,
                message : message
            })
        }
        // OTP matched
        // Redirect to setNewPassword
        res.json({
            message : "second part done, otp verified",
            data : isUser
        })

    }
    catch(error) {
        return res.status(500).json({
            success : false,
            message : "Unknown error while log in!"
        })
    }
}
const setNewPassword = async(req, res) => {
    try{
        const {email, new_password} = req.body;

        
        const isUser = await User.findOne({email : email})

        // Ye check karne ki load nahi hai, email ham abhi bhi pichhla hi uthha rahe hai, joh already checked hai, so we can remove this line in feature
        if(!isUser) {
            return res.status(404).json({
                success : false,
                message : "This user doesn't exists!"
            })
        }
        const hash_pass = await bcrypt.hash(new_password, 10)
        const updated_user = await User.findByIdAndUpdate({_id : isUser._id} , {password : hash_pass}, {new : true})

        res.status(200).json({
            success : true,
            message : "Password upated!",
            data : updated_user
        })

    } catch(error) {
        return res.status(500).json({
            success : false,
            message : "Unknown error while log in!"
        })
    }
}

const resetPassword = async (req, res) => {
    try{
        const {_id, old_password, new_password} = req.body;

        const user = await User.findOne({_id})

        if (await bcrypt.compare(old_password, user.password)) {

            const hash_pass = await bcrypt.hash(new_password, 10)
            await User.findByIdAndUpdate({_id : _id}, {password : hash_pass}, {new : true})

            res.status(200).json({
                success : true,
                message : "Password reset successfully!"

            })
        }
        else{
            return res.status(401).json({
                success : false,
                message : "Enter the correct old password"
            }) 
        }
    }
    catch(error) {
        return res.status(500).json({
            success : false,
            message : "Unknown error while log in!"
        })
    }
}



module.exports = {
    userSignUp,
    userSignUpVerify,

    userLogIn, 

    userForgotPassword,
    forgotPasswordVerify,
    setNewPassword,

    resetPassword

}
