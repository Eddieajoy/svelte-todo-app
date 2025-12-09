<script>
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  export let editingTask = null;

  let description = "";
  let deadline = "";
  let priority = "normal";
  let file = null;

  // Pre-cargar datos si se edita
  $: if (editingTask) {
    description = editingTask.description ?? "";
    deadline = editingTask.deadline ? editingTask.deadline.slice(0, 10) : "";
    priority = editingTask.priority ?? "normal";
    file = null;
  }

  function handleFileChange(event) {
    const [f] = event.target.files;
    file = f || null;
  }

  function handleSubmit(event) {
    event.preventDefault();

    const data = {
      description,
      deadline,
      priority,
      file
    };

    console.log("DATA DEL FORMULARIO:", data);

    if (!description.trim()) {
      alert("La descripción es obligatoria");
      return;
    }

    if (editingTask) {
      dispatch("updateTask", data);
    } else {
      dispatch("createTask", data);
    }

    if (!editingTask) {
      description = "";
      deadline = "";
      priority = "normal";
      file = null;
      event.target.reset();
    }
  }

  function cancelEdit() {
    description = "";
    deadline = "";
    priority = "normal";
    file = null;
    dispatch("cancelEdit");
  }
</script>

<form on:submit|preventDefault={handleSubmit}>
  <h2>{editingTask ? "Editar tarea" : "Nueva tarea"}</h2>

  <label>
    Descripción:
    <textarea bind:value={description} rows="2"></textarea>
  </label>

  <label>
    Fecha límite:
    <input type="date" bind:value={deadline} />
  </label>

  <label>
    Prioridad:
    <select bind:value={priority}>
      <option value="low">Baja</option>
      <option value="normal">Normal</option>
      <option value="high">Alta</option>
    </select>
  </label>

  <label>
    Archivo adjunto:
    <input type="file" on:change={handleFileChange} />
  </label>

  <button type="submit">
    {editingTask ? "Actualizar" : "Crear"}
  </button>

  {#if editingTask}
    <button type="button" on:click={cancelEdit}>Cancelar</button>
  {/if}
</form>


