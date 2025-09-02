<script lang="ts">
  interface ButtonFilledProps {
    name: string;
    handleClick: (e: Event) => void;
    disabled?: boolean;
    isLarge?: boolean;
  }

  let { name, handleClick, disabled, isLarge }: ButtonFilledProps = $props();
</script>

<button
  type="button"
  onclick={handleClick}
  class="btn preset-filled-primary-500 {isLarge ? 'text-xl w-40' : ''}"
  {disabled}
>
  {name}
</button>
