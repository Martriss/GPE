<script lang="ts">
  import LabelCustom from "./LabelCustom.svelte";

  interface SelectCustomProps {
    label: string;
    name: string;
    options: {
      name: string;
      uuid: string;
    }[];
    disabled?: boolean;
    required?: boolean;
    colorRequired?: string;
    size?: number;
  }

  let {
    label,
    name,
    options,
    disabled,
    required,
    colorRequired,
    size,
  }: SelectCustomProps = $props();
</script>

<label class="label">
  <LabelCustom {label} {required} {colorRequired} />
  <select class="select" {name} {required} {disabled} {size}>
    {#each options as { name, uuid }}
      <option value={uuid}>{name}</option>
    {/each}
  </select>
</label>
