<script lang="ts">
  interface ButtonFilledProps {
    name: string;
    handleClick: (e: Event) => void;
    disabled?: boolean;
  }

  let { name, handleClick, disabled }: ButtonFilledProps = $props();
</script>

<button onclick={handleClick} class="btn preset-filled-primary-500" {disabled}>
  {name}
</button>
