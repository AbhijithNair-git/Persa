// import React from 'react'

// const ShoppingPage = () => {
//   return (
//     <div>
//       ShoppingPage
//     </div>
//   )
// }

// export default ShoppingPage

'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";

const categories = ["Vegie", "Baby", "Self care"];

type Item = {
  id: number;
  name: string;
  quantity: string;
  category: string;
};

export default function ShoppingPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [newItem, setNewItem] = useState({
    name: "",
    quantity: "",
    category: categories[0],
  });

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        id: Date.now(),
        name: newItem.name,
        quantity: newItem.quantity,
        category: newItem.category,
      },
    ]);
    setNewItem({ name: "", quantity: "", category: categories[0] });
  };

  const handleDeleteItem = (id: number) => {
    setItems(items.filter((item) => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
      <div className="w-full max-w-xl bg-white rounded shadow p-6">
        <header className="flex justify-between items-center">
          <h1 className="text-xl font-bold">Shopping list</h1>
          <div className="space-x-4">
            <button
              className="text-sm text-gray-500 hover:text-black"
              onClick={() => setItems([])}
            >
              Clear all
            </button>
            <button
              className="text-sm text-gray-500 hover:text-black"
              onClick={() => window.location.reload()}
            >
              Reset
            </button>
          </div>
        </header>

        <div className="mt-6">
          {[...new Set(items.map((item) => item.category))].map((category) => (
            <div key={category} className="mb-6">
              <div className="flex justify-between items-center bg-gray-200 px-4 py-2 rounded">
                <h2 className="font-semibold">{category}</h2>
              </div>
              <ul className="mt-2 space-y-2">
                {items
                  .filter((item) => item.category === category)
                  .map((item) => (
                    <li
                      key={item.id}
                      className="flex justify-between items-center bg-gray-50 px-4 py-2 rounded shadow-sm"
                    >
                      <span>
                        {item.name} ({item.quantity})
                      </span>
                      <button
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleDeleteItem(item.id)}
                      >
                        🗑️
                      </button>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>

        <Dialog>
          <DialogTrigger>
            <button
              className="fixed bottom-6 right-6 bg-red-500 text-white w-14 h-14 rounded-full shadow-lg hover:bg-red-600 flex justify-center items-center text-3xl"
            >
              +
            </button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Item</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Details</label>
                <input
                  type="text"
                  placeholder="Product Name"
                  value={newItem.name}
                  onChange={(e) =>
                    setNewItem({ ...newItem, name: e.target.value })
                  }
                  className="mt-1 w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Category</label>
                <select
                  value={newItem.category}
                  onChange={(e) =>
                    setNewItem({ ...newItem, category: e.target.value })
                  }
                  className="mt-1 w-full p-2 border rounded"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium">Quantity</label>
                <input
                  type="text"
                  placeholder="Qty"
                  value={newItem.quantity}
                  onChange={(e) =>
                    setNewItem({ ...newItem, quantity: e.target.value })
                  }
                  className="mt-1 w-full p-2 border rounded"
                />
              </div>
            </div>
            <DialogFooter>
              <button
                onClick={handleAddItem}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Add
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

