<script lang="ts">
  import type { PageProps } from "./$types";
  import Copy from "@lucide/svelte/icons/copy";
  import Share2 from "@lucide/svelte/icons/share-2";
  import Settings from "@lucide/svelte/icons/settings";
  import Card from "$lib/components/Cards/Card.svelte";
  import CardSearchBar from "$lib/components/Search/CardSearchBar.svelte";
  import type CardType from "$lib/interfaces/CardType";
  import type { SearchableCard } from "$lib/server/cardService";

  let { data }: PageProps = $props();
  let nbCards: number = $derived(data.deck.cards.length);
  let cards: any[] = $state([]);
  let cardCurrent = $state();
  const addCard = () => {
    // mettre le lien pour l'ajouter dans firebase aussi
    cards.push(cardCurrent);
  };

  const searchCard = (card: SearchableCard) => {
    cardCurrent = {
      name: card.name,
      front: {
        skin: card.imageUrl,
      },
    };
  };

  // mock link
  const mockLink =
    "https://cards.scryfall.io/normal/front/0/7/073a04e9-7c18-469d-ac3b-941eb50a6f01.jpg?1722384767";
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
    <button disabled>
      <Settings />
    </button>
    <button disabled>
      <Copy />
    </button>
    {#if data.deck.isShared || data.deck.isPublic}
      <button disabled>
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
  <!-- Ajouter le ici le composant qui ajoute des cartes -->
  <div class="flex flex-wrap gap-2 my-4">
    {#each cards as card}
      <Card name={card.name} front={card.front} />
    {/each}
  </div>
</div>
