const express = require('express');
const app = express();
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const cors = require('cors');
require("dotenv").config();

const PORT = process.env.PORT || 3000;

app.use(cors({ 
    origin: "http://localhost:5173",
    credentials: true 
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

(async function () {
    try {
        await connectDB();
        console.log("DB connected successfully");
    } catch (error) {
        console.error("DB connection failed:", error);
    }
})();

app.use('/api', userRoutes);

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`);
});
