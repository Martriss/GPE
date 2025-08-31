<script lang="ts">
  interface ButtonFilledProps {
    name: string;
    handleClick: (e: Event) => void;
    disabled?: boolean;
    isBig?: boolean;
  }

  let { name, handleClick, disabled, isBig }: ButtonFilledProps = $props();
</script>

<button
  type="button"
  onclick={handleClick}
  class="btn preset-filled-primary-500 {isBig ? 'text-xl w-40' : ''}"
  {disabled}
>
  {name}
</button>
