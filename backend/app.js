require("dotenv").config();
const express = require('express');
const cors = require("cors");
const app = express();
var cookieParser = require('cookie-parser');
var session = require('express-session');
const mongoose = require("mongoose");
var bodyParser = require('body-parser');
const { v4: uuidv4 } = require("uuid");
const { createClient } = require("yappy-node-back-sdk");
const nodemailer = require('nodemailer');

const { PlayerModel } = require("./models");

const {
    PORT = 3001,
    MONGODB_URI = "mongodb://localhost:27017/chess?authSource=admin",
    user = "ajedrezvalidaciones@outlook.com",
    pass = "Ajedrez123"
} = process.env;

let yappyClient = createClient(process.env.MERCHANT_ID, process.env.SECRET_KEY);

const payment = {
    total: null,
    subtotal: null,
    shipping: 0.0,
    discount: 0.0,
    taxes: null,
    orderId: null,
    successUrl: "",//href="/frontend/success.html",
    failUrl: "",//href="/frontend/error.html",
    tel: "",
    domain: process.env.DOMAIN || "https://yappy.peqa.dev",
};

const db = mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

//Start middleware block
var corsOptions = {
    credentials: true,
    origin: true
}
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(session({
    secret: '12345678',
    resave: false,
    saveUninitialized: true
}));
app.use(bodyParser.json());
//End middleware block

function isAuthenticated (req, res, next) {
    if (req.session.user){
        next();
    }else{
        let cod = "UNAUTHORIZED";
        let message = "Debe iniciar session";
        res.json({ error: {cod, message}, succes: false });
    };
}

app.get('/', isAuthenticated, (req, res) => {
    let output = '<h1>Ajedrez Backend</h1>';
    output += '<h2>Proyecto Final de Desarrollo de Software IX</h2>';
    res.send(output);
});

app.post("/validar", express.urlencoded({ extended: false }), async (req, res) => {
    //I initialize variables
    let cod = "";
    let message = "";
    //Recupero parametros de entrada
    let id = req.body.id;
    let tokenIngresado = req.body.token;
    //I run validations
    if(id === undefined || id === ""){
        cod = "LOGIN_001";
        message = "Debe ingresar un nombre de usuario";
    }else{
        if(id === undefined || id === ""){
            cod = "LOGIN_002";
            message = "Debe ingresar el token";
        }else{
            let playerRead = await PlayerModel.find({ id });
            if (playerRead.length) { //El usuario existe
                let { email, fecha, token } = playerRead[0]; //Obtiene columnas
                //Valido Token
                if(tokenIngresado == token){
                    //Output for the client
                    res.json({ 
                        player: {
                            id: id,
                            email: email
                        }, 
                        succes: true 
                    });
                    return;
                }else{
                    cod = "SCBE_008";
                    message = "Valor de token invalido";
                }
            }else{
                cod = "SCBE_002";
                message = "Usuario no registrado";
            }
        }
    }
    res.json({ error: {cod, message}, succes: false });
});

app.post("/generar", express.urlencoded({ extended: false }), async (req, res) => {
    //I initialize variables
    let cod = "";
    let message = "";
    //Recupero parametros de entrada
    let id = req.body.id;
    //I run validations
    if(id === undefined || id === ""){
        cod = "LOGIN_001";
        message = "Debe ingresar un nombre de usuario";
    }else{
        let playerRead = await PlayerModel.find({ id });
        if (playerRead.length) { //El usuario existe
            let { email, fecha, token } = playerRead[0]; //Obtiene columnas
            //Genero token y fecha
            let tokenVal = Math.round(Math.random()*999999);
            let fechaVal = new Date();
            //Actualiza token
            await PlayerModel.updateOne({ id }, {
                $set: {
                    token: tokenVal,
                    fecha: fechaVal
                }
            });
            //Envio de correo
            let transporter = nodemailer.createTransport({
                host: "smtp.office365.com", // hostname
                secureConnection: false, // use SSL
                port: 587, // port for secure SMTP
                service: "Outlook365",
                auth: {
                    user,
                    pass
                },
                tls: {
                    ciphers:'SSLv3',
                    rejectUnauthorized: false
                },
                debug: false,
                logger: true
            });
            let mail_options = {
                from: 'validaciones ajedrez <ajedrezvalidaciones@outlook.com>',
                to: email,
                subject: 'Codigo',
                html: `${tokenVal.toString()}`
            };
            transporter.sendMail(mail_options, (error, info) => {
                if (error) {
                    console.log(error);
                    cod = "SCBE_003";
                    message = "No se pudo enviar el correo electronico";
                } else {
                    console.log('El correo se envío correctamente ' + info.response);
                }
            });
            //Output for the client
            res.json({ 
                player: {
                    id: id,
                    email: email
                }, 
                succes: true 
            });
            return;
        }else{
            cod = "SCBE_002";
            message = "Usuario no registrado";
        }
    }
    res.json({ error: {cod, message}, succes: false });
});

app.get('/validateSession', isAuthenticated, async (req, res) => {
    let id = req.session.user;
    //Retrieve user from database
    let playerRead = await PlayerModel.find({ id });
    if (playerRead.length) { //The user exists
        let { name, score, suscribed } = playerRead[0];
        //Output for the client
        res.json({ 
            player: {
                id,
                name,
                score,
                suscribed
            }, 
            succes: true
        });
        return;
    }else{ //User does not exist
        cod = "UNAUTHORIZED";
        message = "Usuario no registrado";
    }
    res.json({ error: {cod, message}, succes: false });
});

app.post('/register', express.urlencoded({ extended: false }), async (req, res) => {
    //I initialize variables
    let cod = "";
    let message = "";
    //Recupero parametros de entrada
    let id = req.body.id;
    let pass = req.body.pass;
    let score = req.body.score;
    let name = req.body.name;
    let email = req.body.email;
    //I run validations
    if (req.session.user){
        cod = "REG_006";
        message = "Existe una session activa";
    }else{
        if(id === undefined || id === ""){
            cod = "REG_001";
            message = "Debe ingresar un nombre de usuario";
        }else{
            if(pass === undefined || pass === ""){
                cod = "REG_002";
                message = "Debe ingresar una contraseña";
            }else{
                if(score === undefined || score === ""){
                    cod = "REG_003";
                    message = "Debe ingresar un nivel de juego";
                }else{
                    if(name === undefined || name === ""){
                        cod = "REG_004";
                        message = "Debe ingresar su nombre completo";
                    }else{
                        if(email === undefined || email === ""){
                            cod = "REG_006";
                            message = "Debe ingresar su correo electronico";
                        }else{
                            //Check if user already exists
                            let playerRead = await PlayerModel.find({ id });
                            if (playerRead.length) {
                            cod = "REG_005";
                            message = "Usuario ya existe";
                            }else{
                                //insert in the database
                                const playerCreated = await PlayerModel.create({
                                    id: id,
                                    password: pass,
                                    name: name,
                                    score: score,
                                    suscribed: false,
                                    email: email
                                });
                                //I log in the user
                                req.session.user = playerCreated.id;
                                //Output for the client
                                res.json({ 
                                    player: {
                                        id: playerCreated.id,
                                        name: playerCreated.name,
                                        score: playerCreated.score,
                                        suscribed: playerCreated.suscribed
                                    }, 
                                    succes: true 
                                });
                                return;
                            }
                        }
                    }
                }
            }
        }
    }
    res.json({ error: {cod, message}, succes: false });
});

app.post('/login', express.urlencoded({ extended: false }), async (req, res) => {
    //I initialize variables
    let cod = "";
    let message = "";
    //retrieve input parameters
    let id = req.body.id;
    let pass = req.body.pass;
    //I run validations
    if (req.session.user){
        cod = "LOGIN_004";
        message = "Existe una session activa";
    }else{
        if(id === undefined || id === ""){
            cod = "LOGIN_001";
            message = "Debe ingresar un nombre de usuario";
        }else{
            if(pass === undefined || pass === ""){
                cod = "LOGIN_002";
                message = "Debe ingresar una contraseña";
            }else{
                //Retrieve user from database
                let playerRead = await PlayerModel.find({ id });
                if (playerRead.length) { //El usuario existe
                    let { password, name, score, suscribed } = playerRead[0];
                    if(pass === password){ //The password is valid
                        
                        /* yair camnios magicos
                        res.json({ 
                            succes: true 
                        });
                        */


                        //I log in the user
                        req.session.user = id;
                        //Output for the client
                        res.json({ 
                            player: {
                                id,
                                name,
                                score,
                                suscribed
                            }, 
                            succes: true
                        });
                        
                        
                        
                        return;
                    }else{ //The password is invalid
                        cod = "LOGIN_003";
                        message = "Usuario o contraseña invalido";
                    }
                }else{ //User does not exist
                    cod = "LOGIN_003";
                    message = "Usuario o contraseña invalido";
                }
            }
        }
    }
    res.json({ error: {cod, message}, succes: false });
});



/* yair camnios magicos
app.post('/creaSession', express.urlencoded({ extended: false }), async (req, res) => {
    //I initialize variables
    let cod = "";
    let message = "";
    //retrieve input parameters
    let id = req.body.id;
    let pass = req.body.pass;

                        //I log in the user
                        req.session.user = id;
                        //Output for the client
                        res.json({ 
                            player: {
                                id,
                                name,
                                score,
                                suscribed
                            }, 
                            succes: true
                        });
    
});
*/




app.get('/logout', function (req, res, next) {
    if (req.session.user){
        //End the user session
        req.session.user = null;
        req.session.save(function (err) {
        if (err) next(err);
        req.session.regenerate(function (err) {
            if (err) next(err);
            //Output for the client
            res.json({ 
                response: {
                    cod: 'LOGOUT', 
                    message: 'Session Cerrada'
                }, 
                succes: true 
            });
        });});
    }else{
        //session does not exist
        res.json({ 
            response: {
                cod: 'LOGOUT_001', 
                message: 'No existe session de usuario'
            }, 
            succes: false
        });
    }
});

app.post("/paymentGateway", isAuthenticated, async (req, res) => {
    //I initialize variables
    let cod = "";
    let message = "";
    let id = req.session.user;
    //Retrieve user from database
    let playerRead = await PlayerModel.find({ id });
    if (playerRead.length) { //El usuario existe
        let { name, score, suscribed } = playerRead[0];
        if(suscribed){ //The user is already subscribed
            cod = "SCBG_001";
            message = "Usuario ya esta suscrito";
        }else{
            const { price: subtotal } = req.body;
            const uuid = uuidv4();
            const taxes = Number((subtotal * 0.07).toFixed(2));
            const total = subtotal + taxes;
            const newPayment = {
              ...payment,
              subtotal: 0.01, // To avoid having to pay during the test
              taxes: 0.01, // To avoid having to pay during the test
              total: 0.02, // To avoid having to pay during the test
              orderId: uuid.split("-").join("").slice(0, 10),
            };
            const response = await yappyClient.getPaymentUrl(newPayment);
            res.json(response);
            return
        }
    }else{
        cod = "SCBG_002";
        message = "Usuario no registrado";
    }
    res.json({ error: {cod, message}, succes: false });
});

app.post('/subscribe', isAuthenticated, express.urlencoded({ extended: false }), async (req, res) => {
    //I initialize variables
    let cod = "";
    let message = "";
    let id = req.session.user;
    //Retrieve user from database
    let playerRead = await PlayerModel.find({ id });
    if (playerRead.length) { //The user exists
        let { name, score, suscribed } = playerRead[0];
        if(suscribed){ //The user is already subscribed
            cod = "SCBE_001";
            message = "Usuario ya esta suscrito";
        }else{
            await PlayerModel.updateOne({ id }, {
                $set: {
                    suscribed: true
                }
            });
            //Output for the client
            res.json({ 
                player: {
                    id: id,
                    name: name,
                    score: score,
                    suscribed: true
                }, 
                succes: true 
            });
            return;
        }
    }else{
        cod = "SCBE_002";
        message = "Usuario no registrado";
    }
    res.json({ error: {cod, message}, succes: false });
});

db.then(() => {
    console.log("Database connection established successfully");
    app.listen(PORT, () => {
        console.log(`listening on port ${PORT}`);
    });
}).catch((error) => {
    console.error({ error });
});