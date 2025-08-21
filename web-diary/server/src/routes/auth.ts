import express, { Request, Response } from 'express';
import { register, login, logout, getUser, changeUsername, changePassword, changeEmail } from '../controllers/auth';
import passport from 'passport';
import authenticateJWT from '../middlewares/auth';
import { error } from 'console';
var router = express.Router();

router.post('/login', login);

router.post('/logout', logout);

router.post('/register', register);

router.get('/google', passport.authenticate("google", { scope: ["profile", "email"] }));

router.get('/google/callback', passport.authenticate("google", {
    successRedirect: process.env.CLIENT_URL,
    failureRedirect: "/login/failed/"
}))

router.get('/login/failed', (req, res) => {
    res.status(401).json({
        error: true,
        message: "Failed to Login !"
    })
})

router.get('/login/success', (req, res) => {
    if(req.user) {
        res.status(200).json({
            error: false,
            message: "Successfully Logged In !",
            user: req.user
        })
    } else {
        res.status(403).json({
            error: true,
            message: "Not Authorized !"
        })
    }
    
})

router.get('/me', passport.authenticate('session'), getUser);

router.put('/user/change-username',authenticateJWT, changeUsername);

router.put('/user/change-password', authenticateJWT, changePassword);

router.put('/user/change-email', authenticateJWT, changeEmail);

export default router;  