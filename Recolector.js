
var http = require('http'),
    url = require('url');
var nodemailer = require('nodemailer');

var consecutiu = 1;

//--------------------- ENVIAR CORREU ----------------------------------------
// create reusable transport method (opens pool of SMTP connections)
var smtpTransport = nodemailer.createTransport('SMTP',{
    service: 'Gmail',
    auth: {
        user: 'agenterecolector@gmail.com',
        pass: 'agente2014'
    }
});

// setup e-mail data with unicode symbols
var mailOptions = {
    from: 'Recolector ✔ <agenterecolector@gmail.com>', // sender address
    to: 'laura.ferre.7@gmail.com', // list of receivers
    subject: 'Info Agente ✔', // Subject line
    text: 'El agente informa 2 veces consecutivas de que el uso de CPU está por encima del límite permitido. ✔', // plaintext body
    html: '<b>El agente informa 2 veces consecutivas de que el uso de CPU está por encima del límite permitido. ✔</b>' // html body
}
//----------------------------------------------------------------------------


var procesarRegistrar = function(request, response, urlParseada) {
	if (request.method == 'GET') {
		response.writeHead(200, { 
			'Content-Type' : 'text/html'
		});			
		response.write('<p>Instancia ' + 
					   urlParseada.query.instancia + 
					   ' registrada</p>');
	} else {
		response.writeHead(405);
	}
	response.end();
}


	
var procesarEstadistica = function(request, response) {
	if (request.method == 'POST') {
		var datos = '';
		
		request.on('data', function(nuevosDatos) {
			datos = datos + nuevosDatos.toString();
		});
		
		request.on('end', function() {
			response.writeHead(200);
			console.log('****************************');
			console.log(datos);
			//--------------------------------------------
			var datosObject = JSON.parse(datos);
			if(datosObject.usoCPU60seg>=0.49){
				if(consecutiu == 2){ // No esta fet que sigui consecutiu!!!!
					console.log('-- El us de la CPU ha superat el 49%: ' + datosObject.usoCPU60seg);
					//------------------------
					smtpTransport.sendMail(mailOptions);
					//------------------------
					consecutiu = 1;
				}else{
					consecutiu ++;
				}				
			}else{
				consecutiu = 1;
			}
			//--------------------------------------------
			console.log('****************************');
			response.end();
		});
	} else {
		response.writeHead(405);
		response.end();
	}
}
	
var procesador = function(request, response) {
	var urlParseada = url.parse(request.url, true);
	
	if (urlParseada.pathname == '/registrar') {
		procesarRegistrar(request, response, urlParseada);
	} else if (urlParseada.pathname = '/estadistica') {
		procesarEstadistica(request, response);
	} else {
		response.writeHead(404);
		response.end();
	}
}

var server = http.createServer(procesador);
server.listen(80);