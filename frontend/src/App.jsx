import { useEffect, useState } from "react";

import { createTask, deleteTask, listTasks, toggleTask } from "./api.js";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    try {
      setError("");
      setTasks(await listTasks());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function onSubmit(event) {
    event.preventDefault();
    const value = title.trim();
    if (!value) {
      return;
    }

    try {
      setError("");
      await createTask(value);
      setTitle("");
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function onToggle(task) {
    try {
      setError("");
      await toggleTask(task.id, !task.done);
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function onDelete(task) {
    try {
      setError("");
      await deleteTask(task.id);
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main className="app">
      <h1>Задачи</h1>

      <form onSubmit={onSubmit} className="add">
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Что нужно сделать?"
          maxLength={200}
        />
        <button type="submit">Добавить</button>
      </form>

      {error && <p className="error">{error}</p>}

      {loading ? (
        <p>Загрузка…</p>
      ) : tasks.length === 0 ? (
        <p className="empty">Пока пусто.</p>
      ) : (
        <ul className="tasks">
          {tasks.map((task) => (
            <li key={task.id} className={task.done ? "done" : ""}>
              <label>
                <input
                  type="checkbox"
                  checked={task.done}
                  onChange={() => onToggle(task)}
                />
                <span>{task.title}</span>
              </label>
              <button className="remove" onClick={() => onDelete(task)}>
                Удалить
              </button>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
