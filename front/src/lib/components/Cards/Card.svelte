<script lang="ts">
  import type CardType from "$lib/interfaces/CardType";
  import X from "@lucide/svelte/icons/x";

  interface CardProps {
    card: CardType;
    imageUrl: string; // A enlever quand l'image sera correctement au bon endroit (front.skin)
    onDelete?: (e: Event) => void;
  }

  let { card, imageUrl, onDelete }: CardProps = $props();
</script>

<div class="flex flex-col">
  {#if onDelete}
    <div class="flex justify-end relative top-6 left-3">
      <button
        aria-label="supprimer"
        data-card={JSON.stringify(card)}
        onclick={onDelete}
        class="bg-primary-500 rounded-full p-1"
      >
        <X width="16" />
      </button>
    </div>
  {/if}
  <img alt={`image de la carte ${card.name}`} src={imageUrl} />
</div>

<style>
  img {
    aspect-ratio: 5 / 7;
    height: 20.81rem;
    width: auto;
    border-radius: 15px;
  }
</style>
