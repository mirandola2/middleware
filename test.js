const http = require('http');

const {
    createHash,
  } = require('node:crypto');
  
const hash = createHash('sha256');
hash.update('testpsk');

  
  


// Function to send a POST request to the server
function sendPostRequest() {

  const options = {
    hostname: 'localhost',
    port: 60911,
    path: '/data?name=giacomo%20salici',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Just-A-PSK': hash.digest('hex'),
    },
  };

  const req = http.request(options, (res) => {
    let responseBody = '';

    res.on('data', chunk => {
      responseBody += chunk;
    });

    res.on('end', () => {
      console.log('Response from server:', responseBody);
      
    });

  });

  req.on('error', (error) => {
    console.error('Request error:', error);
  });

  // Write data to request body
  req.end();
}

// Send POST request after a short delay to ensure server is ready
setTimeout(sendPostRequest, 1000);
hash.end();
