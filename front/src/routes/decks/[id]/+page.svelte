<script lang="ts">
  import type { PageProps } from "./$types";
  import Copy from "@lucide/svelte/icons/copy";
  import Share2 from "@lucide/svelte/icons/share-2";
  import Settings from "@lucide/svelte/icons/settings";
  import Card from "$lib/components/Cards/Card.svelte";
  import CardSearchBar from "$lib/components/Search/CardSearchBar.svelte";
  import type CardType from "$lib/interfaces/CardType";
  import { sortCardNameAsc } from "$lib/utils/sorts";

  let { data }: PageProps = $props();
  let nbCards: number = $derived(data.cards.length);
  let cards: CardType[] = $state(
    data.cards.sort((a, b) => sortCardNameAsc(a, b)),
  );
  let cardCurrent: CardType = $state({
    rulesetId: "",
    name: "",
    nameLower: "",
    front: {
      cardTypeId: "",
      skin: "",
      properties: [],
    },
  });
  const addCard = () => {
    if (!cardCurrent.id) {
      // Do nothing if card is empty
      return;
    }
    cards.push(cardCurrent);
    data.deck.cards.push(cardCurrent.id);

    const response = fetch(`/api/decks/${data.deck.id}/cards`, {
      method: "PUT",
      body: JSON.stringify(data.deck),
      headers: {
        "content-type": "application/json",
      },
    });

    response
      .then((r) => {
        // Permet de revenir en arrière s'il y a eu un problème lors de l'ajout
        if (!r.ok) {
          cards.pop();
          data.deck.cards.pop();
          // Mettre une notication pour prévenir qu'un problème est arrivé lors de l'ajout
        }
      })
      .catch((err) => {
        // Traiter le cas d'erreur
      });
  };

  const removeCard = () => {};

  const searchCard = (card: CardType) => {
    cardCurrent = card;
  };
</script>

<div class="my-8 mx-4">
  <h1 class="h1">{data.deck.name}</h1>
  {#if data.deck.description}
    <p class="">{data.deck.description}</p>
  {/if}
  <div class="flex gap-x-6 gap-y-1 lg:gap-15 flex-wrap mb-4">
    <p>Nombre de cartes : {nbCards}</p>
    <p>Jeu : <span class="italic">{data.rulesetName}</span></p>
  </div>
  <div class="flex gap-4 mb-2">
    <button disabled aria-label="réglage">
      <Settings />
    </button>
    <button disabled aria-label="copier">
      <Copy />
    </button>
    {#if data.deck.isShared || data.deck.isPublic}
      <button disabled aria-label="partager">
        <Share2 />
      </button>
    {/if}
  </div>
  <div class="flex gap-4 justify-between sm:justify-start">
    <button disabled>Importer des cartes</button>
    <button disabled>Exporter les cartes</button>
  </div>
  <div class="my-4 flex gap-2">
    <CardSearchBar rulesetId={data.deck.rulesetId} onCardSelect={searchCard} />
    <button onclick={addCard} class="btn preset-filled-primary-500"
      >Ajouter</button
    >
  </div>
  <div class="flex flex-wrap gap-2 my-4">
    {#each cards as card}
      <Card {...card} imageUrl={card.imageUrl} onDelete={removeCard} />
    {/each}
  </div>
</div>
