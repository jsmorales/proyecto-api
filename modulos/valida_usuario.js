exports.autenticado = function (req, res, next){
/**/
  var resultado = req.session.autenticado;

  console.log(req.session.autenticado);

  if (resultado != null) {
    req.session.autenticado = true;
    //req.session.nombre = resultado.nombre;
    next()
    //res.status(200).send("Login Correcto.")
  }else{
    //req.session.autenticado = false;
    res.redirect("/users/login")
  }
}
