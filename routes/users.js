var express = require('express');
var router = express.Router();
var crypto = require('crypto');

//se define que coleccion se va a usar para esta ruta
//en este caso usuarios
const coleccion = 'usuarios';

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/*router.get('/:nom_usuario', function(req, res, next) {
  //res.send('respond with a resource');

  var db = req.app.get('db');

  var cursor = db.collection(coleccion).find({
    nombre: req.params.nom_usuario
  });

  var resultado;

  cursor.on("data", (d) => {
    resultado = d;
  }).on("end", () => {
    res.send(resultado)
  })

});*/

//validar si ya esta autenticado
router.get('/login', function(req, res, next) {
  res.render('login.ejs')
});

router.post('/login', (req, res, next) => {

  var autenticado = req.session.autenticado;
  var db = req.app.get('db');

  if (!autenticado) {
    //logica de autenticado
    //autenticar usando email y password
    var email = req.body.email
    var password = req.body.password

    if (!email || !password) {
      res.status(403).send("Falta el email o el password.")
    }

    //verifica email y pass esten en la bd con un user
    var db = req.app.get('db');

    var cursor = db.collection(coleccion).find({
      email: email,
      password: crypto.createHash('sha384').update(password,'utf-8').digest()
      //password: password
    });



    var resultado;

    cursor.on("data", (u) => {
      resultado = u;
    }).on("end", () => {

      //res.send(resultado)
      if (resultado != null) {
        console.log(resultado);
        //define las variables de session
        req.session.autenticado = true;
        req.session.nombre = resultado.nombre;
        req.session.email = resultado.email;

        res.status(200).redirect("/")
      }else{
        req.session.autenticado = false;
        res.status(401).send("No Autorizado.")
      }

    })

  }else {
    req.session.autenticado = false;
    res.send("El usuario ya esta autenticado.")
  }

})

router.get("/logout", (req, res, next) => {

  req.session.autenticado = null;
  req.session.nombre = undefined;
  req.session.email = undefined;

  res.redirect("/")

})

//registro de usuarios
/*se necesita nombre pass y correo
{nombre: "", password: "", correo: ""}
*/

router.get('/signup', function(req, res, next) {
  res.render('signup.ejs')
});

router.post('/signup', function(req, res, next) {

  var db = req.app.get('db');

  //recuperacion de los datos enviados en el cuerpo de la peticion
  var usuario = req.body;

  //logica de validacion del objeto enviado por la peticion
  if (validarRegistroUsuario(usuario)) {
      //logica de la insercion del registro en la bd

      //hashing del password
      usuario.password = crypto.createHash('sha384').update(usuario.password,'utf-8').digest();

      db.collection(coleccion).insertOne(usuario, (err, respuesta) => {
        res.send(respuesta);
      })

  }else{
      res.status(403).send("Error--[El usuario no está bien definido.]")
  }

  //res.send('respond with a resource');
});

//funcion de validacion del registro de usuario
function validarRegistroUsuario(usuario){
  if (usuario == undefined || usuario == null) {
    return false;
  }

  if (!usuario.nombre) {
    return false;
  }

  if (!usuario.password) {
    return false;
  }

  if (!usuario.email) {
    return false;
  }

  return true;
}

module.exports = router;
