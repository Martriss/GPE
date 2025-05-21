<script lang="ts">
  import InputRadioCustom from "$lib/components/Form/InputRadioCustom.svelte";

  interface RadioGroupProps {
    title: string;
    name: string;
    checkboxes: {
      label: string;
      value: string;
      checked?: boolean;
    }[];
  }

  let { title, name, checkboxes }: RadioGroupProps = $props();
</script>

<div class="label">
  <p class="label-text text-sm">{title}</p>
  <div class="flex flex-wrap justify-between mx-2 gap-1">
    {#each checkboxes as { label, value, checked }}
      <InputRadioCustom {name} {label} {checked} {value} />
    {/each}
  </div>
</div>
