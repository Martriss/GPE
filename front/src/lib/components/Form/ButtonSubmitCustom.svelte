<script lang="ts">
  interface ButtonSubmitCustomProps {
    name: string;
  }

  let { name }: ButtonSubmitCustomProps = $props();
</script>

<button type="submit" class="btn preset-filled-primary-500">
  {name}
</button>
