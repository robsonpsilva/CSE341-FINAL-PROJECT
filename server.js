const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());
const bodyParser = require("body-parser");

const session = require("express-session");
const passport = require("passport");

const GoogleStrategy = require('passport-google-oauth20').Strategy;

const mongodb = require("./data/database");


const port = process.env.PORT || 3000;
const jwt = require('jsonwebtoken');

const cookieParser = require('cookie-parser');
app.use(cookieParser());

const  userControler = require("./controllers/users.js");



mongodb.initDb((err) =>{
    if(err){
        console.log(err);
    }
    else{
        app.listen(port, () =>{console.log(`Database and Node running on port ${port}`)});
    }
})


app
.use(bodyParser.json())
.use(session({
    secret: "secret",
    resave: false,
    saveUninitialiazed: true,
}))
.use(passport.initialize())
.use(passport.session())
.use((req,res,next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers",
        "Origin, X-Request-With, Content-Type, Accept, Z-Key"
    );
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    next();
})
.use(cors({methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"]}))
.use(cors({origin: "*"}))
.use("/", require("./routes/index.js"));

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL
  },
  function(accessToken, refreshToken, profile, done) {
    // Aqui você pode salvar informações do perfil do usuário no banco de dados
    return done(null, profile);
  }
));

// Serialização do usuário para a sessão
passport.serializeUser((user, done) => {
    done(null, user);
  });
passport.deserializeUser((user, done) => {
  done(null, user);
});




app.get(
  '/login', passport.authenticate('google', { scope: ['profile', 'email'] }, (req, res) => {
    //#swagger.tags=["Login/Logout"]
  })
);


app.get(
  '/logout', (req, res) => {
    //#swagger.tags=["Login/Logout"]
  res.clearCookie('token');
  res.redirect('/api-docs');
});

app.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  async (req, res) => {
    const token = jwt.sign({ user: req.user }, 'secret', { expiresIn: '1h' });
    res.cookie('token', token, { path: '/' });
    res.redirect('/');
    const user = req.user;
  
    try {
      const email = user.emails?.[0]?.value || 'email-default@example.com'; // Garantir um email padrão
      const name = user.displayName || 'Defaut name';
      const existingUser = await mongodb
          .getDatabase()
          .db()
          .collection("users")
          .findOne({ email });
      if (!existingUser) {
          await userControler.createUser(email, name); // Salvar no banco
      }
      else{
          await userControler.updateUser(email, name);
      }
      
      console.log("User saved:", email);
    } catch (error) {
        console.error("Error saving user:", error);
        res.status(500).send("Error saving user!");
    }


  }
);

