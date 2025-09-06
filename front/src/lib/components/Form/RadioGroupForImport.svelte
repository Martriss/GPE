<script lang="ts">
  import InputFileCustom from "./InputFileCustom.svelte";
  import TextareaCustom from "./TextareaCustom.svelte";

  interface RadioGroupForImportProps {
    title: string;
  }

  let { title }: RadioGroupForImportProps = $props();

  let val = $state("none");
</script>

<div class="label">
  <p class="label-text text-sm">{title}</p>
  <div class="flex flex-wrap justify-between mx-2 gap-1">
    <label class="flex items-center space-x-1 border rounded-md px-2 py-1">
      <input class="radio" type="radio" bind:group={val} value="none" />
      <span>Aucune</span>
    </label>
    <label
      class="flex items-center space-x-1 border rounded-md px-2 py-1 opacity-50"
    >
      <input
        class="radio"
        type="radio"
        bind:group={val}
        value="list"
        disabled
      />
      <span>Coller dans une liste</span>
    </label>
    <label
      class="flex items-center space-x-1 border rounded-md px-2 py-1 opacity-50"
    >
      <input
        class="radio"
        type="radio"
        bind:group={val}
        value="file"
        disabled
      />
      <span>Depuis un fichier</span>
    </label>
  </div>
  <div class="mx-5 mb-2 mt-6">
    {#if val === "list"}
      <TextareaCustom
        label="Copier dans la liste ci-dessous :"
        name="list"
        placeholder="1 Sol Ring
        ..."
        rows={4}
        resize="vertical"
      />
      <p class="text-xs italic">Format (un par ligne): # Nom de la carte</p>
    {/if}
    {#if val === "file"}
      <InputFileCustom
        label="Trouve la liste du deck sur ton appareil :"
        name="file"
        accept=".txt, .csv"
      />
    {/if}
  </div>
</div>
