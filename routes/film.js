const express = require("express");
const router = express.Router();

const { body, validationResult } = require("express-validator");
const connection = require("../config/db");

router.get('/', function (req, res) { 
    connection.query('SELECT * from film', function(err, rows) { 
      if (err) {
        return res.status(500).json({ status: false, message: 'Server Error' });
      } else {
        return res.status(200).json({ status: true, message: 'Data film', data: rows });
      }
    });
  });

router.post("/add", [
    body("nama_film").notEmpty(),
    body("id_genre").notEmpty(),
    body("rating").notEmpty(),
  ], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        errors: errors.array(),
      });
    }
    let Data = {
      nama_film: req.body.nama_film,
      id_genre: req.body.id_genre,
      rating: req.body.rating,
    };
    connection.query("INSERT INTO film SET ?", Data, function (err, rows) {
      if (err) {
        return res.status(500).json({
          status: false,
          message: "Server Error",
        });
      } else {
        return res.status(201).json({
          status: true,
          message: "film telah ditambahkan",
          data: rows[0],
        });
      }
    });
  });

  router.get("/:id", (req, res) => {
    const idFilm = req.params.id;
    // Query SQL untuk mengambil data film berdasarkan ID
    const sqlQuery = `
      SELECT a.id_film, a.nama_film, a.rating, b.nama_genre
      FROM film a
      INNER JOIN genre b ON a.id_genre = b.id_genre
      WHERE a.id_film = ?;
    `;
    // Jalankan query dengan parameter ID yang diberikan
    connection.query(sqlQuery, [idFilm], (err, rows) => {
      if (err) {
        return res.status(500).json({
          status: false,
          message: "Server Error",
        });
      }
      if (rows.length === 0) {
        return res.status(404).json({
          status: false,
          message: "film tidak ada",
        });
      }
      // Jika data ditemukan, kirimkan sebagai respons
      const filmData = rows[0];
      return res.status(200).json({
        status: true,
        message: "Film Data",
        data: filmData,
      });
    });
  });

  router.patch("/update/:id", [
    body("nama_film").notEmpty(),
    body("rating").notEmpty(),
    body("id_genre").notEmpty(),
  ], (req, res) => {
    const idFilm = req.params.id;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        errors: errors.array(),
      });
    }
    const { nama_film, rating, id_genre } = req.body;
    // Query SQL untuk memperbarui data film berdasarkan ID
    const sqlUpdate = `
      UPDATE film
      SET nama_film = ?, rating = ?, id_genre = ?
      WHERE id_film = ?;
    `;
    // Jalankan query dengan parameter yang diberikan
    connection.query(sqlUpdate, [nama_film, rating, id_genre, idFilm], (err, result) => {
      if (err) {
        return res.status(500).json({
          status: false,
          message: "Server Error",
        });
      }
  
      if (result.affectedRows === 0) {
        return res.status(404).json({
          status: false,
          message: "film tidak ada",
        });
      }
  
      return res.status(200).json({
        status: true,
        message: "Film telah diubah",
      });
    });
  });

  router.delete("/:id", (req, res) => {
    const idFilm = req.params.id;
    const sqlDelete = `
      DELETE FROM film
      WHERE id_film = ?;
    `;
    // Jalankan query dengan parameter yang diberikan
    connection.query(sqlDelete, [idFilm], (err, result) => {
      if (err) {
        return res.status(500).json({
          status: false,
          message: "Server Error",
        });
      } 
      if (result.affectedRows === 0) {
        return res.status(404).json({
          status: false,
          message: "film tidak ada",
        });
      } 
      return res.status(200).json({
        status: true,
        message: "Film telah dihapus",
      });
    });
  });
  

module.exports = router;