<script lang="ts">
  import LabelCustom from "./LabelCustom.svelte";

  interface InputTextareaCustomProps {
    label: string;
    name: string;
    value?: string;
    placeholder?: string;
    disabled?: boolean;
    maxlength?: number;
    readonly?: boolean;
    required?: boolean;
    colorRequired?: string;
    rows?: number;
    resize?: string;
  }

  let {
    label,
    name,
    placeholder,
    disabled = false,
    maxlength,
    required = false,
    readonly = false,
    colorRequired,
    rows = 2,
    resize = "none",
    value = $bindable(),
  }: InputTextareaCustomProps = $props();

  let val: string = $state(value ?? "");
  let sizeUsed: number = $derived(val.length);
</script>

<label class="label">
  <LabelCustom {label} {required} {colorRequired} />
  <textarea
    {name}
    bind:value={val}
    class="input"
    style:resize
    {placeholder}
    {disabled}
    {maxlength}
    {required}
    {readonly}
    {rows}
  ></textarea>
  {#if maxlength}
    <p class="flex justify-end me-2">
      <span class="text-xs">{sizeUsed} / {maxlength}</span>
    </p>
  {/if}
</label>
