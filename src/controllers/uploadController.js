const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
let dataImage = {
  path: '',
  type: '',
  filename: '',
}

const SCOPES = ['https://www.googleapis.com/auth/drive.metadata.readonly'];

const TOKEN_PATH = 'token.json';


const uploadImage = async (path, type, filename) => {
    fs.readFile('credentials.json', (err, content) => {
        if (err) return console.log('Error loading client secret file:', err);

        dataImage = {
          path,
          type,
          filename
        };

        try {
          authorize(JSON.parse(content), storeFiles);
        } catch (error) {
          
        }
        
      });

    
}


const authorize = (credentials, callback) => {
   
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

const getAccessToken = (oAuth2Client, callback) => {
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


const storeFiles = (auth) => {
      console.log("auth", JSON.stringify(auth));
    const drive = google.drive({version: 'v3', auth});
    var fileMetadata = {
            'name': dataImage.filename
    };
    var media = {
            mimeType: dataImage.type,
            //PATH OF THE FILE FROM YOUR COMPUTER
            body: fs.createReadStream(dataImage.path)
    };
    drive.files.create({
        resource: fileMetadata,
        media: media,
        fields: 'id'
    }, (err, file) => {
    if (err) {
        // Handle error
        console.error(err);
        fs.unlinkSync(dataImage.path);
    } else {
        console.log(file);
        fs.unlinkSync(dataImage.path);
    }
 });
  }


  module.exports = {
      uploadImage,
  }