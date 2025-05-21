<script lang="ts">
  interface DividerWithTextProps {
    title: string;
  }

  let { title }: DividerWithTextProps = $props();
</script>

<div class="flex items-center">
  <hr class="hr custom-color-border me-3 flex-1 shrink-2 custom-width" />
  <span class="flex-7 grow-8 max-w-fit">{title}</span>
  <hr class="hr custom-color-border flex-7 ms-3" />
</div>

<style>
  .custom-width {
    min-width: 2rem;
    max-width: 6rem;
  }
  .custom-color-border {
    border-color: var(--base-font-color);
  }
</style>
