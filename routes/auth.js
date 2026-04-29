const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const SECRET = "clave123";
let users = [];

router.get("/", (req,res)=>{
  res.sendFile(process.cwd()+"/views/login.html");
});

router.get("/register",(req,res)=>{
  res.sendFile(process.cwd()+"/views/register.html");
});

router.post("/register", async (req,res)=>{
  const {user,password} = req.body;

  const hash = await bcrypt.hash(password,10);

  users.push({
    user,
    password: hash
  });

  res.send("Usuario registrado");
});

router.post("/login", async (req,res)=>{
  const {user,password} = req.body;

  const found = users.find(u => u.user === user);

  if(!found) return res.send("Usuario no existe");

  const valid = await bcrypt.compare(password, found.password);

  if(!valid) return res.send("Contraseña incorrecta");

  const token = jwt.sign({user}, SECRET, {expiresIn:"1h"});

  res.cookie("token", token);

  res.send("Login correcto");
});

module.exports = router;