var express = require('express');
var router = express.Router();

/* GET home page. */
/*res.render('index', {
  title: 'Express',
  data:{
    nombre: 'johan',
    apellido: 'morales'
  },
  datos:{
    contenido: "Página de login"
  },
  pagina: "login",
  script: "/javascripts/main.js"
});*/

//inclusion del middleware: verificando si está autenticado
var aut = require("../modulos/valida_usuario.js");

router.get('/', aut.autenticado, function(req, res, next) {
  console.log("debería estar autenticado?");
  res.render('index',{
    data:{
      nombre: req.session.nombre,
      email: req.session.email
    }
  })
});


/*
router.get('/db', (req, res, next) => {
  //se accede al valor retornado de la base de datos
  //por medio del metodo get dentro del request a la app
  var db = req.app.get('db');
  console.log(db);
  res.send("DB -- recibida.")
})*/

module.exports = router;
