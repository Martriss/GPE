<script lang="ts">
  import type { FullAutoFill } from "svelte/elements";
  import LabelCustom from "./LabelCustom.svelte";
  import Eye from "@lucide/svelte/icons/eye";

  interface InputPasswordCustomProps {
    label: string;
    name: string;
    pattern?: string;
    placeholder?: string;
    readonly?: boolean;
    required?: boolean;
    colorRequired?: string;
    autocomplete?: FullAutoFill;
    disabled?: boolean;
    maxlength?: number;
  }

  let {
    label,
    name,
    pattern,
    placeholder,
    readonly,
    required,
    colorRequired,
    autocomplete = "off",
    disabled,
    maxlength,
  }: InputPasswordCustomProps = $props();

  let showPwd: boolean = $state(false);

  const handleShowPwd = () => {
    showPwd = !showPwd;
  };
</script>

<label class="label">
  <LabelCustom {label} {required} {colorRequired} />
  <div>
    <input
      type={showPwd ? "text" : "password"}
      {name}
      class="input pe-12"
      {placeholder}
      {pattern}
      {disabled}
      {maxlength}
      {required}
      {readonly}
      {autocomplete}
    />
    <div class="flex relative top-[-1.75rem] pe-4 justify-end">
      <button
        type="button"
        onclick={handleShowPwd}
        aria-label="Afficher ou masquer le mot de passe"
      >
        <Eye />
      </button>
    </div>
  </div>
</label>
