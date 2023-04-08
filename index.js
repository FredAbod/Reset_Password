require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
// const apicache = require("apicache");
const app = express();
const https = require("https");
const path = require("path");
const fs = require("fs");
const walletRouter = require('./routes/wallet.routes');
const connectDB = require("./config/db");
const router = require("./routes/user.routes");
// const limiter = require("./helper/rateLimiter");
connectDB();

const http_port = process.env.HTTP_PORT || 3456;
const https_port = process.env.HTTPS_PORT || 3000;

// let cache = apicache.middleware;
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
const options = {
  key: fs.readFileSync(path.join(__dirname, "localhost-key.pem")),
  cert: fs.readFileSync(path.join(__dirname, "localhost.pem")),
};
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(limiter);
// app.use(cache("1 minutes"));

app.get("/", (req, res) => res.send("HOME PAGE"));
app.use("/api", router);
app.use("/api", walletRouter);
app.all("*", (req, res) => {
  return res
    .status(404)
    .json({ messaage: `$http://localhost:${req.originalUrl} not found` });
});
app.listen(http_port, () => {
  console.log(`App running on http://localhost:${http_port}`);
});
https.createServer(options, app).listen(https_port, () => {
  console.log(`App running on secured port https://localhost:${https_port}`);
});
