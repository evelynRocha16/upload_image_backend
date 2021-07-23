const express = require('express');
const { uploadImage, mensagemRetorno } = require('../controllers/uploadController');
const mv = require('mv');
const formidable = require('formidable');

const cors = require('cors');
const router = express.Router();

router.use(cors());
router.use(express.json());



router.post('/upload', (req,res)=>{
  //instancia uma form data
  const form = new formidable.IncomingForm();

  //transforma o form que vem na requisição em form data
  form.parse(req, (err, fields, files)=>{

      if(files.file){

          //verifica se possui um ID
          if(fields.name){

              //Pega o antigo caminho da imagem inserida
              const oldpath = String(files.file.path);

              //Cria um novo caminho para imagem com um novo nome
              const newpath = './src/images/' + new Buffer.from(`${fields.name}.${files.file.type.split('/')[1]}`);
              //Move a imagem para o servidor
              mv(oldpath, newpath, (err)=>{

                  //Verifica se deu algum erro
                  if(err){
                      res.send(err);
                  }else{
                      //move a imagem para a pasta indicada
                      const pathdb = newpath.replace('./', '');
                      uploadImage(pathdb, files.file.type, `${fields.name}.${files.file.type.split('/')[1]}`);
                      res.status(200).send("Imagem enviada!");
                  }
              });
          }else{
              //retorna um erro indicando que não foi passado o id
              res.status('400').send('Não possui o nome do arquivo.').end();
          }

          
      }else{
          //retorna um erro indicanto que a imagem não foi passada
          res.status('400').send('Não possui a imagem.').end();
      }
      
  }); 
});

module.exports = router;