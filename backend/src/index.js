const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const listingsRoutes = require("./routes/listings");
const advisorRoutes = require("./routes/advisor");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.get("/", (req, res) => {
  res.send("RentAI API is running");
});

app.use("/api/listings", listingsRoutes);
app.use("/api/advisor", advisorRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});