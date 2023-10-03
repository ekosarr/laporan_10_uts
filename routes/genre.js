const express = require("express");
const router = express.Router();

const { body, validationResult } = require("express-validator");
const connection = require("../config/db");

router.get('/', function (req, res) { 
    connection.query('SELECT * from genre', function(err, rows) { 
      if (err) {
        return res.status(500).json({ status: false, message: 'Server Error' });
      } else {
        return res.status(200).json({ status: true, message: 'Data genre', data: rows });
      }
    });
  });

  router.post("/add", [
    body("nama_genre").notEmpty(),
  ], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        errors: errors.array(),
      });
    }
    let Data = {
      nama_genre: req.body.nama_genre,
    };
    connection.query("INSERT INTO genre SET ?", Data, function (err, rows) {
      if (err) {
        return res.status(500).json({
          status: false,
          message: "Server Error",
        });
      } else {
        return res.status(201).json({
          status: true,
          message: "data genre berhasil ditambah!",
          data: rows[0],
        });
      }
    });
  });

  router.get('/:id', function (req, res) {
    let id = req.params.id;
    connection.query(`SELECT * FROM genre WHERE id_genre = ?`, [id], function (err, rows) {
      if (err) {
        return res.status(500).json({
          status: false,
          message: 'Server Error'
        });
      }
      if (rows.length === 0) {
        return res.status(404).json({
          status: false,
          message: 'Not Found'
        });
      } else {
        return res.status(200).json({
          status: true,
          message: 'Data Genre',
          data: rows[0]
        });
      }
    });
  });

  router.patch('/update/:id', [
    body("nama_genre").notEmpty(),
  ], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        errors: errors.array(),
      });
    }
  
    let id = req.params.id;
    let newData = {
      nama_genre: req.body.nama_genre
    };
  
    connection.query("UPDATE genre SET ? WHERE id_genre = ?", [newData, id], function (err, result) {
      if (err) {
        return res.status(500).json({
          status: false,
          message: "Server Error",
        });
      }
      
      if (result.affectedRows === 0) {
        return res.status(404).json({
          status: false,
          message: "Not Found",
        });
      } else {
        return res.status(200).json({
          status: true,
          message: "data genre telah diubah",
        });
      }
    });
  });

  router.delete('/delete/:id', (req, res) => {
    let id = req.params.id;
  
    connection.query("DELETE FROM genre WHERE id_genre = ?", id, function (err, result) {
      if (err) {
        return res.status(500).json({
          status: false,
          message: "Server Error",
        });
      }
  
      if (result.affectedRows === 0) {
        return res.status(404).json({
          status: false,
          message: "data tidak ditemukan",
        });
      } else {
        return res.status(200).json({
          status: true,
          message: "genre telah dihapus",
        });
      }
    });
  });
  
  
  
  

module.exports = router;