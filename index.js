import cors from 'cors';
import express from 'express';
import session from 'express-session';
import { createClient } from 'redis';
import { RedisStore } from 'connect-redis';
import jwt from 'jsonwebtoken';
import path from 'path';
import { comparePassword, hashPassword } from './hash/hashing.js';
import verifyJWT from "./public/js/verifyJWT.js";
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import getFromTable from './queries/select.js';
import getPaidSalesFromTable from './queries/selectPaidSales.js';
import updateTableSales from './queries/update.js';

const app = express();

const redisClient = createClient({
    url: process.env.REDIS_URL,
    socket: {
        reconnectStrategy: (retries) => {
            if(retries >= 10) {
                return new Error('Se completó la cantidad límite de reconexiones');
            }

            return Math.min(retries * 100, 5000);
        }
    }
});

redisClient.on('error', (err) => console.log('Error Cliente Redis', err));
redisClient.connect().catch(console.error);

const redisStore = new RedisStore( { client: redisClient });

app.use(session({
    store: redisStore,
    name: 'token',
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: (60 * 60 * 1000),
        httpOnly: true,
        path: "/"
    }
}));

app.use(
    cors({
        origin: process.env.PORT || 3000,
        methods: ['POST', 'GET'],
        credentials: true
    })
);

// //express.urlencoded y express.json para que pesque datos de form.html
app.use(express.urlencoded({extended: true}));

app.use(express.json());
app.set('views', path.join(__dirname + '/views/'));
app.set('view engine', 'ejs');

// //Para que pesque imagenes y estilos
app.use(express.static(__dirname + '/public'));

//Carga pagina LOGIN
app.get('/login', (req, res) => {
    
    res.render('login');
});


//Ruta login - Acceso de usuario
app.post("/login", async (request, response) => {
    const usuario = request.body.user;

    try {

        const password = hashPassword(request.body.pass);

        const user = await getFromTable('password, funcion', 'xwsracoonsalesasdf', 'username', usuario);

        if(!comparePassword(password, user[0].password) && user[0].funcion !== process.env.MARCE){
            
            return response.render('login');
        }

        //Generar Token JWT
        const token = jwt.sign(
            { username: user[0].username },
            process.env.JWT_SECRET,
            {
                expiresIn: '6h'
            }
        );

        request.session.token = token;

        response.redirect('/ventas');

    } catch (error) {
        console.log(error)
        response.status(500).redirect('/login');    
    }
});

//Carga pagina VENTAS
app.get('/ventas', async (req, res) => {

    const token = req.session.token;

    const user = verifyJWT(token);

    console.log(user);

    if(user !== 'marce'){
        return res.status(401).redirect("/auth/logout");
    }

    const ventasPagadas = await getPaidSalesFromTable();
    const data = {array: JSON.stringify(ventasPagadas)};
    res.render('ventas', data);
});


app.post('/ventas', async (req, res) => {

    const token = req.session.token;

    const user = verifyJWT(token);

    console.log(user);

    if(user !== 'marce'){
        return res.status(401).redirect("/auth/logout");
    }

    const checkbox = req.body.selectedOptions;

    checkbox.forEach(async checked => {
        await updateTableSales(checked);
    });

    res.status(302).redirect('/ventas');
});

//LOG OUT usuario LOGGED
app.get('/auth/logout', async (req, res) => {

    res.status(200).clearCookie('token', "", {
        path: "/"
    });
    
    req.session.destroy(function (err) {
        res.redirect('/login');
    });
});

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Server running on ${port}`));