"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Trash2, CheckSquare, Square } from "lucide-react";

// Define interfaces for item and category
interface Item {
  name: string;
  quantity: string;
  checked: boolean;
}

interface Category {
  name: string;
  items: Item[];
}

const ShoppingList: React.FC = () => {
  const [productName, setProductName] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [categories, setCategories] = useState<Category[]>(() => {
    if (typeof window !== "undefined") {
      const storedData = localStorage.getItem("shoppingList");
      return storedData ? (JSON.parse(storedData) as Category[]) : [];
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem("shoppingList", JSON.stringify(categories));
  }, [categories]);

  const handleAddItem = useCallback((): void => {
    if (!productName.trim() || !quantity.trim() || !selectedCategory) return;

    setCategories((prevCategories: Category[]) => {
      const updatedCategories = prevCategories.map((cat) =>
        cat.name === selectedCategory
          ? {
              ...cat,
              items: [
                ...cat.items,
                { name: productName, quantity, checked: false },
              ],
            }
          : cat
      );

      if (!updatedCategories.some((cat) => cat.name === selectedCategory)) {
        updatedCategories.push({
          name: selectedCategory,
          items: [{ name: productName, quantity, checked: false }],
        });
      }

      return updatedCategories;
    });

    setProductName("");
    setQuantity("");
    setSelectedCategory("");
    setIsDialogOpen(false);
  }, [productName, quantity, selectedCategory]);

  const handleRemoveItem = useCallback(
    (categoryName: string, itemName: string): void => {
      setCategories((prev: Category[]) =>
        prev
          .map((cat) =>
            cat.name === categoryName
              ? {
                  ...cat,
                  items: cat.items.filter((item) => item.name !== itemName),
                }
              : cat
          )
          .filter((cat) => cat.items.length > 0)
      );
    },
    []
  );

  const handleClearAll = useCallback((): void => {
    setCategories([]);
    localStorage.removeItem("shoppingList");
  }, []);

  const toggleItemCheck = useCallback(
    (categoryName: string, itemName: string): void => {
      setCategories((prev: Category[]) =>
        prev.map((cat) =>
          cat.name === categoryName
            ? {
                ...cat,
                items: cat.items.map((item) =>
                  item.name === itemName
                    ? { ...item, checked: !item.checked }
                    : item
                ),
              }
            : cat
        )
      );
    },
    []
  );

  const toggleCategoryCheck = useCallback((categoryName: string): void => {
    setCategories((prev: Category[]) =>
      prev.map((cat) =>
        cat.name === categoryName
          ? {
              ...cat,
              items: cat.items.map((item) => ({
                ...item,
                checked: !cat.items.every((i) => i.checked),
              })),
            }
          : cat
      )
    );
  }, []);

  const categoryOptions: string[] = [
    "Groceries",
    "Household Supplies",
    "Personal Care",
    "Health & Wellness",
    "Other",
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <header className="flex justify-between items-center mb-5">
        <h1 className="text-xl font-semibold text-blue-900">Shopping List</h1>
        {categories.length > 0 && (
          <button
            onClick={handleClearAll}
            className="text-sm text-blue-950 hover:underline"
          >
            Clear all
          </button>
        )}
      </header>

      {categories
        .sort((a: Category, b: Category) => {
          const aCompleted = a.items.every((item) => item.checked);
          const bCompleted = b.items.every((item) => item.checked);
          return aCompleted === bCompleted ? 0 : aCompleted ? 1 : -1;
        })
        .map((category: Category) => (
          <div key={category.name} className="mb-4">
            <h2
              className="text-lg font-semibold bg-gray-200 p-2 rounded flex items-center gap-2 cursor-pointer"
              onClick={() => toggleCategoryCheck(category.name)}
            >
              {category.items.every((item) => item.checked) ? (
                <CheckSquare size={18} />
              ) : (
                <Square size={18} />
              )}
              {category.name}
            </h2>
            <ul>
              {category.items.map((item: Item) => (
                <li
                  key={item.name}
                  className="flex justify-between p-2 border-b items-center"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={item.checked}
                      onChange={() => toggleItemCheck(category.name, item.name)}
                      className="accent-blue-900"
                    />
                    <span className={item.checked ? "line-through" : ""}>
                      {item.name} - {item.quantity}
                    </span>
                  </div>
                  <button
                    onClick={() => handleRemoveItem(category.name, item.name)}
                    className="text-red-500"
                  >
                    <Trash2 size={16} />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}

      <Dialog
        open={isDialogOpen}
        onOpenChange={(open: boolean) => setIsDialogOpen(open)}
      >
        <DialogTrigger asChild>
          <Button className="fixed bottom-6 right-6 rounded-full h-12 w-12 bg-red-600 text-white">
            <Plus size={24} />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Add Item</DialogTitle>
          <input
            type="text"
            placeholder="Product Name"
            className="w-full p-2 border rounded mt-2 text-black"
            value={productName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setProductName(e.target.value)
            }
          />
          <div className="mt-2">
            <h3 className="font-semibold text-black">Select Category:</h3>
            <div className="flex flex-wrap gap-2 mt-1">
              {categoryOptions.map((cat) => (
                <Button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`border rounded p-2 ${
                    selectedCategory === cat
                      ? " text-white"
                      : "bg-transparent text-black hover:bg-gray-200 hover:text-black"
                  } focus:outline-none`}
                  variant={selectedCategory === cat ? "default" : "outline"}
                >
                  {cat}
                </Button>
              ))}
            </div>
          </div>
          <input
            type="text"
            placeholder="Quantity"
            className="w-full p-2 border rounded mt-2 text-black"
            value={quantity}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setQuantity(e.target.value)
            }
          />
          <Button className="w-full mt-4" onClick={handleAddItem}>
            Add
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ShoppingList;