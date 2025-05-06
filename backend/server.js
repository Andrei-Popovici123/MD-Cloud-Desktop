require("dotenv").config();
const express = require("express");
const cors = require("cors");

const PORT = process.env.PORT || 3000;
const uploadRouter = require("./src/fileUpload/routes");
const cdrRouter = require("./src/deepCDR/route");
const dlpRouter = require("./src/dlp/route");
const multiscanRouter = require("./src/multiScan/route");

const app = express();
app.use(cors());
app.use(
  cors({
    origin: "http://192.168.1.135:5173",
    credentials: true,
  })
);
app.use(express.json());

app.use("/", uploadRouter);
app.use("/", cdrRouter);
app.use("/", dlpRouter);
app.use("/", multiscanRouter);

app.listen(PORT, () => {
  console.log(`Express server running at http://localhost:${PORT}/`);
});
