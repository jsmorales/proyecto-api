var express = require('express');
var router = express.Router();

const coleccion = 'productos';

function valdaAutenticado(req, res, next){

  var resultado = req.session.autenticado;

  if (resultado != null) {
    req.session.autenticado = true;
    //req.session.nombre = resultado.nombre;
    next()
    //res.status(200).send("Login Correcto.")
  }else{
    //req.session.autenticado = false;
    res.status(401).send("No autorizado para este recurso.")
  }

}
//usa la validacion de usuarios logueados
router.use(valdaAutenticado);

router.get('/', function(req, res, next) {

  if (req.session.autenticado) {
    res.send("Esta autenticado.")
  } else {
    res.send("No esta autenticado.")
  }

  var db = req.app.get('db');

  //busca todos los resultados de la colección
  var cursor = db.collection(coleccion).find().toArray((err, documentos) => {
    //documentos son los resgistros encontrados.
    if (!err) {
      //res.send({productos:documentos})
      console.log(documentos);
    }else{
      //res.status(500).send("Error de consulta.")
      console.log("Error de consulta.");
    }

  });

});

module.exports = router;
