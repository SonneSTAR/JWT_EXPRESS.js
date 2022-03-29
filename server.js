const express = require('express')
const users = require('./data/agentes.js')
const app = express()
app.listen(3000)
const jwt = require('jsonwebtoken')

const secretKey = 'Mi Llave Ultra Secreta'


app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html")
});



app.get("/SignIn", (req, res) => {
    const { email, password } = req.query;


    const user = users.results.find((u) => u.email == email && u.password == password);

    if (user) {
        const token = jwt.sign(
            {
                exp: Math.floor(Date.now() / 1000) + 120, //2 minutos
                data: user,
            },
            secretKey
        );

        res.send(`
    <a href="/Dashboard?token=${token}"> <p> Ir a la ruta restringida. </p> </a>
    Bienvenido, ${email}.
    <script>
    localStorage.setItem('token', JSON.stringify("${token}"))
    </script>
    `);
    } else {

        res.send("Usuario o contraseña incorrecta");
    }
});


// Ruta restringida
app.get("/Dashboard", (req, res) => {

    let { token } = req.query;

    jwt.verify(token, secretKey, (err, decoded) => {

    err
    ? res.status(401).send({
    error: "401 Unauthorized",
    message: err.message,
    })
    : 
    res.send(`
    Bienvenido al Dashboard ${decoded.data.email}
    `);
    });
    });