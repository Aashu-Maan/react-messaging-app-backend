const express = require("express");
const userSchema = require("../Modules/Users.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userAuth = require("../Middlewares/UserAuth.js");

const userRouter = express.Router();

userRouter.post("/signup", async (req, res) => {
  const {name, emailId, password} = req.body;
  try {
    const userDetails = new userSchema({
      name, 
      emailId,
      password
    });
    await userDetails.save()
    if(!userDetails) {
      throw new Error ("User not saved")
    }
    res.json({
      message: "User saved succesfully"
    })
  } catch (error) {
    res.json({
      error: error.message
    })
  }
})


userRouter.post("/login", async (req, res) => {
  const { emailId, password } = req.body;

  try {
    const isUser = await userSchema.findOne({ emailId });

    if (!isUser) {
      return res.status(400).json({ message: "No user found" });
    }

    if (!password) {
      return res.status(400).json({ message: "Please enter password" });
    }

    if (isUser.password === password) {
      const token = jwt.sign(
        { id: isUser._id },
        "aashu@2000",
        { expiresIn: "1h" }
      );

      // ✅ set cookie with proper options
      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none"
      });

      return res.json({
        message: "User logged in",
        User: isUser,
      });
    } else {
      return res.status(400).json({ message: "Password not matched" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
userRouter.get("/users", userAuth, async (req, res) => {
  const loggedInUser = req.user;
  try {
    
    console.log(loggedInUser._id) 
    const users =  await userSchema.find();
const getUsers = users.filter(user => user._id.toString() !== loggedInUser._id.toString())
    if(getUsers.length === 0) {
      throw new  Error ("No user found")
    }
    res.json({
     accountUser: loggedInUser,
     users: getUsers
    })
  } catch (error) {
    res.status(400).json({error: error.message})
  }
})

userRouter.get("/chat/:targetUserId", userAuth, async (req, res)=> {
  const {targetUserId} = req.params;
  try {
    const user = await userSchema.findById(targetUserId)
    if(!user) {
      throw new Error ("user not found")
    }
    res.json({
     user
    })
  } catch (error) {
    res.json({error: error.message})
  }
})

userRouter.post("/logout", async (req, res) => {
  try {
    res.clearCookie("token");
    res.json({message: "loggedout sucessfully"})
  } catch (error) {
    res.json({error: error.message})
  }
})

module.exports = userRouter;