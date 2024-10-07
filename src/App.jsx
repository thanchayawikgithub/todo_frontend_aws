import { useState, useEffect } from "react";

const App = () => {
  const [todos, setTodos] = useState([]);
  const [newTodoTitle, setNewTodoTitle] = useState("");
  const [newTodoDescription, setNewTodoDescription] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch all todos
  const fetchTodos = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3000/todos");
      const data = await response.json();
      setTodos(data);
    } catch (error) {
      console.error("Error fetching todos:", error);
    } finally {
      setLoading(false);
    }
  };

  // Add new todo
  const addTodo = async () => {
    try {
      const response = await fetch("http://localhost:3000/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: newTodoTitle,
          description: newTodoDescription,
        }),
      });
      const data = await response.json();
      console.log(data);
      setTodos([...todos, data]);
      setNewTodoTitle("");
      setNewTodoDescription("");
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  // Toggle todo completion
  const toggleTodo = async (id) => {
    try {
      await fetch(`http://localhost:3000/todos/${id}/toggle`, {
        method: "PATCH",
      });
      fetchTodos();
    } catch (error) {
      console.error("Error toggling todo:", error);
    }
  };

  // Delete a todo
  const deleteTodo = async (id) => {
    try {
      await fetch(`http://localhost:3000/todos/${id}`, {
        method: "DELETE",
      });
      fetchTodos();
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  // Fetch todos on component mount
  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div>
      <h1>Todo List</h1>
      {loading ? <p>Loading...</p> : null}
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            {todo.title} - {todo.isDone ? "Completed" : "Incomplete"}
            <button onClick={() => toggleTodo(todo.id)}>
              {todo.completed ? "Undo" : "Complete"}
            </button>
            <button onClick={() => deleteTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>

      <input
        type="text"
        value={newTodoTitle}
        onChange={(e) => setNewTodoTitle(e.target.value)}
        placeholder="title"
      />
      <input
        type="text"
        value={newTodoDescription}
        onChange={(e) => setNewTodoDescription(e.target.value)}
        placeholder="description"
      />
      <button onClick={addTodo}>Add Todo</button>
    </div>
  );
};

export default App;
