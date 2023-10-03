const express = require("express");
const router = express.Router();

const { body, validationResult } = require("express-validator");
const connection = require("../config/db");

router.get('/', function (req, res) { 
    connection.query('SELECT * from kursi', function(err, rows) { 
      if (err) {
        return res.status(500).json({ status: false, message: 'Server Error' });
      } else {
        return res.status(200).json({ status: true, message: 'Data kursi', data: rows });
      }
    });
  });

  router.post("/add", [
    body("no_kursi").notEmpty(),
  ], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        errors: errors.array(),
      });
    }
    let Data = {
      no_kursi: req.body.no_kursi,
    };
    connection.query("INSERT INTO kursi SET ?", Data, function (err, rows) {
      if (err) {
        return res.status(500).json({
          status: false,
          message: "Server Error",
        });
      } else {
        return res.status(201).json({
          status: true,
          message: "kursi ditambahkan",
          data: rows[0],
        });
      }
    });
  });

  router.get("/:id", function (req, res) {
    let id = req.params.id;
    connection.query(
      `SELECT * FROM kursi WHERE id_kursi = ${id}`,
      function (err, rows) {
        if (err) {
          return res.status(500).json({
            status: false,
            message: "Server Error",
          });
        }
        if (rows.length <= 0) {
          return res.status(404).json({
            status: false,
            message: "Kursi Tidak Ada",
          });
        } else {
          return res.status(200).json({
            status: true,
            message: "Data Kursi",
            data: rows[0],
          });
        }
      }
    );
  });
  
  router.patch("/update/:id", [
    body("no_kursi").notEmpty(),
  ], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        errors: errors.array(),
      });
    }
    let id = req.params.id;
    let Data = {
      no_kursi: req.body.no_kursi,
    };
    connection.query(
      `UPDATE kursi SET ? WHERE id_kursi = ${id}`,
      Data,
      function (err, rows) {
        if (err) {
          return res.status(500).json({
            status: false,
            message: "Server Error",
          });
        } else {
          return res.status(200).json({
            status: true,
            message: "Kursi Telah Diubah",
          });
        }
      }
    );
  });

  router.delete("/delete/:id", (req, res) => {
    let id = req.params.id;
    connection.query(
      `DELETE FROM kursi WHERE id_kursi = ${id}`,
      function (err, result) {
        if (err) {
          return res.status(500).json({
            status: false,
            message: "Server Error",
          });
        } else if (result.affectedRows === 0) {
          return res.status(404).json({
            status: false,
            message: "Kursi tidak ada",
          });
        } else {
          return res.status(200).json({
            status: true,
            message: "Kursi telah dihapus",
          });
        }
      }
    );
  });
  
  
  

module.exports = router;