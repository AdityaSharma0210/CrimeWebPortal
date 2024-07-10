var express = require('express');
var router = express.Router();
const nodemailer=require('nodemailer')
const googleApis=require("googleapis")
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("../models/userModel");
const userdetail=require("../models/inputModel")

passport.use(new LocalStrategy(User.authenticate()));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

const REDIRECT_URI = `https://developers.google.com/oauthplayground`;
const CLIENT_ID = `1001062450656-d01n8tvaal0ppd7f0n98h39krmspmqua.apps.googleusercontent.com`;
const CLIENT_SECRET = `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`;
const REFRESH_TOKEN = `1//04VASEQaXbIECCgYIARAAGAQSNwF-L9IrqQHlYp6MM9l6DL_aq2rg-cSzDji7aIz9EUobOxR228RhxKPqDneOekK8HAV3PTdeyxE`;
// const myAccessToken = myOAuth2Client.getAccessToken()

router.post('/send-mail', (req, res) => {
  const authClient = new googleApis.google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET,
    REDIRECT_URI);
  authClient.setCredentials({ refresh_token: REFRESH_TOKEN });

  async function mailer() {
    try {
      const ACCESS_TOKEN = await authClient.getAccessToken();
      const transport = nodemailer.createTransport({
        service: "gmail",
        auth: {
          type: "OAuth2",
          user: "pranshutripathi1234567@gmail.com",
          clientId: CLIENT_ID,
          clientSecret: CLIENT_SECRET,
          refreshToken: REFRESH_TOKEN,
          accessToken: ACCESS_TOKEN
        }
      })
      const details = {
        from: req.body.to,
        to: "pranshutripathi1234567@gmail.com",
        subject: req.body.subject,
        text: req.body.message,
        mobnom:req.body.mobnom,
        // html: `<a target="_blank" href="" style="color:red;"> Go to this link to reset your password </a>`
      }
      const result = await transport.sendMail(details);
      return result;
    }
    catch (err) {
      return err;
    }
  }
  mailer().then(response => {
    console.log("sent mail !", response);
    res.send('success');
  })
})


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-gmail-address@gmail.com',
    pass: 'your-gmail-password'
  }
});

transporter.on('message', (message) => {
  console.log('Sender:', message.envelope.from);
});


router.get("/register", function (req, res, next) {
  res.render("register", { title: "Signup", isuser: req.user });
});

router.post("/register", async function (req, res, next) {
  try {
      const { username, email, password } = req.body;
      await User.register({ username, email }, password);
      res.send("Your are succesfully Registered please Login");
  } catch (error) {
      res.send(error);
  }
});


router.post(
  "/login",
  passport.authenticate("local", {
      failureRedirect: "/",
      successRedirect: "/profile",
  }),
  function (req, res, next) {}
);

// router.get("/profile", isLoggedIn, async function (req, res, next) {
//   const pyq = await userdetail.find()
//   res.render("profile", {
//       title: "Profile",pyq,
//       isuser: req.user,

//   });
// });



router.get("/profile", isLoggedIn, async function (req, res, next) {
  const pyq = await User.find()
  const ryq=await userdetail.find()
  res.render("profile", {
      title: "Profile",pyq,ryq,
      isuser: req.user,

  });
});

router.get("/reset", isLoggedIn, function (req, res, next) {
  res.render("reset", { title: "Reset Password", isuser: req.user });
});

router.post("/reset", async function (req, res, next) {
  try {
      await req.user.changePassword(
          req.body.oldpassword,
          req.body.newpassword
      );
      res.redirect("/profile");
  } catch (error) {
      res.send(error);
  }
});

router.get("/forget", function (req, res, next) {
  res.render("forget", { title: "Forget Password", isuser: req.user });
});

router.post("/forget", async function (req, res, next) {
  try {
      const user = await User.findOne({ username: req.body.username });
      if (!user) return res.send("Invalid user");
      await user.setPassword(req.body.password);
      user.save();
      res.redirect("/login");
  } catch (error) {
      res.send(error);
  }
});

router.get("/logout", function (req, res, next) {
  req.logout(() => {
      res.redirect("/");
  });
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
      return next();
  }
  res.redirect("/login");
}
// router.post("/message",async (req,res)=>{
//   const {naming,mobnom,message}=req.body
//   const user=new User({
//     naming,
//     mobnom,
//     message
//   })
//   await user.save()
//   console.log(user)
//   res.send("your details have been sent")
// })


router.post("/message",async(req,res)=>{
  const{naming,mobnom}=req.body;
  const userm=new userdetail({
    naming,
    mobnom,
  })
  await userm.save()
  console.log(userdetail)
})

module.exports = router;