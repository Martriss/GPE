<script lang="ts">
  interface ButtonCustomProps {
    name: string;
  }

  let { name }: ButtonCustomProps = $props();
</script>

<button type="button" class="btn preset-filled-primary-500">
  {name}
</button>
