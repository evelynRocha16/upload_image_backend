const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');

const SCOPES = ['https://www.googleapis.com/auth/drive.metadata.readonly'];

const TOKEN_PATH = 'token.json';


function uploadImage(name, path) {
    fs.readFile('credentials.json', (err, content) => {
        if (err) return console.log('Error loading client secret file:', err);
      
        authorize(JSON.parse(content), storeFiles(name, path));
      });
}


    function authorize(credentials, callback) {
   
    const {client_secret, client_id, redirect_uris} = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0]);

    fs.readFile(TOKEN_PATH, (err, token) => {
      if (err) 
      {
        return getAccessToken(oAuth2Client, callback);
      
      }
      oAuth2Client.setCredentials(JSON.parse(token));
      callback(oAuth2Client);
    });
  }

  function getAccessToken(oAuth2Client, callback) {
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
    });
    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question('Enter the code from that page here: ', (code) => {
      rl.close();
      oAuth2Client.getToken(code, (err, token) => {
        if (err) return console.error('Error retrieving access token', err);
        oAuth2Client.setCredentials(token);
  
        fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
          if (err) return console.error(err);
        });
        callback(oAuth2Client);
      });
    });
  }


  function storeFiles(auth, name, path) {
      console.log("auth", JSON.stringify(auth));
    const drive = google.drive({version: 'v3', auth});
    var fileMetadata = {
            'name': name
    };
    var media = {
            mimeType: 'image/jpeg',
            //PATH OF THE FILE FROM YOUR COMPUTER
            body: fs.createReadStream(path)
    };
    drive.files.create({
        resource: fileMetadata,
        media: media,
        fields: 'id'
    }, function (err, file) {
    if (err) {
        // Handle error
        console.error(err);
    } else {
        console.log('File Id: ', file);
    }
 });
  }


  module.exports = {
      uploadImage
  }