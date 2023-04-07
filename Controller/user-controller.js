import User from "../Model/User"
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
const jwt_Secret_Key = "Mykey";
const jwt_Refresh_Secret_Key = "MyRefreshKey";
export const getAllUsers = async (req, res) => {
    let users;
    try {
        users = await User.find();
    }
    catch (err) {
        return console.log(err);
    }
    if (!users) {
        return res.status(500).json({ message: "Unexpected error Occured" })
    }
    return res.status(200).json({ users });
};

let REFRESHTOKEN = [];

export const refreshToken = (req, res) => {
    // const cookies = req.headers.cookie;
    const refreshToken = req.body.token;
    if (!refreshToken) {
        return res.status(400).json({ message: "User not authenticated" });
    }
    if (REFRESHTOKEN.includes(!refreshToken)) {
        return res.status(403).json("Refresh token is not valid!");
    }
    jwt.verify(refreshToken, jwt_Refresh_Secret_Key, (err, user) => {
        if (err) {
            console.log(err);
            return res.status(403).json({ message: "Authentication failed" });
        }
        REFRESHTOKEN = REFRESHTOKEN.filter((token) => token !== refreshToken);
        const newAccressToken = jwt.sign({ id: user.id }, jwt_Secret_Key);
        const newRefreshToken = jwt.sign({ id: user.id }, jwt_Refresh_Secret_Key);
        REFRESHTOKEN.push(newRefreshToken);
        return res.status(200).json({ newAccressToken, newRefreshToken });
    });
}


export const signUp = async (req, res, next) => {
    const { name, email, password, profilePic } = req.body;
    /* if (!name && name.trim() === "" &&
         !email && email.trim() === "" &&
         !password && password.trim() === "") { return res.status(422).json({ message: "Invalid Inputs" }); }*/
    //if an user already exists
    let existingUser;
    try {
        existingUser = await User.findOne({ email });
    }
    catch (err) {
        return console.log(err);
    }
    if (existingUser) {
        return res.status(400).json({ message: "User Already Exists! Login Instead" });
    }

    //if an user doesn't exist then add its information

    // const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password);
    let user;
    try {
        user = new User({
            name, email, password: hashedPassword, profilePic,
        });
        user = await user.save();
    }
    catch (err) {
        return console.log(err);
    }
    if (!user) {
        return res.status(500).json({ message: "Unexpected error Occured" });
    }
    return res.status(202).json({ user })
}

export const login = async (req, res, next) => {
    const { email, password } = req.body;
    let existingUser;
    try {
        existingUser = await User.findOne({ email });
    }
    catch (err) {
        return console.log(err);
    }
    if (!existingUser) {
        //return res.status(400).json({message:"User Already Exists! Login Instead"});
        return res.status(404).json({ message: "Couldn't find User with this Email" });
    }
    const isPasswordCorrect = bcrypt.compareSync(password, existingUser.password);
    if (!isPasswordCorrect) {
        return res.status(400).json({ message: "Invalid Email/Incorrect password" });
    }
    //jwt token given by server

    const Accesstoken = jwt.sign({ id: existingUser.id }, jwt_Secret_Key);
    const Refreshtoken = jwt.sign({ id: existingUser.id }, jwt_Refresh_Secret_Key);
    REFRESHTOKEN.push(Refreshtoken);
    //console.log("Generated Token\n", token);
    return res.status(200).json({ message: "Login Successfull", user: existingUser, Accesstoken, Refreshtoken });


}


export const verifyToken = (req, res, next) => {
    //const cookies = req.headers.cookie;
    const headers = req.headers.authorization;
    //console.log(headers);
    const token = headers.split(" ")[1];
    //console.log(token);
    if (!token) {
        res.status(404).json({ message: "No token found" });
    }
    jwt.verify(token, jwt_Secret_Key, (err, user) => {
        if (err) {
            //console.log(err)
            return res.status(400).json({ message: "Invalid Token" });
        }
        console.log({ user });
        req.user = user;
    });
    next();
}

export const deleteId = async (req, res) => {
    const id = req.params.userId;
    console.log(req.user.id);
    // req.user.id we get it from verifyToken: req.user
    //req.params.id to get the id given as route parameter in link

    if (req.user.id === id) {
        //User.remove({ _id: req.params.id });
        await User.findByIdAndDelete(req.user.id);
        res.status(200).json("User has been deleted.");
    } else {
        res.status(403).json("You are not allowed to delete this user!");
    }
};

//logging out use only refreshtoken
export const logout = async (req, res) => {
    const refreshToken = req.body.token;
    REFRESHTOKEN = REFRESHTOKEN.filter((token) => token !== refreshToken);
    res.status(200).json("You logged out successfully.");
};
export const getUser = async (req, res) => {

    const username = req.params.username;

    /*try {
        const user =
            await User.findByName({ username: username });
        const { password, updatedAt, ...other } = user._doc;
        res.status(200).json(other);
    } catch (err) {
        res.status(500).json(err);
    }*/
    let user;
    try {
        user = await User.findOne({ 'name': req.params.username });
    }
    catch (err) {
        return console.log(err);
    }
    if (!user) {
        return res.status(500).json({ message: "Unexpected error Occured" })
    }
    return res.status(200).json({ user });
};
export const getUserById = async (req, res, next) => {
    const userId = req.params.id;
    let user;
    try {
        user = await User.findById(req.params.id);
    } catch (err) {
        return new Error(err);
    }
    if (!user) {
        return res.status(404).json({ messsage: "User Not FOund" });
    }
    return res.status(200).json({ user });
};