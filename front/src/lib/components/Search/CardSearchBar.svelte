<script lang="ts">
    import type CardType from "$lib/interfaces/CardType";
    import { Search, X } from "@lucide/svelte";

    // Props
    interface CardSearchBarProps {
        rulesetId: string;
        placeholder?: string;
        maxResults?: number;
        onCardSelect?: (card: CardType) => void;
    }

    let {
        rulesetId,
        placeholder = "Rechercher une carte...",
        maxResults = 8,
        onCardSelect,
    }: CardSearchBarProps = $props();

    // State
    let searchTerm = $state("");
    let results = $state<CardType[]>([]);
    let isLoading = $state(false);
    let showDropdown = $state(false);
    let selectedIndex = $state(-1);

    // Refs
    let searchInput: HTMLInputElement;
    // svelte-ignore non_reactive_update
    let dropdownRef: HTMLDivElement;
    let debounceTimer: ReturnType<typeof setTimeout>;

    // Search function
    async function performSearch(term: string) {
        if (term.length < 2) {
            results = [];
            showDropdown = false;
            return;
        }

        isLoading = true;

        try {
            const response = await fetch(
                `/api/cards/search?ruleset=${rulesetId}&q=${encodeURIComponent(term)}&limit=${maxResults}`,
            );

            if (response.ok) {
                const data = await response.json();
                results = data.cards || [];
                showDropdown = results.length > 0;
                selectedIndex = -1; // Reset selection
            } else {
                results = [];
                showDropdown = false;
            }
        } catch (error) {
            console.error("Erreur de recherche:", error);
            results = [];
            showDropdown = false;
        } finally {
            isLoading = false;
        }
    }

    // Debounced search effect
    $effect(() => {
        clearTimeout(debounceTimer);

        if (searchTerm.length === 0) {
            results = [];
            showDropdown = false;
            return;
        }

        debounceTimer = setTimeout(() => {
            performSearch(searchTerm);
        }, 300);

        // Cleanup
        return () => clearTimeout(debounceTimer);
    });

    // Click outside effect
    $effect(() => {
        function handleClickOutside(event: MouseEvent) {
            const target = event.target as Node;
            if (
                dropdownRef &&
                !dropdownRef.contains(target) &&
                searchInput &&
                !searchInput.contains(target)
            ) {
                showDropdown = false;
                selectedIndex = -1;
            }
        }

        if (showDropdown) {
            document.addEventListener("click", handleClickOutside);
            return () =>
                document.removeEventListener("click", handleClickOutside);
        }
    });

    // Handle card selection
    function selectCard(card: CardType) {
        searchTerm = card.name;
        showDropdown = false;
        selectedIndex = -1;
        onCardSelect?.(card);
    }

    // Clear search
    function clearSearch() {
        searchTerm = "";
        results = [];
        showDropdown = false;
        selectedIndex = -1;
        searchInput?.focus();
    }

    // Keyboard navigation
    function handleKeydown(event: KeyboardEvent) {
        if (!showDropdown || results.length === 0) {
            return;
        }

        switch (event.key) {
            case "ArrowDown":
                event.preventDefault();
                selectedIndex = Math.min(selectedIndex + 1, results.length - 1);
                break;

            case "ArrowUp":
                event.preventDefault();
                selectedIndex = Math.max(selectedIndex - 1, -1);
                break;

            case "Enter":
                event.preventDefault();
                if (selectedIndex >= 0 && selectedIndex < results.length) {
                    selectCard(results[selectedIndex]);
                }
                break;

            case "Escape":
                event.preventDefault();
                showDropdown = false;
                selectedIndex = -1;
                searchInput?.blur();
                break;

            case "Tab":
                // Allow tab to close dropdown
                showDropdown = false;
                selectedIndex = -1;
                break;
        }
    }

    // Focus management
    function handleFocus() {
        if (results.length > 0) {
            showDropdown = true;
        }
    }
</script>

<div class="relative w-full">
    <!-- Search Input -->
    <div class="relative">
        <Search
            class="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-500 dark:text-surface-400"
            size={18}
        />

        <input
            bind:this={searchInput}
            bind:value={searchTerm}
            onkeydown={handleKeydown}
            onfocus={handleFocus}
            {placeholder}
            class="input pl-10 {searchTerm ? 'pr-10' : 'pr-4'} w-full"
            autocomplete="off"
            spellcheck="false"
            role="combobox"
            aria-expanded={showDropdown}
            aria-haspopup="listbox"
            aria-autocomplete="list"
            aria-controls="card-search-bar-dropdown"
        />

        <!-- Clear button -->
        {#if searchTerm && !isLoading}
            <button
                onclick={clearSearch}
                class="absolute right-3 top-1/2 transform -translate-y-1/2 text-surface-500 hover:text-surface-900 dark:text-surface-400 dark:hover:text-surface-100 transition-colors"
                type="button"
                aria-label="Effacer la recherche"
                tabindex="-1"
            >
                <X size={18} />
            </button>
        {/if}

        <!-- Loading indicator -->
        {#if isLoading}
            <div class="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div
                    class="animate-spin w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full"
                ></div>
            </div>
        {/if}
    </div>

    <!-- Dropdown Results -->
    {#if showDropdown}
        <div
            id="card-search-bar-dropdown"
            bind:this={dropdownRef}
            class="card absolute top-full left-0 right-0 mt-1 z-50 max-h-80 overflow-y-auto p-0"
            role="listbox"
        >
            {#if isLoading && results.length === 0}
                <div
                    class="p-4 text-center text-surface-500 dark:text-surface-400"
                >
                    <div
                        class="animate-spin w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full mx-auto mb-2"
                    ></div>
                    Recherche en cours...
                </div>
            {:else if results.length > 0}
                {#each results as card, index (card.id)}
                    <button
                        onclick={() => selectCard(card)}
                        class="bg-cyan-50 w-full text-left p-3 hover:variant-soft focus:variant-soft focus:outline-none transition-colors border-b border-surface-200 dark:border-surface-700 last:border-b-0 {selectedIndex ===
                        index
                            ? 'variant-soft'
                            : ''}"
                        type="button"
                        role="option"
                        aria-selected={selectedIndex === index}
                        tabindex="-1"
                    >
                        <div class="flex items-center gap-3">
                            <!-- Card image -->
                            <div
                                class="w-10 h-14 bg-surface-200 dark:bg-surface-700 rounded flex-shrink-0 overflow-hidden"
                            >
                                {#if card.imageUrl}
                                    <!-- changer par card.front.skin quand l'importation des données sera correct :)  -->
                                    <img
                                        src={card.imageUrl}
                                        alt={card.name}
                                        class="w-full h-full object-cover"
                                        loading="lazy"
                                    />
                                {:else}
                                    <div
                                        class="w-full h-full flex items-center justify-center text-surface-400"
                                    >
                                        <Search size={12} />
                                    </div>
                                {/if}
                            </div>

                            <!-- Card info -->
                            <div class="flex-1 min-w-0">
                                <div class="font-medium text-sm truncate">
                                    {card.name}
                                </div>
                            </div>
                        </div>
                    </button>
                {/each}
            {:else}
                <div
                    class="p-4 text-center text-surface-500 dark:text-surface-400"
                >
                    Aucune carte trouvée pour "{searchTerm}"
                </div>
            {/if}
        </div>
    {/if}
</div>
