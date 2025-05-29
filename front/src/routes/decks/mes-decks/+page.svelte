<script lang="ts">
  import SummaryDecks from "$lib/components/Deck/SummaryDecks.svelte";

  const mockData = {
    gameName: "Magic: The Gathering",
    decks: [
      {
        name: "Ceci est un test",
        description: "Ceci est une description",
        isPublic: false,
        isShared: false,
        userId: "MOUHAHAHA",
        rulesetId: "AHAH",
        cards: [],
      },
    ],
  };
</script>

<div>
  <!-- Mettre les boutons, accéder aux decks publics ou créer un deck ? -->
  <!-- Mettre la barre de recherche pour chercher dans ses decks, avec l'option de filtrer par jeu -->
  <SummaryDecks {...mockData} />
</div>
