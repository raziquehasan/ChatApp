import User from "../Models/userModels.js";
import bcryptjs from 'bcryptjs'
import jwtToken from '../utils/jwtwebToken.js'

export const userRegister = async (req, res) => {
    try {
        const { fullname, username, email, gender, password, profilepic } = req.body;
        console.log(req.body);
        const user = await User.findOne({ username, email });
        if (user) return res.status(500).send({ success: false, message: " UserName or Email Alredy Exist " });
        const hashPassword = bcryptjs.hashSync(password, 10);
        const profileBoy = profilepic || `https://avatar.iran.liara.run/public/boy?username=${username}`;
        const profileGirl = profilepic || `https://avatar.iran.liara.run/public/girl?username=${username}`;

        const newUser = new User({
            fullname,
            username,
            email,
            password: hashPassword,
            gender,
            profilepic: gender === "male" ? profileBoy : profileGirl
        })

        if (newUser) {
            await newUser.save();
            jwtToken(newUser._id, res)
        } else {
            res.status(500).send({ success: false, message: "Inavlid User Data" })
        }

        res.status(201).send({
            success: true,
            _id: newUser._id,
            fullname: newUser.fullname,
            username: newUser.username,
            profilepic: newUser.profilepic,
            email: newUser.email,
            gender: newUser.gender,
            message: "Registration Successful"
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error
        })
        console.log(error);
    }
}

export const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email })
        if (!user) return res.status(500).send({ success: false, message: "Email Dosen't Exist Register" })
        const comparePasss = bcryptjs.compareSync(password, user.password || "");
        if (!comparePasss) return res.status(500).send({ success: false, message: "Email Or Password dosen't Matching" })
        
        jwtToken(user._id, res);

        res.status(200).send({
            success: true,
            _id: user._id,
            fullname: user.fullname,
            username: user.username,
            profilepic: user.profilepic,
            email: user.email,
            gender: user.gender,
            message: "Successfully LogIn"
        })

    } catch (error) {
        console.log('Login error:', error);
        res.status(500).send({
            success: false,
            message: error.message || 'Internal server error'
        })
    }
}


export const userLogOut=async(req,res)=>{
    
    try {
        res.cookie("jwt",'',{
            maxAge:0
        })
        res.status(200).send({success:true ,message:"User LogOut"})

    } catch (error) {
        res.status(500).send({
            success: false,
            message: error
        })
        console.log(error);
    }
}