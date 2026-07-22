import { useState } from "react";

interface Props {
  onClose: () => void;
  onSave: (book: any) => void;
}

export default function AddBookModal({ onClose, onSave }: Props) {
  const [book, setBook] = useState({
    title: "",
    category: "",
    retailPrice: "",
    wholesalePrice: "",
    stock: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBook({
      ...book,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40">
      <div className="w-[450px] rounded-xl bg-white p-6 shadow-xl">
        <h2 className="mb-4 text-2xl font-bold">Add New Book</h2>

        <div className="space-y-3">
          <input
            name="title"
            placeholder="Book Name"
            onChange={handleChange}
            className="w-full rounded border p-2"
          />

          <input
            name="category"
            placeholder="Category"
            onChange={handleChange}
            className="w-full rounded border p-2"
          />

          <input
            name="retailPrice"
            type="number"
            placeholder="Retail Price"
            onChange={handleChange}
            className="w-full rounded border p-2"
          />

          <input
            name="wholesalePrice"
            type="number"
            placeholder="Wholesale Price"
            onChange={handleChange}
            className="w-full rounded border p-2"
          />

          <input
            name="stock"
            type="number"
            placeholder="Stock"
            onChange={handleChange}
            className="w-full rounded border p-2"
          />
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded bg-gray-300 px-4 py-2"
          >
            Cancel
          </button>

          <button
            onClick={() => {
              onSave({
                ...book,
                id: Date.now().toString(),
              });
              onClose();
            }}
            className="rounded bg-green-600 px-4 py-2 text-white"
          >
            Save Book
          </button>
        </div>
      </div>
    </div>
  );
}