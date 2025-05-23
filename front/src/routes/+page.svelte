<script lang="ts">
    import SearchBar from "$lib/components/Search/CardSearchBar.svelte";
    import type { SearchableCard } from "$lib/server/cardService.js";

    const rulesetId = "zhPZBo2kuOXpxdXMuXwk";

    function handleCardSelect(card: SearchableCard) {
        console.log("Carte sélectionnée:", card);
    }
</script>

<div class="container mx-auto p-4">
    <div class="max-w-md">
        <SearchBar
            {rulesetId}
            placeholder="Chercher une carte Magic..."
            maxResults={8}
            onCardSelect={handleCardSelect}
        />
    </div>
</div>
