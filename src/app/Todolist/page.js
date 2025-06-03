"use client";

import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import { MdAddCircleOutline } from "react-icons/md";
import norecord from "../../../Public/Images/norecord.jpg";

function Page() {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [editValue, setEditValue] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [originalValue, setOriginalValue] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteType, setDeleteType] = useState(null); // "single" or "multiple"
  const [todoToDelete, setTodoToDelete] = useState(null); // For individual delete
  const [selectedTodos, setSelectedTodos] = useState([]);
  const [selectAllChecked, setSelectAllChecked] = useState(false);

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim() === "") {
      toast.warning("Enter Something In Text Field!", {
        position: "top-center",
      });
    } else if (
      todos.some(
        (todo) =>
          todo.text.trim().toLowerCase() === inputValue.trim().toLowerCase()
      )
    ) {
      toast.warning("This item is already in the list!", {
        position: "top-center",
      });
    } else {
      const newTodo = {
        text: inputValue,
        createdTime: new Date().toLocaleTimeString(),
      };
      setTodos([...todos, newTodo]);
      setInputValue("");
    }
  };

  const handleDelete = () => {
    if (deleteType === "single" && todoToDelete !== null) {
      const deletedTodo = todos[todoToDelete];
      const newTodos = todos.filter((_, index) => index !== todoToDelete);
      setTodos(newTodos);
      toast.success(`Deleted task: "${deletedTodo.text}"`, {
        position: "top-center",
      });
    } else if (deleteType === "multiple" && selectedTodos.length > 0) {
      const deletedTodos = selectedTodos
        .map((index) => todos[index].text)
        .join(", ");
      const newTodos = todos.filter(
        (_, index) => !selectedTodos.includes(index)
      );
      setTodos(newTodos);
      toast.success(`Deleted tasks: ${deletedTodos}`, {
        position: "top-center",
      });
    }

    // Reset state after delete
    setIsDeleteModalOpen(false);
    setTodoToDelete(null);
    setSelectedTodos([]);
    setSelectAllChecked(false);
  };

  const handleUpdate = (index) => {
    setEditIndex(index);
    setOriginalValue(todos[index].text);
    setEditValue(todos[index].text);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditIndex(null);
    setEditValue(originalValue); // Reset the value
  };

  const handleEditChange = (e) => {
    setEditValue(e.target.value);
  };

  const handleSave = () => {
    const trimmedEditValue = editValue.trim();
    const trimmedOriginalValue = originalValue.trim();

    if (trimmedEditValue === "") {
      toast.warning("Todo cannot be empty!", { position: "top-center" });
      return;
    }

    // Check for duplicate values (ignoring extra spaces and comparing trimmed values)
    if (
      todos.some(
        (todo) =>
          todo.text.trim().toLowerCase() === trimmedEditValue.toLowerCase() &&
          todo.text !== originalValue
      )
    ) {
      toast.warning("This todo item already exists!", {
        position: "top-center",
      });
      return;
    }

    const updatedTodos = [...todos];
    updatedTodos[editIndex].text = editValue;
    setTodos(updatedTodos);
    setIsEditModalOpen(false);
    setEditIndex(null);
  };

  const openDeleteModal = (index, type) => {
    setDeleteType(type);
    if (type === "single") {
      setTodoToDelete(index);
    }
    setIsDeleteModalOpen(true);
  };

  const handleCheckboxChange = (index) => {
    const updatedSelectedTodos = selectedTodos.includes(index)
      ? selectedTodos.filter((i) => i !== index)
      : [...selectedTodos, index];
    setSelectedTodos(updatedSelectedTodos);
  };

  const handleSelectAll = () => {
    setSelectAllChecked(!selectAllChecked);
    setSelectedTodos(selectAllChecked ? [] : todos.map((_, index) => index));
  };

  const truncateText = (text) => {
    const words = text.split(" ");
    if (words.length > 3) {
      return words.slice(0, 3).join(" ") + " ..."; // Truncate to 3 words and add '...'
    }
    return text; // If there are 3 or fewer words, return the whole text
  };

  return (
    <div className="w-[90%] md:w-[40%] min-h-[70vh] bg-blue-50 border border-blue-200 h-auto flex flex-col justify-start items-center mt-4 m-auto drop-shadow-md rounded-3xl">
      <h1 className="font-bold text-2xl md:text-3xl mt-8 text-black">Todo App</h1>
      <form
        className="flex flex-wrap gap-4 justify-center items-center py-2 w-full"
        onSubmit={handleSubmit}
      >
        <input
          className="w-full sm:w-auto p-2 bg-blue-100 border-spacing-1 text-black rounded-md"
          type="text"
          value={inputValue}
          onChange={handleChange}
          placeholder="Enter something"
        />
        <button
          type="submit"
          className="px-2 py-1.5 border-blue-400 rounded-md bg-blue-600 text-white hover:bg-blue-500 flex items-center space-x-2 text-black"
        >
          <MdAddCircleOutline size={25} />
        </button>
      </form>
      <div className="w-full  bg-white rounded-lg mt-2 max-h-80 overflow-y-auto text-black">
        {todos.length > 0 ? (
          <table className="w-full  bg-slate-50 border-separate border border-slate-200 rounded-lg mt-2 m-auto">
            <thead>
              <tr className="bg-gray-100 ">
                <th className="px-4 py-2 text-left">
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={selectAllChecked}
                  />
                </th>
                <th className="px-4 py-2 text-left">Todo Item</th>
                <th className="px-4 py-2 text-left">Created Time</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {todos.map((todo, index) => (
                <tr key={index} className="hover:bg-slate-100">
                  <td className="px-4 py-1">
                    <input
                      type="checkbox"
                      checked={selectedTodos.includes(index)}
                      onChange={() => handleCheckboxChange(index)}
                    />
                  </td>
                  <td className="px-4 py-1">
                    <div title={todo.text} >
                      {truncateText(todo.text)}{" "}
                      {/* This will truncate the text */}
                    </div>
                  </td>
                  <td className="px-4 py-1">{todo.createdTime}</td>
                  <td className="px-4 py-1 flex justify-center space-x-3">
                    <button
                      onClick={() => handleUpdate(index)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <AiOutlineEdit size={20} />
                    </button>
                    <button
                      onClick={() => openDeleteModal(index, "single")}
                      className="text-red-500 hover:text-red-700"
                    >
                      <AiOutlineDelete size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center mt-8">
            <img
              src={norecord.src}
              alt="No Data Found"
              className="w-40 mx-auto"
            />
            <h2 className="text-xl font-semibold mt-4">No Data Found</h2>
          </div>
        )}

        {selectedTodos.length > 0 && (
          <button
            onClick={() => openDeleteModal(null, "multiple")}
            className="px-4 py-2 mt-4 bg-red-500 text-white rounded-md"
          >
            Delete Selected
          </button>
        )}

        {/* Delete Modal */}
        {isDeleteModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 text-black">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[300px]">
              <h2 className="text-1xl font-bold mb-4">
                Are you sure you want to delete{" "}
                {deleteType === "single" ? "this task" : "these tasks"}?
              </h2>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-4 py-2 bg-red-500 text-white rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-green-500 text-white rounded"
                >
                  Yes, delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {isEditModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 text-black">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[300px]">
              <h2 className="text-xl font-bold mb-4">Edit Todo</h2>
              <input
                type="text"
                value={editValue}
                onChange={handleEditChange}
                className="w-full p-2 border rounded-md"
              />
              <div className="flex justify-end space-x-4 mt-4">
                <button
                  onClick={closeEditModal}
                  className="px-4 py-2 bg-gray-400 text-white rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
}

export default Page;
