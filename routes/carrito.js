var express = require('express');
var router = express.Router();
var validator = require('validator');

//se define que coleccion se va a usar para esta ruta
//en este caso
const coleccion = 'carritos';

function valdaAutenticado(req, res, next){

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

router.post('/', (req, res, next) => {

  var articulos = req.body

  if (validarCarrito(articulos)) {
    //secuencia
    var db = req.app.get('db');

    articulos.usuario = {
      nombre: req.session.nombre
      email: req.session.email
    }

    db.collection(coleccion).insertOne(articulos, (err, resp) => {
      if (!err) {
        res.status(201).send(resp)
      }else{
        res.status(500).send("Error en la creacion del carrito.")
      }
    })
    //--------------------------------------
  }else{
    res.status(403).send("Error de carrito.")
  }

})

function validarCarrito(articulos){
  /*valida que el objeto sea de este tipo
  {
    productos: [
      {id:1212,nombre:"",precio:...},
      {...}
    ]
  }
  */

  //------------------------------
  if (!validator.isJSON(JSON.parse(articulos))) {
    return false;
  }
  //------------------------------

  //------------------------------
  if (articulos["productos"] == undefined) {
    return false;
  }
  //------------------------------

  //------------------------------
  if (!Array.isArray(articulos.productos)) {
    return false;
  }
  //------------------------------

  //------------------------------
  //validando cada uno de los productos
  articulos.productos.forEach((elemento)=>{

    if (elemento.id instanceof String) {
      return false;
    }

    if (elemento.nombre instanceof String) {
      return false;
    }

    if (elemento.precio instanceof String) {
      return false;
    }
  })
  //------------------------------

  return true;
}

/*carrito: [
  {nombre:"",
precio:123,
departamento o tipo:"bebidas-frutas-carnicera-"
}//producto
]
*/
module.exports = router;
