async function request(path, options = {}) {
  const res = await fetch(path, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status}: ${text}`);
  }

  if (res.status === 204) {
    return null;
  }

  return res.json();
}

export function listTasks() {
  return request("/api/tasks");
}

export function createTask(title) {
  return request("/api/tasks", {
    method: "POST",
    body: JSON.stringify({ title }),
  });
}

export function toggleTask(id, done) {
  return request(`/api/tasks/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ done }),
  });
}

export function deleteTask(id) {
  return request(`/api/tasks/${id}`, { method: "DELETE" });
}
