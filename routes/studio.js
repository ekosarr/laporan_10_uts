const express = require("express");
const router = express.Router();

const { body, validationResult } = require("express-validator");

const connection = require("../config/db");

router.get('/', function (req, res) { 
    connection.query('SELECT * from studio', function(err, rows) { 
      if (err) {
        return res.status(500).json({ status: false, message: 'Server Error' });
      } else {
        return res.status(200).json({ status: true, message: 'Data studio', data: rows });
      }
    });
  });

  router.post("/add", [
    body("nama_studio").notEmpty(),
  ], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        errors: errors.array(),
      });
    }
    let Data = {
      nama_studio: req.body.nama_studio,
    };
    connection.query("INSERT INTO studio SET ?", Data, function (err, rows) {
      if (err) {
        return res.status(500).json({
          status: false,
          message: "Server Error",
        });
      } else {
        return res.status(201).json({
          status: true,
          message: "data berhasil ditambahkan!",
          data: rows[0],
        });
      }
    });
  });
  
  router.get('/:id', function (req, res) {
    let id = req.params.id;
    const sqlQuery = `SELECT * FROM studio WHERE id_studio = ?`;

    connection.query(sqlQuery, [id], function (err, rows) {
      if (err) {
        return res.status(500).json({
          status: false,
          message: 'Server Error'
        });
      }
      if (rows.length === 0) {
        return res.status(404).json({
          status: false,
          message: 'Studio not found'
        });
      } else {
        return res.status(200).json({
          status: true,
          message: 'Studio Details',
          data: rows[0]
        });
      }
    });
  });

  router.patch('/update/:id', [
    body("nama_studio").notEmpty(),
  ], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        errors: errors.array(),
      });
    }
    let id = req.params.id;
    let updatedData = {
      nama_studio: req.body.nama_studio,
    };
    const sqlQuery = `UPDATE studio SET ? WHERE id_studio = ?`;
    connection.query(sqlQuery, [updatedData, id], function (err, result) {
      if (err) {
        return res.status(500).json({
          status: false,
          message: 'Server Error',
        });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({
          status: false,
          message: 'Studio not found',
        });
      } else {
        return res.status(200).json({
          status: true,
          message: 'Studio berhasil di ubah',
        });
      }
    });
  });
  
  router.delete('/delete/:id', (req, res) => {
    let id = req.params.id;
  
    const sqlQuery = `DELETE FROM studio WHERE id_studio = ?`;
  
    connection.query(sqlQuery, [id], function (err, result) {
      if (err) {
        return res.status(500).json({
          status: false,
          message: 'Server Error',
        });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({
          status: false,
          message: 'Studio not found',
        });
      } else {
        return res.status(200).json({
          status: true,
          message: 'Studio telah dihapus',
        });
      }
    });
  });
  
  

module.exports = router;