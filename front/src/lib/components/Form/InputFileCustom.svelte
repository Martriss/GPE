<script lang="ts">
  import LabelCustom from "./LabelCustom.svelte";

  interface InputFileCustomProps {
    label: string;
    name: string;
    required?: boolean;
    colorRequired?: string;
    disabled?: boolean;
    accept?: string;
  }

  let {
    label,
    name,
    required,
    colorRequired,
    disabled,
    accept = "image/*",
  }: InputFileCustomProps = $props();
</script>

<label class="label">
  <LabelCustom {label} {required} {colorRequired} />
  <input type="file" {name} class="input" {disabled} {required} {accept} />
</label>
