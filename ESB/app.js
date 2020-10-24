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
app.use(logError)
app.use(cors())
app.use(bodyParser.json());


//SOLICITAR PEDIDO AL RESTAURANTE
app.post('/postOrderRestaurant', function (req, res)
{
    console.log(req.body);
    request({
        method: 'POST',
        uri: `/restaurant/postOrder`,
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(req.body)
    }, function (error, response, body)
    {
        if (response.statusCode == 200)
        {
            console.log('Orden enviada a restaurante.');
        }
        else
        {
            console.log('Error: ' + response.statusCode);
            console.log(body);
        }
    }).pipe(res);
});


//OBTENER ESTADO DE LA ORDEN RESTAURANTE
app.post('/getOrderStatusRestaurant', function (req, res)
{
    console.log(req.body);
    request({
        method: 'POST',
        uri: `/restaurant/getOrderStatus`,
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ code: req.body.code })
    }, function (error, response, body)
    {
        if (response.statusCode == 200)
        {
            console.log('Estado de la orden:');
            console.log(body);
        }
        else
        {
            console.log('Error: ' + response.statusCode);
            console.log(body);
        }
    }).pipe(res);
});


//OBTENER ESTADO DEL PEDIDO REPARTIDOR
app.post('/getOrderStatusDelivery', function (req, res)
{
    console.log(req.body);
    request({
        method: 'POST',
        uri: `/repartidor/getOrderStatus`,
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ code: req.body.code })
    }, function (error, response, body)
    {
        if (response.statusCode == 200)
        {
            console.log('Estado del delivery:');
            console.log(body);
        }
        else
        {
            console.log('Error: ' + response.statusCode);
            console.log(body);
        }
    }).pipe(res);
});


//AVISAR A REPARTIDOR DE PEDIDO
app.post('/postOrderDelivery', function (req, res)
{
    console.log(req.body);
    request({
        method: 'POST',
        uri: `/repartidor/postOrder`,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req.body)
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
app.get('/getPostedRestaurant', function (req, res)
{
    console.log(req.body);
    request({
        method: 'GET',
        uri: `/restaurante/getPosted`
    }, function (error, response, body)
    {
        if (response.statusCode == 200)
        {
            console.log('Estado de la orden:');
            console.log(body);
            res.json(body);
        }
        else
        {
            console.log('Error: ' + response.statusCode);
            console.log(body);
            res.json(body);
        }
    });
});

//OBTENER TODAS
app.get('/getPostedDelivery', function (req, res)
{
    console.log(req.body);
    request({
        method: 'GET',
        uri: `/repartidor/getPosted`
    }, function (error, response, body)
    {
        if (response.statusCode == 200)
        {
            console.log('Estado de la orden:');
            res.json(body);
            console.log(body);
        }
        else
        {
            console.log('Error: ' + response.statusCode);
            console.log(body);
            res.json(body);
        }
    });
});


//Inicializa la aplicacion en el puerto 80
const server = app.listen(80, function ()
{
    console.log('Aplicacion inicializada');
});