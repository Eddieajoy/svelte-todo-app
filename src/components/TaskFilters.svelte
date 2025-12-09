<script>
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  export let searchText = "";
  export let filterPriority = "all";
  export let filterDate = "";
  export let sortField = "deadline";
  export let sortDir = "asc";

  $: dispatch("changeFilters", {
    searchText,
    filterPriority,
    filterDate,
    sortField,
    sortDir,
  });
</script>

<section class="filters">
  <h3>Filtros y ordenamiento</h3>
  <div class="row">
    <label>
      Buscar:
      <input type="text" placeholder="Texto en la descripción" bind:value={searchText} />
    </label>

    <label>
      Prioridad:
      <select bind:value={filterPriority}>
        <option value="all">Todas</option>
        <option value="low">Baja</option>
        <option value="normal">Normal</option>
        <option value="high">Alta</option>
      </select>
    </label>

    <label>
      Fecha límite:
      <input type="date" bind:value={filterDate} />
    </label>
  </div>

  <div class="row">
    <label>
      Ordenar por:
      <select bind:value={sortField}>
        <option value="deadline">Fecha límite</option>
        <option value="description">Descripción</option>
        <option value="priority">Prioridad</option>
      </select>
    </label>

    <label>
      Dirección:
      <select bind:value={sortDir}>
        <option value="asc">Ascendente</option>
        <option value="desc">Descendente</option>
      </select>
    </label>
  </div>
</section>

<style>
  .filters {
    border: 1px solid #ddd;
    padding: 0.75rem;
    border-radius: 0.5rem;
    margin-bottom: 1rem;
  }
  .row {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
  }
  label {
    flex: 1;
    min-width: 160px;
  }
  input,
  select {
    width: 100%;
    box-sizing: border-box;
    margin-top: 0.25rem;
  }
</style>
