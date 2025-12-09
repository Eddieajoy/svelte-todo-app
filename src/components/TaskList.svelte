<script>
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  export let filteredTasks = [];

  const today = new Date().toISOString().slice(0, 10);

  function isOverdue(task) {
    if (!task.deadline) return false;
    return !task.completed && task.deadline.slice(0, 10) < today;
  }

  function isDueSoon(task) {
    if (!task.deadline) return false;
    if (task.completed) return false;
    const d = task.deadline.slice(0, 10);
    return d >= today && d <= today; // mismo día por simplicidad
  }

  function edit(task) {
    dispatch("editTask", task);
  }

  function del(id) {
    dispatch("deleteTask", id);
  }

  function toggle(task) {
    dispatch("toggleCompleted", task);
  }
</script>

<section>
  <h2>Listado de tareas</h2>
  {#if filteredTasks.length === 0}
    <p>No hay tareas.</p>
  {:else}
    <ul class="task-list">
      {#each filteredTasks as task (task.id)}
        <li
          class:selected={task.completed}
          class:overdue={isOverdue(task)}
          class:soon={isDueSoon(task)}
        >
          <div class="main">
            <input
              type="checkbox"
              checked={task.completed}
              on:change={() => toggle(task)}
            />
            <div class="info">
              <div class="top">
                <span class="desc">{task.description}</span>
                {#if task.priority}
                  <span class="badge {task.priority}">
                    {task.priority}
                  </span>
                {/if}
              </div>
              <div class="meta">
                <span>Creada: {task.created_at?.slice(0, 10)}</span>
                {#if task.deadline}
                  <span>Fecha límite: {task.deadline.slice(0, 10)}</span>
                {/if}
                {#if task.attachment}
                  <a href={task.attachment} target="_blank" rel="noreferrer">
                    Ver archivo
                  </a>
                {/if}
              </div>
            </div>
          </div>
          <div class="actions">
            <button on:click={() => edit(task)}>Editar</button>
            <button on:click={() => del(task.id)}>Eliminar</button>
          </div>
        </li>
      {/each}
    </ul>
  {/if}
</section>

<style>
  .task-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  li {
    border: 1px solid #ddd;
    padding: 0.5rem;
    border-radius: 0.5rem;
    display: flex;
    justify-content: space-between;
    align-items: stretch;
    gap: 0.5rem;
  }
  li.overdue {
    border-color: #e53935;
    background: #ffebee;
  }
  li.soon {
    border-color: #ff9800;
    background: #fff3e0;
  }
  li.selected {
    opacity: 0.7;
  }
  .main {
    display: flex;
    gap: 0.5rem;
    flex: 1;
  }
  .info {
    flex: 1;
  }
  .top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 0.5rem;
  }
  .desc {
    font-weight: 500;
  }
  .meta {
    font-size: 0.85rem;
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  .badge {
    padding: 0.1rem 0.5rem;
    border-radius: 999px;
    font-size: 0.75rem;
    text-transform: uppercase;
  }
  .badge.low {
    background: #e0f2f1;
  }
  .badge.normal {
    background: #e3f2fd;
  }
  .badge.high {
    background: #ffebee;
  }
  .actions {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }
  button {
    cursor: pointer;
  }
</style>
