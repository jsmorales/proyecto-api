var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  if (req.session.autenticado) {
    res.send("Esta autenticado.")
  } else {
    res.send("No esta autenticado.")
  }
});

module.exports = router;
