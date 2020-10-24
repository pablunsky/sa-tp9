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
app.options('*', cors())
app.use(bodyParser.json());


//SOLICITAR PEDIDO AL RESTAURANTE
app.post('/postOrder', function (req, res)
{
    console.log(req.body);
    request({
        method: 'POST',
        uri: `http://esb/postOrderRestaurant`,
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

//Inicializa la aplicacion en el puerto 80
const server = app.listen(80, function ()
{
    console.log('Aplicacion inicializada');
});