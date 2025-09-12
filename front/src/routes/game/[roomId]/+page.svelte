<script lang="ts">
    import GameScene from "$lib/components/Game/GameScene.svelte";
    import type { PageData } from "./$types";

    let { data }: { data: PageData } = $props();
</script>

<svelte:head>
    <title>Card Game - Room {data.roomId}</title>
    <meta
        name="description"
        content="Interactive 3D multiplayer card game built with Three.js and SvelteKit"
    />
</svelte:head>

<div class="game-page h-full w-full">
    {#if data.room?.ruleset}
        <GameScene
            roomId={data.roomId}
            userId={data.userId}
            isHost={data.isHost}
            ruleset={data.room.ruleset}
            decks={data.room.decks}
        />
    {:else}
        <div class="error-container">
            <h2>⚠️ Configuration de jeu manquante</h2>
            <p>Aucun ruleset trouvé pour cette partie.</p>
            <GameScene
                roomId={data.roomId}
                userId={data.userId}
                isHost={data.isHost}
            />
        </div>
    {/if}
</div>

<style>
    .error-container {
        padding: 2rem;
        text-align: center;
        color: var(--color-warning-500, #fbbf24);
        background: var(--color-surface-800, #1f2937);
        border-radius: 8px;
        margin: 1rem;
    }
</style>
