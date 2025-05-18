require("dotenv").config();
const express = require("express");
const cors = require("cors");

const PORT = process.env.PORT || 3000;
const uploadRouter = require("./src/fileUpload/routes");
const cdrRouter = require("./src/deepCDR/route");
const dlpRouter = require("./src/dlp/route");
const multiscanRouter = require("./src/multiScan/route");
// const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(
  cors({
    // origin: "http://192.168.1.135:5173",
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

app.use("/", uploadRouter);
app.use("/", cdrRouter);
app.use("/", dlpRouter);
app.use("/", multiscanRouter);

// mongoose.connect(process.env.MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// })
// .then(() => {
//   console.log('Connected to MongoDB');
// })
// .catch((error) => {
//   console.error('Error connecting to MongoDB:', error);
// });

app.listen(PORT, () => {
  console.log(`Express server running at http://localhost:${PORT}/`);
});
