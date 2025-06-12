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

  let currentDecks: DeckType[] = $state(decks);
  let nbDecks: number = $derived(currentDecks.length);

  const handleDelete = (e: Event) => {
    const target = e.currentTarget as HTMLButtonElement;
    const dataDeck = target.dataset.deck;
    if (!dataDeck) return; // Do nothing

    const targetDeck = JSON.parse(dataDeck);

    let i = currentDecks.findIndex((deck) => deck.id === targetDeck.id);
    currentDecks.splice(i, 1);
    i = decks.findIndex((deck) => deck.id === targetDeck.id);
    decks.splice(i, 1);

    const response = fetch(`/api/decks/${targetDeck.id}`, {
      method: "DELETE",
    });

    response
      .then((r) => {
        // Permet de revenir en arrière s'il y a eu un problème lors de la suppression
        if (!r.ok) {
          currentDecks.push(targetDeck);
          decks.push(targetDeck);
          // Mettre une notication pour prévenir qu'un problème est arrivé lors de la suppression
        }
      })
      .catch((err) => {
        // Traiter le cas d'erreur
      });
  };
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
  <div class="flex gap-1 flex-col">
    {#each currentDecks as deck (deck.id)}
      <Deck {deck} onDelete={handleDelete} />
    {/each}
  </div>
</div>
