<script lang="ts">
  import type DeckType from "$lib/interfaces/DeckType";
  import SquarePen from "@lucide/svelte/icons/square-pen";
  import X from "@lucide/svelte/icons/x";
  import Copy from "@lucide/svelte/icons/copy";
  import Share2 from "@lucide/svelte/icons/share-2";

  interface DeckProps {
    deck: DeckType;
  }

  let { deck }: DeckProps = $props();
</script>

<div class="flex border rounded-lg py-2 px-2 justify-between">
  <div class="flex gap-2 md:ms-8">
    <span>{deck.name}</span>
    <span class="italic hidden md:block opacity-80">{deck.description}</span>
    <!-- Mettre une taille minimum pour la description à mon avis -->
  </div>
  <div class="flex gap-2">
    <span class="vr border-l-2 border-color-custom"></span>
    <button type="button" aria-label="modifier" disabled>
      <SquarePen />
    </button>
    <button type="button" aria-label="supprimer definitivement" disabled>
      <X />
    </button>
    <button type="button" aria-label="duppliquer" disabled>
      <Copy />
    </button>
    <button type="button" aria-label="partager" disabled>
      <Share2 />
    </button>
  </div>
</div>

<style>
  .border-color-custom {
    border-color: var(--base-font-color);
  }
</style>
