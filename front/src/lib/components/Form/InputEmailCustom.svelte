<script lang="ts">
  import type { FullAutoFill } from "svelte/elements";
  import LabelCustom from "./LabelCustom.svelte";

  interface InputTextCustomProps {
    label: string;
    name: string;
    value?: string;
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
    autocomplete = "off",
    value = $bindable(),
  }: InputTextCustomProps = $props();
</script>

<label class="label">
  <LabelCustom {label} {required} {colorRequired} />
  <input
    type="email"
    {name}
    bind:value
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
