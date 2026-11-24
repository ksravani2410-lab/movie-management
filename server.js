const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/MovieClub")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

// Movie Schema
const movieSchema = new mongoose.Schema({
    title: String,
    genre: String,
    releaseYear: Number,
    rating: Number,
    director: String
});

const Movie = mongoose.model("Movie", movieSchema);

// 1. Add a new movie
app.post("/movies", async (req, res) => {
    const movie = new Movie(req.body);
    await movie.save();

    res.json({
        message: "Movie Added Successfully",
        movie
    });
});

// 2. View all movies
app.get("/movies", async (req, res) => {
    const movies = await Movie.find();
    res.json(movies);
});

// 3. Search movies by title or genre
app.get("/search", async (req, res) => {
    const search = req.query.q || "";

    const movies = await Movie.find({
        $or: [
            { title: { $regex: search, $options: "i" } },
            { genre: { $regex: search, $options: "i" } }
        ]
    });

    res.json(movies);
});

// 4. Update movie details
app.put("/movies/:id", async (req, res) => {
    const movie = await Movie.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
    );

    if (!movie) {
        return res.status(404).json({
            message: "Movie Not Found"
        });
    }

    res.json({
        message: "Movie Updated Successfully",
        movie
    });
});

// 5. Delete a movie
app.delete("/movies/:id", async (req, res) => {
    const movie = await Movie.findByIdAndDelete(req.params.id);

    if (!movie) {
        return res.status(404).json({
            message: "Movie Not Found"
        });
    }

    res.json({
        message: "Movie Deleted Successfully"
    });
});

// Start server
app.listen(3000, () => {
    console.log("Server running on port 3000");
});