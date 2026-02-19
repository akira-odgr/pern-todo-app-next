"use client"
import { useRef, useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import { MdModeEditOutline, MdOutlineDone } from "react-icons/md"

type Todo = {
  todo_id: string,
  description: string,
  completed: boolean
}

export default function Home() {
  const formRef = useRef<HTMLFormElement>(null)
  const [todos, setTodos] = useState<Todo[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingText, setEditingText] = useState<string>("")

  const getTodos = async () => {
    try {
      const res = await fetch("/api/todos")

      if (!res.ok) throw new Error("Failed to fetch todos")

      const data = await res.json()
      setTodos(data)

    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    getTodos()
  }, [])

  const submitAction = async (formData: FormData) => {
    const description = (formData.get("description") as string) ?? ""
    try {
      const res = await fetch("/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description, completed: false })
      })
      if (!res.ok) throw new Error("Failed to create todo")
      formRef.current?.reset()
      await getTodos()
    } catch (err) {
      console.error(err)
    }
  }

  const startEdit = (todo: Todo) => {
    setEditingId(todo.todo_id)
    setEditingText(todo.description)
  }

  const saveEdit = async () => {
    if (!editingId) return

    const target = todos.find(t => t.todo_id === editingId)
    if (!target) return

    try {
      const res = await fetch(`/api/todos/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: editingText,
          completed: target.completed
        })
      })

      if (!res.ok) throw new Error("Failed to update todo")

      setTodos((prev) =>
        prev.map((t) =>
          t.todo_id === editingId ? { ...t, description: editingText } : t
        )
      )
      setEditingId(null)
      setEditingText("")

    } catch (err) {
      console.error(err)
    }
  }

  // DELETE
  const deleteTodo = async (id: string) => {
    try {
      const res = await fetch(`/api/todos/${id}`, {
        method: "DELETE"
      })

      if (!res.ok) throw new Error("Failed to delete todo")

      await getTodos()
    } catch (err) {
      console.error(err)
    }
  }

  // TOGGLE completed
  const toggleCompleted = async (todo: Todo) => {
    try {
      const res = await fetch(`/api/todos/${todo.todo_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: todo.description,
          completed: !todo.completed,
        }),
      })

      if (!res.ok) throw new Error("Failed to toggle todo")

      setTodos((prev) =>
        prev.map((t) =>
          t.todo_id === todo.todo_id ? { ...t, completed: !t.completed } : t
        )
      )
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="min-h-screen bg-gray-800 flex justify-center items-center p-4 text-white">
      <div className="bg-gray-50 rounded-2xl shadow-x w-full max-w-lg p-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">PERN TODO APP</h1>
        <form
          ref={formRef}
          action={submitAction}
          className="flex items-center gap-2 shadow-sm border p-2 rounded-lg mb-6"
        >
          <input
            type="text"
            name="description"
            className="flex-1 outline-none px-3 py-2 text-gray-700 placeholder-gray-400"
            placeholder="What need to be done?"
            required
          />
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 cursor-pointer rounded-md font-medium">Add Task</button>
        </form>

        <div>
          {todos.length === 0 ? (
            <p>No tasks available. Add a new task!</p>
          ) : (
            <div className="flex flex-col gap-y-4">
              {todos.map((todo) => (
                <div key={todo.todo_id} className="pb-4">
                  {editingId === todo.todo_id ? (
                    <div className="flex items-center  gap-x-3">
                      <input
                        type="text"
                        value={editingText}
                        onChange={(e) => setEditingText(e.target.value)}
                        className="flex-1 p-3 border rounded-lg border-gray-200 outline-none focus:ring-2 focus:ring-blue-300 text-gray-700 shadow-inner" />
                      <div>
                        <button onClick={saveEdit} className="px-4 py-2 bg-green-500 text-white rounded-lg mr-2 mt-2 hover:bg-green-600 duration-200 transition-colors">
                          <MdOutlineDone />
                        </button>
                        <button onClick={() => setEditingId(null)} className="px-4 py-2 bg-gray-500 text-white rounded-lg mt-2 hover:bg-gray-600 duration-200 transition-colors">
                          <IoClose />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-x-4">
                        <button
                          onClick={() => toggleCompleted(todo)}
                          className={`size-6 border-2 rounded-full flex items-center justify-center ${todo.completed ? "border-green-500 bg-green-500 text-white" : "border-gray-300 hover:border-blue-400"}`}
                        >
                          {todo.completed && <MdOutlineDone size={16} />}
                        </button>
                        <span className="text-gray-800">
                          {todo.description}
                        </span>
                      </div>
                      <div className="flex gap-x-2">
                        <button onClick={() => startEdit(todo)} className="text-blue-500 p-2 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors duration-200">
                          <MdModeEditOutline />
                        </button>
                        <button
                          onClick={() => deleteTodo(todo.todo_id)}
                          className="text-red-500 p-2 hover:text-red-700 rounded-lg hover:bg-red-50 duration-200 transition-colors"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div >
  );
}
