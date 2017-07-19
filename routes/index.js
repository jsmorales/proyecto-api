var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/db', (req, res, next) => {
  //se accede al valor retornado de la base de datos
  //por medio del metodo get dentro del request a la app
  var db = req.app.get('db');
  console.log(db);
  res.send("DB -- recibida.")
})

module.exports = router;
