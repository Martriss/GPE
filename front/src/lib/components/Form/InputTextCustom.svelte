<script lang="ts">
    import type { FullAutoFill } from "svelte/elements";
    import LabelCustom from "./LabelCustom.svelte";

  interface InputTextCustomProps {
    label: string;
    name: string;
    placeholder?: string;
    pattern?: string;
    disabled?: boolean;
    maxlength?: number;
    readonly?: boolean;
    required?: boolean;
    colorRequired?: string;
    autocomplete?: FullAutoFill;
  }

  let {
    label,
    name,
    placeholder,
    pattern,
    disabled = false,
    maxlength,
    required = false,
    readonly = false,
    colorRequired,
    autocomplete = "off"
  }: InputTextCustomProps = $props();
</script>

<label class="label">
  <LabelCustom {label} {required} {colorRequired} />
  <input
    type="text"
    name={name}
    class="input"
    {placeholder}
    {pattern}
    {disabled}
    {maxlength}
    {required}
    {readonly}
    {autocomplete}
  />
</label>
