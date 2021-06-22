const express = require("express");
const connectDB = require("./config/db");
const fileUpload = require("express-fileupload");
const path = require("path");
const cors = require("cors");

require("dotenv").config({ path: path.resolve(__dirname, "./config/.env") });

const app = express();

//Connect to the DB
connectDB();

//Middleware
app.use(express.json({ limit: "50mb", extended: false }));
app.use(express.urlencoded({ limit: "50mb", extended: false }));
app.use(fileUpload());
app.use(cors());

app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/day", require("./routes/api/day"));
app.use("/api/payment", require("./routes/api/payment"));
app.use("/api/reservation", require("./routes/api/reservation"));
app.use("/api/user", require("./routes/api/user"));
app.use("/api/vessel", require("./routes/api/vessel"));
app.use("/api/discrepancy", require("./routes/api/discrepancy"));

const PORT = process.env.PORT || 5000;

// Serve static assets in production
if (process.env.NODE_ENV === "production") {
   // Set static folder
   app.use(express.static("client/build"));

   app.get("*", (req, res) => {
      res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
   });
}

app.listen(PORT, () => console.log(`Server started on PORT: ${PORT}`));
