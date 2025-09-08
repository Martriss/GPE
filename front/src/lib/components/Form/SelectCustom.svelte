<script lang="ts">
  import type { OptionType } from "$lib/interfaces/InputType";
  import LabelCustom from "./LabelCustom.svelte";

  interface SelectCustomProps {
    label: string;
    name: string;
    options: OptionType[];
    disabled?: boolean;
    required?: boolean;
    colorRequired?: string;
    size?: number;
    value?: string;
  }

  let {
    label,
    name,
    options,
    disabled,
    required,
    colorRequired,
    size,
    value = $bindable(),
  }: SelectCustomProps = $props();
</script>

<label class="label">
  <LabelCustom {label} {required} {colorRequired} />
  <select class="select" {name} bind:value {required} {disabled} {size}>
    {#each options as { label, value }}
      <option {value}>{label}</option>
    {/each}
  </select>
</label>
