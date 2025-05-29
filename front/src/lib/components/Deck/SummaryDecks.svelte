<script lang="ts">
  import type DeckType from "$lib/interfaces/DeckType";
  import Ellipsis from "@lucide/svelte/icons/ellipsis";
  import Deck from "./Deck.svelte";

  interface SummaryDeckProps {
    gameName: string;
    decks: DeckType[];
    // Une fonction pour trier ?
  }

  let { gameName, decks }: SummaryDeckProps = $props();

  let nbDecks: number = $derived(decks.length);
</script>

<!-- Garder en tête qu'il faudrai une pagination suivant la vue qui est choisi -->
<div>
  <div class="flex justify-between">
    <div class="flex gap-8 items-end">
      <span class="h4 italic">{gameName}</span>
      <span class="hidden md:block text-lg">nombre de decks : {nbDecks}</span>
    </div>
    <button aria-label="changer la vue de la liste" type="button" disabled>
      <Ellipsis />
    </button>
  </div>
  {#each decks as deck}
    <Deck {deck} />
  {/each}
</div>
