// Usa la variable de entorno en producción y localhost para desarrollo
const API_URL = "/api";

export async function getTasks() {
  const res = await fetch(`${API_URL}/tasks`);
  if (!res.ok) throw new Error("Error fetching tasks");
  return res.json();
}

export async function createTask(data) {
  const formData = new FormData();
  formData.append("description", data.description);
  formData.append("deadline", data.deadline || "");
  formData.append("priority", data.priority || "normal");
  if (data.file) {
    formData.append("file", data.file);
  }

  const res = await fetch(`${API_URL}/tasks`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) throw new Error("Error creating task");
  return res.json();
}

export async function updateTask(id, data) {
  const formData = new FormData();
  if (data.description !== undefined) formData.append("description", data.description);
  if (data.deadline !== undefined) formData.append("deadline", data.deadline);
  if (data.priority !== undefined) formData.append("priority", data.priority);
  if (data.completed !== undefined) formData.append("completed", data.completed ? "1" : "0");
  if (data.keepOldAttachment !== undefined) formData.append("keepOldAttachment", data.keepOldAttachment ? "true" : "false");
  if (data.file) {
    formData.append("file", data.file);
  }

  const res = await fetch(`${API_URL}/tasks/${id}`, {
    method: "PUT",
    body: formData,
  });
  if (!res.ok) throw new Error("Error updating task");
  return res.json();
}

export async function deleteTask(id) {
  const res = await fetch(`${API_URL}/tasks/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Error deleting task");
  return res.json();
}

