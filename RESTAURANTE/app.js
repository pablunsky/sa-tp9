var express = require('express');
var request = require('request');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const winston = require('winston');
const consoleTransport = new winston.transports.Console();
const myWinstonOptions = {
    transports: [consoleTransport]
}
const logger = new winston.createLogger(myWinstonOptions)

function logRequest(req, res, next)
{
    logger.info(req.url)
    next()
}
app.use(logRequest)

function logError(err, req, res, next)
{
    logger.error(err)
    next()
}
app.use(logError);

app.use(cors());
app.use(bodyParser.json());


const pedidos = [];


//RECIBIR PEDIDO DEL CLIENTE
app.post('/postOrder', function (req, res)
{
    console.log(req.body);
    pedidos.push(req.body);
    res.json({ msg: "Orden recibida" });
});


//INFORMAR ESTADO DE PEDIDO
app.post('/getOrderStatus', function (req, res)
{
    console.log(req.body);
    if (pedidos.length == 0)
    {
        res.json({ msg: "No hay ordenes registradas." });
    }
    pedidos.forEach((item, index) =>
    {
        if (item.code == req.body.code)
        {
            res.json({ status: item.status });
        }
        else if (index == pedidos.length - 1)
        {
            res.json({ msg: "No se ha encontrado la orden." });
        }
    });
});


//AVISAR A REPARTIDOR DE PEDIDO
app.post('/postDelivery', function (req, res)
{
    request({
        method: 'POST',
        uri: `/esb/postOrderDelivery`,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pedidos.pop())
    }, function (error, response, body)
    {
        if (response.statusCode == 200)
        {
            console.log('Orden enviada a repartidor.');
            console.log(body);
        }
        else
        {
            console.log('Error: ' + response.statusCode);
            console.log(body);
        }
    }).pipe(res);
});


//OBTENER TODAS
app.get('/getPosted', function (req, res)
{
    res.json(pedidos);
});

//Inicializa la aplicacion en el puerto 80
const server = app.listen(80, function ()
{
    console.log('Aplicacion inicializada');
});