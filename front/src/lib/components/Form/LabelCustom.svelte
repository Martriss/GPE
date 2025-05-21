<script lang="ts">
  interface LabelCustomProps {
    label: string;
    required?: boolean;
    colorRequired?: string;
  }

  let { label, required, colorRequired }: LabelCustomProps = $props();
</script>

<span class="label-text text-sm">
  {label}
  {#if required}
    <span style:color={colorRequired}>*</span>
  {/if}
</span>
