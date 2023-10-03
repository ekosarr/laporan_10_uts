const express = require("express");
const router = express.Router();

const { body, validationResult } = require("express-validator");

const connection = require("../config/db");

router.get("/", (req, res) => {
    const sqlQuery = `
      SELECT 
        t.id_tiket, 
        t.no_tiket, 
        t.tanggal, 
        t.harga, 
        f.nama_film, 
        k.no_kursi, 
        s.nama_studio, 
        jt.jam_tayang, 
        p.nama_pemesan
      FROM tiket t
      INNER JOIN film f ON t.id_film = f.id_film
      INNER JOIN kursi k ON t.id_kursi = k.id_kursi
      INNER JOIN studio s ON t.id_studio = s.id_studio
      INNER JOIN jam_tayang jt ON t.id_jam_tayang = jt.id_jam_tayang
      INNER JOIN pemesan p ON t.id_pemesan = p.id_pemesan
    `;
    connection.query(sqlQuery, (err, rows) => {
      if (err) {
        return res.status(500).json({
          status: false,
          message: "Server Error",
          error: err,
        });
      }
      return res.status(200).json({
        status: true,
        message: "Data Tiket",
        data: rows,
      });
    });
  });

router.post("/add", [
    body("no_tiket").notEmpty(),
    body("id_film").notEmpty(),
    body("id_kursi").notEmpty(),
    body("id_studio").notEmpty(),
    body("tanggal").notEmpty(),
    body("id_jam_tayang").notEmpty(),
    body("id_pemesan").notEmpty(),
    body("harga").notEmpty(),
  ], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        errors: errors.array(),
      });
    }
    let Data = {
      no_tiket: req.body.no_tiket,
      id_film: req.body.id_film,
      id_kursi: req.body.id_kursi,
      id_studio: req.body.id_studio,
      tanggal: req.body.tanggal,
      id_jam_tayang: req.body.id_jam_tayang,
      id_pemesan: req.body.id_pemesan,
      harga: req.body.harga,
    };
    connection.query("INSERT INTO tiket SET ?", Data, function (err, rows) {
      if (err) {
        return res.status(500).json({
          status: false,
          message: "Server Error",
        });
      } else {
        return res.status(201).json({
          status: true,
          message: "Tiket Ditambahkan",
          data: rows[0],
        });
      }
    });
  });

  router.get("/:no_tiket", (req, res) => {
    const no_tiket = req.params.no_tiket; 
    // Query SQL untuk mengambil data tiket
    const sqlQuery = `
      SELECT 
          t.id_tiket, 
          t.no_tiket, 
          t.tanggal, 
          t.harga, 
          f.nama_film, 
          k.no_kursi, 
          s.nama_studio, 
          jt.jam_tayang, 
          p.nama_pemesan
      FROM tiket t
      INNER JOIN film f ON t.id_film = f.id_film
      INNER JOIN kursi k ON t.id_kursi = k.id_kursi
      INNER JOIN studio s ON t.id_studio = s.id_studio
      INNER JOIN jam_tayang jt ON t.id_jam_tayang = jt.id_jam_tayang
      INNER JOIN pemesan p ON t.id_pemesan = p.id_pemesan
      WHERE t.no_tiket = ?`;
    // Jalankan query dengan parameter nomor tiket
    connection.query(sqlQuery, [no_tiket], (err, rows) => {
      if (err) {
        return res.status(500).json({
          status: false,
          message: "Server Error",
          error: err,
        });
      }
      if (rows.length <= 0) {
        return res.status(404).json({
          status: false,
          message: "Tiket tidak ditemukan",
        });
      } else {
        return res.status(200).json({
          status: true,
          message: "Data Tiket",
          data: rows[0],
        });
      }
    });
  });

router.patch("/update/:id_tiket", [
    body("no_tiket").notEmpty(),
    body("tanggal").notEmpty(),
    body("harga").notEmpty(),
    body("id_film").notEmpty(),
    body("id_kursi").notEmpty(),
    body("id_studio").notEmpty(),
    body("id_jam_tayang").notEmpty(),
    body("id_pemesan").notEmpty(),
  ], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        errors: errors.array(),
      });
    }
    const id_tiket = req.params.id_tiket;
    const {
      no_tiket,
      tanggal,
      harga,
      id_film,
      id_kursi,
      id_studio,
      id_jam_tayang,
      id_pemesan,
    } = req.body;
    // Query SQL untuk mengupdate data tiket berdasarkan ID
    const sqlQuery = `
      UPDATE tiket 
      SET 
        no_tiket = ?,
        tanggal = ?,
        harga = ?,
        id_film = ?,
        id_kursi = ?,
        id_studio = ?,
        id_jam_tayang = ?,
        id_pemesan = ?
      WHERE id_tiket = ?`;
    // Jalankan query dengan parameter
    connection.query(
      sqlQuery,
      [no_tiket, tanggal, harga, id_film, id_kursi, id_studio, id_jam_tayang, id_pemesan, id_tiket],
      (err, result) => {
        if (err) {
          return res.status(500).json({
            status: false,
            message: "Server Error",
            error: err,
          });
        }
        if (result.affectedRows === 0) {
          return res.status(404).json({
            status: false,
            message: "Tiket tidak ditemukan",
          });
        } else {
          return res.status(200).json({
            status: true,
            message: "Tiket telah diubah",
          });
        }
      }
    );
  });

router.delete("/delete/:id_tiket", (req, res) => {
    const id_tiket = req.params.id_tiket;
    const sqlQuery = "DELETE FROM tiket WHERE id_tiket = ?";
  
    connection.query(sqlQuery, [id_tiket], (err, result) => {
      if (err) {
        return res.status(500).json({
          status: false,
          message: "Server Error",
          error: err,
        });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({
          status: false,
          message: "Tiket tidak ditemukan",
        });
      } else {
        return res.status(200).json({
          status: true,
          message: "Tiket telah dihapus",
        });
      }
    });
  });

module.exports = router;