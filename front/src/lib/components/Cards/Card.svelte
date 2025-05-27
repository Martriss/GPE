<script lang="ts">
  import type CardType from "$lib/interfaces/CardType";
  import X from "@lucide/svelte/icons/x";

  interface CardProps extends CardType {
    imageUrl: string;
    onDelete?: () => void;
  }

  let { name, front, imageUrl, onDelete }: CardProps = $props();
</script>

<div class="flex flex-col">
  {#if onDelete}
    <div class="flex justify-end relative top-6 left-3">
      <button
        aria-label="supprimer"
        onclick={onDelete}
        class="bg-primary-500 rounded-full p-1"
      >
        <X width="16" />
      </button>
    </div>
  {/if}
  <img alt={`image de la carte ${name}`} src={imageUrl} />
</div>

<style>
  img {
    aspect-ratio: 5 / 7;
    height: 20.81rem;
    width: auto;
    border-radius: 15px;
  }

  .bg-primary-500 {
    background-color: var(--color-primary-500);
  }

  .custom-button {
    /* background-color: var(--body-background-color); */
    /* background-color: rgb(255, 134, 134); */
    border-top-right-radius: 13px;
    width: 24px;
    height: 24px;
    /* clip-path: polygon(100% 0%, 100% 100%, 0% 0%); */
    padding: 1.5rem;
  }
</style>
