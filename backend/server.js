const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const PORT = 3000;

app.get("/", (req, res) => {
    res.send("Welcome to Rabbit API!");
})

app.listen(PORT, () => {
    console.log(`Server is running on https://localhost:${PORT}`);
})