<script lang="ts">
  interface ButtonSubmitCustomProps {
    name: string;
    disabled?: boolean;
  }

  let { name, disabled }: ButtonSubmitCustomProps = $props();
</script>

<button
  type="submit"
  class="btn preset-filled-primary-500"
  style:pointer-events={disabled ? "none" : "auto"}
  {disabled}
>
  {name}
</button>
