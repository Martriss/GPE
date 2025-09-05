<script lang="ts">
  import type { Snippet } from "svelte";

  interface TooltipProps {
    infoOnHover: string;
    children: Snippet<[]>;
  }

  let { infoOnHover, children }: TooltipProps = $props();
</script>

<div class="tooltip-div">
  <span
    data-testid="tooltip-info"
    class="tooltip-child text-white dark:text-black bg-[#333] dark:bg-[#f0f0f0]"
  >
    {infoOnHover}
  </span>
  {@render children()}
</div>

<style>
  .tooltip-div {
    position: relative;
    display: inline-block;
    cursor: pointer;
  }

  .tooltip-child {
    visibility: hidden;
    opacity: 0;
    text-align: center;
    padding: 6px 8px;
    border-radius: 4px;
    position: absolute;
    z-index: 1;
    bottom: 125%; /* Position au-dessus */
    left: 50%;
    transform: translateX(-50%);
    transition:
      opacity 0.3s ease,
      visibility 0.3s ease;
    white-space: nowrap;
  }

  .tooltip-div:hover .tooltip-child {
    visibility: visible;
    opacity: 1;
  }
</style>
