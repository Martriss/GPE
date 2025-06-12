<script lang="ts">
  import SummaryDecks from "$lib/components/Deck/SummaryDecks.svelte";
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();
</script>

<div class="mx-4 my-8 flex flex-col">
  <div class="flex justify-center">
    <h1 class="h1 mb-4 md:mb-8 md:mt-4">Mes decks</h1>
  </div>
  <!-- Mettre les boutons, accéder aux decks publics ou créer un deck ? -->
  <!-- Mettre la barre de recherche pour chercher dans ses decks, avec l'option de filtrer par jeu -->
  <div class="flex gap-8 flex-col mx-2">
    <!-- Quand il y aura plusieurs jeux, vérifier que l'écart est suffisant, pas trop grand, etc. -->
    {#each data.userDecksByGame as decksByGame}
      <SummaryDecks {...decksByGame} />
    {/each}
  </div>
</div>
