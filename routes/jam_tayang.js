const express = require("express");
const router = express.Router();

const { body, validationResult } = require("express-validator");
const connection = require("../config/db");

router.get('/', function (req, res) { 
    connection.query('SELECT * from jam_tayang', function(err, rows) { 
      if (err) {
        return res.status(500).json({ status: false, message: 'Server Error' });
      } else {
        return res.status(200).json({ status: true, message: 'Data jam tayang', data: rows });
      }
    });
  });

  router.post("/add", [
    body("jam_tayang").notEmpty(),
  ], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        errors: errors.array(),
      });
    }
    let Data = {
      jam_tayang: req.body.jam_tayang,
    };
    connection.query("INSERT INTO jam_tayang SET ?", Data, function (err, rows) {
      if (err) {
        return res.status(500).json({
          status: false,
          message: "Server Error",
        });
      } else {
        return res.status(201).json({
          status: true,
          message: "jam tayang ditambahkan!",
          data: rows[0],
        });
      }
    });
  });
  
  router.get('/:id', function (req, res) {
    let id = req.params.id;
    connection.query('SELECT * FROM jam_tayang WHERE id_jam_tayang = ?', [id], function (err, rows) {
      if (err) {
        return res.status(500).json({
          status: false,
          message: 'Server Error',
        });
      }
      if (rows.length <= 0) {
        return res.status(404).json({
          status: false,
          message: 'jam tayang tidak ada',
        });
      } else {
        return res.status(200).json({
          status: true,
          message: 'Data Jam Tayang',
          data: rows[0],
        });
      }
    });
  });

  router.patch('/update/:id', [
    body('jam_tayang').notEmpty(),
  ], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        errors: errors.array(),
      });
    }
    
    let id = req.params.id;
    let jamTayang = req.body.jam_tayang;
  
    connection.query('UPDATE jam_tayang SET jam_tayang = ? WHERE id_jam_tayang = ?', [jamTayang, id], function (err, result) {
      if (err) {
        return res.status(500).json({
          status: false,
          message: 'Server Error',
        });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({
          status: false,
          message: 'tidak ada jam tayang',
        });
      } else {
        return res.status(200).json({
          status: true,
          message: 'jam tayang telah diubah',
        });
      }
    });
  });

  router.delete('/delete/:id', (req, res) => {
    let id = req.params.id;
  
    connection.query('DELETE FROM jam_tayang WHERE id_jam_tayang = ?', [id], function (err, result) {
      if (err) {
        return res.status(500).json({
          status: false,
          message: 'Server Error',
        });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({
          status: false,
          message: 'tidak ada jam tayang',
        });
      } else {
        return res.status(200).json({
          status: true,
          message: 'jam tayang telah dihapus',
        });
      }
    });
  });
  
  
  

module.exports = router;