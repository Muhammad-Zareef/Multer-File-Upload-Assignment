const express = require('express');
const app = express();
const userRoutes = require('./routes/userRoutes');
const cors = require('cors');
const path = require("path");
require("dotenv").config();

const PORT = process.env.PORT || 3000;

app.use(cors({ 
    origin: "http://localhost:5173",
    credentials: true 
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use('/api', userRoutes);

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`);
});
