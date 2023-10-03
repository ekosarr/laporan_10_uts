const express = require("express");
const app = express();
const port = 3000;

// membuat route baru dengan method GET yang isinya kalimat halo dek
const bodyPs = require("body-parser");
app.use(bodyPs.urlencoded({ extended: false }));
app.use(bodyPs.json());

const pemesanRouter = require("./routes/pemesan");
app.use("/api/pemesan", pemesanRouter);

const studioRouter = require("./routes/studio");
app.use("/api/studio", studioRouter);

const genreRouter = require("./routes/genre");
app.use("/api/genre", genreRouter);

const kursiRouter = require("./routes/kursi");
app.use("/api/kursi", kursiRouter);

const jam_tayangRouter = require("./routes/jam_tayang");
app.use("/api/jam_tayang", jam_tayangRouter);

const filmRouter = require("./routes/film");
app.use("/api/film", filmRouter);

const tiketRouter = require("./routes/tiket");
app.use("/api/tiket", tiketRouter);

app.listen(port, () => {
  console.log(`aplikasi berjalan di http://localhost:${port}`);
});