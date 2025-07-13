"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Pencil, Trash, Plus, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Define interface for the movie object
interface Movie {
  name: string;
  condition: "To watch" | "Watching" | "Completed";
  genre: "Romance" | "Thriller" | "Fantasy" | "Sci-Fi" | "Education" | "Other";
}

const MoviesPage: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [movieName, setMovieName] = useState<string>(""); // Renamed from bookName for clarity
  const [condition, setCondition] = useState<"To watch" | "Watching" | "Completed">("To watch");
  const [genre, setGenre] = useState<"Romance" | "Thriller" | "Fantasy" | "Sci-Fi" | "Education" | "Other">("Other");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [filter, setFilter] = useState<"All" | "To watch" | "Watching" | "Completed">("All");
  const [genreFilter, setGenreFilter] = useState<"All" | "Romance" | "Thriller" | "Fantasy" | "Sci-Fi" | "Education" | "Other">("All");
  const [warning, setWarning] = useState<string>("");

  useEffect(() => {
    const storedMovies = localStorage.getItem("movies");
    if (storedMovies) {
      try {
        setMovies(JSON.parse(storedMovies) as Movie[]);
      } catch (error) {
        console.error("Error parsing stored movies:", error);
        setMovies([]);
      }
    }
  }, []);

  useEffect(() => {
    if (movies.length > 0) {
      localStorage.setItem("movies", JSON.stringify(movies));
    }
    else {
    localStorage.removeItem("movies"); // Clear localStorage when movies array is empty
  }
  }, [movies]);

  const addOrUpdateMovie = (): void => {
    if (!movieName.trim()) {
      setWarning("Movie name is required!");
      return;
    }
    setWarning("");

    if (editingIndex !== null) {
      const updatedMovies = [...movies];
      updatedMovies[editingIndex] = { name: movieName, condition, genre };
      setMovies(updatedMovies);
      setEditingIndex(null);
    } else {
      setMovies([...movies, { name: movieName, condition, genre }]);
    }
    setMovieName("");
    setCondition("To watch");
    setGenre("Other");
    setShowModal(false);
  };

  const deleteMovie = (index: number, category: string): void => {
    const filteredMovies = movies.filter((m) => m.condition === category);
    const movieToDelete = filteredMovies[index];
    const originalIndex = movies.findIndex((m) => m.name === movieToDelete.name);

    if (originalIndex !== -1) {
      setMovies(movies.filter((_, i) => i !== originalIndex));
    }
  };

  const editMovie = (index: number, category: string): void => {
    const originalIndex = movies.findIndex(
      (movie) =>
        movie.name === movies.filter((m) => m.condition === category)[index].name
    );

    if (originalIndex !== -1) {
      setMovieName(movies[originalIndex].name);
      setCondition(movies[originalIndex].condition);
      setGenre(movies[originalIndex].genre);
      setEditingIndex(originalIndex);
      setShowModal(true);
    }
  };

  // Type-safe handlers for Select onValueChange
  const handleFilterChange = (value: string): void => {
    if (["All", "To watch", "Watching", "Completed"].includes(value)) {
      setFilter(value as "All" | "To watch" | "Watching" | "Completed");
    }
  };

  const handleGenreFilterChange = (value: string): void => {
    if (["All", "Romance", "Thriller", "Fantasy", "Sci-Fi", "Education", "Other"].includes(value)) {
      setGenreFilter(value as "All" | "Romance" | "Thriller" | "Fantasy" | "Sci-Fi" | "Education" | "Other");
    }
  };

  const handleGenreChange = (value: string): void => {
    if (["Romance", "Thriller", "Fantasy", "Sci-Fi", "Education", "Other"].includes(value)) {
      setGenre(value as "Romance" | "Thriller" | "Fantasy" | "Sci-Fi" | "Education" | "Other");
    }
  };

  return (
    <div className="p-6 relative">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-black">Your Movies</h2>
        <div className="flex gap-4">
          <Select onValueChange={handleGenreFilterChange} value={genreFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Genre" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              <SelectItem value="Romance">Romance</SelectItem>
              <SelectItem value="Thriller">Thriller</SelectItem>
              <SelectItem value="Fantasy">Fantasy</SelectItem>
              <SelectItem value="Sci-Fi">Sci-Fi</SelectItem>
              <SelectItem value="Education">Education</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
          <Select onValueChange={handleFilterChange} value={filter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              <SelectItem value="To watch">To Watch</SelectItem>
              <SelectItem value="Watching">Watching</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div
        className={`grid gap-4 mt-4 ${
          filter === "All" ? "md:grid-cols-3 grid-cols-1" : "grid-cols-1"
        }`}
      >
        {(filter === "All"
          ? ["To watch", "Watching", "Completed"]
          : [filter]
        ).map((category) => (
          <div key={category}>
            <h3 className="font-semibold mb-2">{category}</h3>
            {movies
              .filter(
                (movie: Movie) =>
                  movie.condition === category &&
                  (genreFilter === "All" || movie.genre === genreFilter)
              )
              .length === 0 ? (
              <p className="text-gray-400">No movies added</p>
            ) : (
              movies
                .filter(
                  (movie: Movie) =>
                    movie.condition === category &&
                    (genreFilter === "All" || movie.genre === genreFilter)
                )
                .map((movie: Movie, index: number) => (
                  <Card key={index} className="mb-2 bg-pink-100">
                    <CardContent className="flex items-start justify-between p-3">
                      <div>
                        <span className="block font-medium">{movie.name}</span>
                        <span className="text-sm text-gray-600">
                          {movie.genre}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Pencil
                          className="w-4 h-4 cursor-pointer"
                          onClick={() => editMovie(index, category)}
                        />
                        <Trash
                          className="w-4 h-4 cursor-pointer"
                          onClick={() => deleteMovie(index, category)}
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))
            )}
          </div>
        ))}
      </div>

      <button
        className="fixed bottom-6 right-6 bg-red-500 text-white p-4 rounded-full shadow-lg"
        onClick={() => setShowModal(true)}
      >
        <Plus className="w-6 h-6" />
      </button>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-md w-96 relative">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-black"
              onClick={() => setShowModal(false)}
            >
              <X className="w-6 h-6" />
            </button>
            <h3 className="font-semibold mb-2 text-black">Details</h3>
            <Input
              placeholder="Movie Name"
              value={movieName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setMovieName(e.target.value)
              }
            />
            {warning && <p className="text-red-500 text-sm mt-2">{warning}</p>}

            <h3 className="font-semibold mt-3 text-black">Condition</h3>
            <div className="flex gap-2 mt-2">
              {(["To watch", "Watching", "Completed"] as const).map((state) => (
                <Button
                  key={state}
                  variant={condition === state ? "default" : "outline"}
                  onClick={() => setCondition(state)}
                >
                  {state}
                </Button>
              ))}
            </div>

            <h3 className="font-semibold mt-3 text-black">Genre</h3>
            <Select onValueChange={handleGenreChange} value={genre}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Genre" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Romance">Romance</SelectItem>
                <SelectItem value="Thriller">Thriller</SelectItem>
                <SelectItem value="Fantasy">Fantasy</SelectItem>
                <SelectItem value="Sci-Fi">Sci-Fi</SelectItem>
                <SelectItem value="Education">Education</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>

            <Button className="mt-4 w-full" onClick={addOrUpdateMovie}>
              {editingIndex !== null ? "Update" : "Add"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MoviesPage;