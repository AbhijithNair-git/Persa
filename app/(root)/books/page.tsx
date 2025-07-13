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

// Define interfaces for the book object
interface Book {
  name: string;
  condition: "To read" | "Reading" | "Completed";
  genre: "Romance" | "Thriller" | "Fantasy" | "Sci-Fi" | "Education" | "Other";
}

const BooksPage: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [bookName, setBookName] = useState<string>("");
  const [condition, setCondition] = useState<"To read" | "Reading" | "Completed">("To read");
  const [genre, setGenre] = useState<"Romance" | "Thriller" | "Fantasy" | "Sci-Fi" | "Education" | "Other">("Other");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [filter, setFilter] = useState<"All" | "To read" | "Reading" | "Completed">("All");
  const [genreFilter, setGenreFilter] = useState<"All" | "Romance" | "Thriller" | "Fantasy" | "Sci-Fi" | "Education" | "Other">("All");
  const [warning, setWarning] = useState<string>("");

  useEffect(() => {
    const storedBooks = localStorage.getItem("books");
    if (storedBooks) {
      try {
        setBooks(JSON.parse(storedBooks) as Book[]);
      } catch (error) {
        console.error("Error parsing stored books:", error);
        setBooks([]);
      }
    }
  }, []);

  useEffect(() => {
  if (books.length > 0) {
    localStorage.setItem("books", JSON.stringify(books));
  } else {
    localStorage.removeItem("books"); // Clear localStorage when books array is empty
  }
}, [books]);

  const addOrUpdateBook = (): void => {
    if (!bookName.trim()) {
      setWarning("Book name is required!");
      return;
    }
    setWarning("");

    if (editingIndex !== null) {
      const updatedBooks = [...books];
      updatedBooks[editingIndex] = { name: bookName, condition, genre };
      setBooks(updatedBooks);
      setEditingIndex(null);
    } else {
      setBooks([...books, { name: bookName, condition, genre }]);
    }
    setBookName("");
    setCondition("To read");
    setGenre("Other");
    setShowModal(false);
  };

  const deleteBook = (index: number, category: string): void => {
    const filteredBooks = books.filter((b) => b.condition === category);
    const bookToDelete = filteredBooks[index];
    const originalIndex = books.findIndex((b) => b.name === bookToDelete.name);

    if (originalIndex !== -1) {
      setBooks(books.filter((_, i) => i !== originalIndex));
    }
  };

  const editBook = (index: number, category: string): void => {
    const originalIndex = books.findIndex(
      (book) =>
        book.name === books.filter((b) => b.condition === category)[index].name
    );

    if (originalIndex !== -1) {
      setBookName(books[originalIndex].name);
      setCondition(books[originalIndex].condition);
      setGenre(books[originalIndex].genre);
      setEditingIndex(originalIndex);
      setShowModal(true);
    }
  };

  // Type-safe handlers for Select onValueChange
  const handleFilterChange = (value: string): void => {
    if (["All", "To read", "Reading", "Completed"].includes(value)) {
      setFilter(value as "All" | "To read" | "Reading" | "Completed");
    }
  };

  const handleGenreFilterChange = (value: string): void => {
    if (["All", "Romance", "Thriller", "Fantasy", "Sci-Fi", "Education", "Other"].includes(value)) {
      setGenreFilter(value as "All" | "Romance" | "Thriller" | "Fantasy" | "Sci-Fi" | "Education" | "Other");
    }
  };

  return (
    <div className="p-6 relative">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-black">Your Books</h2>
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
              <SelectItem value="To read">To Read</SelectItem>
              <SelectItem value="Reading">Reading</SelectItem>
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
          ? ["To read", "Reading", "Completed"]
          : [filter]
        ).map((category) => (
          <div key={category}>
            <h3 className="font-semibold mb-2">{category}</h3>
            {books.filter(
              (book: Book) =>
                book.condition === category &&
                (genreFilter === "All" || book.genre === genreFilter)
            ).length === 0 ? (
              <p className="text-gray-400">No books added</p>
            ) : (
              books
                .filter(
                  (book: Book) =>
                    book.condition === category &&
                    (genreFilter === "All" || book.genre === genreFilter)
                )
                .map((book: Book, index: number) => (
                  <Card key={index} className="mb-2 bg-blue-100">
                    <CardContent className="flex items-start justify-between p-3">
                      <div>
                        <span className="block font-medium">{book.name}</span>
                        <span className="text-sm text-gray-600 ">
                          {book.genre}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Pencil
                          className="w-4 h-4 cursor-pointer"
                          onClick={() => editBook(index, category)}
                        />
                        <Trash
                          className="w-4 h-4 cursor-pointer"
                          onClick={() => deleteBook(index, category)}
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
              placeholder="Book Name"
              value={bookName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setBookName(e.target.value)
              }
            />
            {warning && <p className="text-red-500 text-sm mt-2">{warning}</p>}

            <h3 className="font-semibold mt-3 text-black">Condition</h3>
            <div className="flex gap-2 mt-2">
              {(["To read", "Reading", "Completed"] as const).map((state) => (
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
            <Select
              onValueChange={(value: string) => {
                if (
                  [
                    "Romance",
                    "Thriller",
                    "Fantasy",
                    "Sci-Fi",
                    "Education",
                    "Other",
                  ].includes(value)
                ) {
                  setGenre(
                    value as
                      | "Romance"
                      | "Thriller"
                      | "Fantasy"
                      | "Sci-Fi"
                      | "Education"
                      | "Other"
                  );
                }
              }}
              value={genre}
            >
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

            <Button className="mt-4 w-full" onClick={addOrUpdateBook}>
              {editingIndex !== null ? "Update" : "Add"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BooksPage;