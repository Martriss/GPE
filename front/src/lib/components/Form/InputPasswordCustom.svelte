<script lang="ts">
  import type { FullAutoFill } from "svelte/elements";
  import LabelCustom from "./LabelCustom.svelte";
  import Eye from "@lucide/svelte/icons/eye";
  import EyeOff from "@lucide/svelte/icons/eye-off";

  interface InputPasswordCustomProps {
    label: string;
    name: string;
    value?: string;
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
    value = $bindable(),
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
      data-testid="input-password-custom"
      type={showPwd ? "text" : "password"}
      {name}
      bind:value
      class="input pe-12"
      {placeholder}
      {pattern}
      {disabled}
      {maxlength}
      {required}
      {readonly}
      {autocomplete}
    />
    <div class="flex relative top-[-1.75rem] pe-4 justify-end cursor-text">
      <button
        type="button"
        onclick={handleShowPwd}
        aria-label="Afficher ou masquer le mot de passe"
      >
        {#if showPwd}
          <EyeOff data-testid="eye-off" />
        {:else}
          <Eye data-testid="eye" />
        {/if}
      </button>
    </div>
  </div>
</label>
