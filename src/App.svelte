<script>
  import { onMount } from "svelte";
  import { getTasks, createTask, updateTask, deleteTask } from "./lib/api";
  import TaskForm from "./components/TaskForm.svelte";
  import TaskList from "./components/TaskList.svelte";
  import TaskFilters from "./components/TaskFilters.svelte";

  let tasks = [];
  let loading = false;
  let error = "";
  let editingTask = null;

  let searchText = "";
  let filterPriority = "all";
  let filterDate = "";
  let sortField = "deadline";
  let sortDir = "asc";

  async function loadTasks() {
    loading = true;
    error = "";
    try {
      tasks = await getTasks();
    } catch (e) {
      console.error(e);
      error = "Error cargando tareas";
    } finally {
      loading = false;
    }
  }

  onMount(() => {
    loadTasks();
  });

  async function handleCreate(event) {
  const data = event.detail;
  console.log("DATA RECIBIDA DESDE TaskForm:", data);

  try {
    const newTask = await createTask(data);
    tasks = [...tasks, newTask];
  } catch (e) {
    console.error(e);
    alert("Error creando tarea");
  }
}

  function startEdit(task) {
    editingTask = task;
  }

  async function handleUpdate(event) {
  const data = event.detail;
  console.log("DATA UPDATE:", data);

  try {
    const updated = await updateTask(editingTask.id, data);
    tasks = tasks.map((t) => (t.id === updated.id ? updated : t));
    editingTask = null;
  } catch (e) {
    console.error(e);
    alert("Error actualizando tarea");
  }
}

  async function handleDelete(id) {
    if (!confirm("¿Eliminar esta tarea?")) return;
    try {
      await deleteTask(id);
      tasks = tasks.filter((t) => t.id !== id);
    } catch (e) {
      console.error(e);
      alert("Error eliminando tarea");
    }
  }

  async function toggleCompleted(task) {
    try {
      const updated = await updateTask(task.id, {
        completed: !task.completed,
        keepOldAttachment: true
      });
      tasks = tasks.map((t) => (t.id === updated.id ? updated : t));
    } catch (e) {
      console.error(e);
      alert("Error cambiando estado");
    }
  }

  $: filteredTasks = tasks
    .filter((t) =>
      t.description.toLowerCase().includes(searchText.toLowerCase())
    )
    .filter((t) =>
      filterPriority === "all" ? true : t.priority === filterPriority
    )
    .filter((t) =>
      filterDate ? (t.deadline ? t.deadline.startsWith(filterDate) : false) : true
    )
    .slice()
    .sort((a, b) => {
      let av, bv;
      if (sortField === "deadline") {
        av = a.deadline || "";
        bv = b.deadline || "";
      } else if (sortField === "description") {
        av = a.description.toLowerCase();
        bv = b.description.toLowerCase();
      } else if (sortField === "priority") {
        av = a.priority || "";
        bv = b.priority || "";
      } else {
        return 0;
      }

      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

  function handleFiltersChange(e) {
    ({ searchText, filterPriority, filterDate, sortField, sortDir } = e.detail);
  }
</script>

<main class="container">
  <h1>Gestor de Tareas (Svelte + Backend)</h1>

  {#if error}
    <p class="error">{error}</p>
  {/if}

  <TaskForm
    on:createTask={handleCreate}
    on:updateTask={handleUpdate}
    {editingTask}
    on:cancelEdit={() => (editingTask = null)}
  />

  <TaskFilters
    bind:searchText
    bind:filterPriority
    bind:filterDate
    bind:sortField
    bind:sortDir
    on:changeFilters={handleFiltersChange}
  />

  {#if loading}
    <p>Cargando tareas...</p>
  {:else}
    <TaskList
      {filteredTasks}
      on:deleteTask={(e) => handleDelete(e.detail)}
      on:editTask={(e) => startEdit(e.detail)}
      on:toggleCompleted={(e) => toggleCompleted(e.detail)}
    />
  {/if}
</main>

<style>
  .container {
    max-width: 900px;
    margin: 0 auto;
    padding: 1rem;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  }
  h1 {
    text-align: center;
    margin-bottom: 1rem;
  }
  .error {
    color: red;
  }
</style>
