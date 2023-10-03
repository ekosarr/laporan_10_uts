const express = require("express");
const router = express.Router();

const { body, validationResult } = require("express-validator");

const connection = require("../config/db");

router.get('/', function (req, res) { 
  connection.query('SELECT * from pemesan', function(err, rows) { 
    if (err) {
      return res.status(500).json({ status: false, message: 'Server Error' });
    } else {
      return res.status(200).json({ status: true, message: 'Data Pemesan', data: rows });
    }
  });
});

router.post("/add", [
  body("nama_pemesan").notEmpty(),
  body("no_hp").notEmpty(),
  body("jenis_kelamin").notEmpty(),
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      errors: errors.array(),
    });
  }
  let Data = {
    nama_pemesan: req.body.nama_pemesan,
    no_hp: req.body.no_hp,
    jenis_kelamin: req.body.jenis_kelamin,
  };
  connection.query("INSERT INTO pemesan SET ?", Data, function (err, rows) {
    if (err) {
      return res.status(500).json({
        status: false,
        message: "Server Error",
      });
    } else {
      return res.status(201).json({
        status: true,
        message: "Success!",
        data: rows[0],
      });
    }
  });
});

router.get('/(:id)', function (req, res) {
  let id = req.params.id;
  connection.query(`SELECT * FROM pemesan WHERE id_pemesan = ${id}`, function (err, rows) {
    if (err) {
      return res.status(500).json({
        status: false,
        message: "Server Error",
      });
    }
    if (rows.length <= 0) {
      return res.status(404).json({
        status: false,
        message: "Not Found",
      });
    } else {
      return res.status(200).json({
        status: true,
        message: "Data Pemesan",
        data: rows[0],
      });
    }
  });
});


router.patch("/update/:id", [
  body("nama_pemesan").notEmpty(),
  body("no_hp").notEmpty(),
  body("jenis_kelamin").notEmpty(),
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      errors: errors.array(),
    });
  }
  let id = req.params.id; // Ambil ID dari parameter URL
  let Data = {
    nama_pemesan: req.body.nama_pemesan,
    no_hp: req.body.no_hp,
    jenis_kelamin: req.body.jenis_kelamin,
  };
  connection.query("UPDATE pemesan SET ? WHERE id_pemesan = ?", [Data, id], function (err, rows) {
    if (err) {
      return res.status(500).json({
        status: false,
        message: "Server Error",
      });
    } else {
      return res.status(200).json({
        status: true,
        message: "Update Success!",
      });
    }
  });
});

router.delete('/(:id)', function (req, res) {
  let id = req.params.id;
  connection.query(`DELETE FROM pemesan WHERE id_pemesan = ${id}`, function (err, result) {
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
        message: "Data Pemesan telah dihapus",
      });
    }
  });
});






module.exports = router;