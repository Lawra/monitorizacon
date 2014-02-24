
var http = require('http');
var url = require('url');

var processador = function(request, response){
	response.writeHead(200, {
		'Content-Type' : 'text/html'
	});
	
	response.write('<meta charset="utf-8">');
	response.write('<h1>Snoop</h1>');
	response.write('<p>Method: ' + request.method + '</p>');
	response.write('<p>URL: ' + request.url + '</p>');
	
	var urlParseada = url.parse(request.url, true);
	response.write('<p>URL: ' + request.url + '</p>');
	
	response.write('<h2>Parametros</h2>');
	response.write('<ul>');
	var parametros = urlParseada.query;
	for (var nomProp in parametros){
		response.write('<li>' + nomProp + ' = ' + parametros[nomProp] + '</li>');
	}
	response.write('</ul>');
	
	response.end();
}

var server = http.createServer(processador);
server.listen(80);

// Executes el recolector.js i despres amb una cmd nova fas >>telnet >>set localecho >>127.0.0.1 80 >> GET hola.html

