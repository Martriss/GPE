<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import { SceneManager } from "$lib/game/managers/SceneManager";

    interface GameSceneProps {
        roomId?: string;
        userId?: string;
        isHost?: boolean;
        ruleset?: any;
    }

    let { roomId, userId, isHost = false, ruleset }: GameSceneProps = $props();

    let container: HTMLDivElement;
    let sceneManager: SceneManager | null = null;

    onMount(() => {
        if (container) {
            console.log("🎮 GameScene initializing with ruleset:", ruleset);

            sceneManager = new SceneManager(container, ruleset);

            // Initialize multiplayer if room and user info are provided
            if (roomId && userId) {
                // Add a small delay to ensure Firebase auth is ready
                setTimeout(() => {
                    try {
                        if (sceneManager) {
                            sceneManager.initializeMultiplayer(
                                roomId,
                                userId,
                                isHost,
                            );
                        }
                    } catch (error) {
                        console.error("Error initializing multiplayer:", error);
                    }
                }, 1000);
            }
        }
    });

    onDestroy(() => {
        if (sceneManager) {
            sceneManager.dispose();
            sceneManager = null;
        }
    });
</script>

<div
    bind:this={container}
    class="game-scene-container w-full h-screen relative"
>
    <!-- The Three.js canvas will be mounted here -->
</div>

<style>
    .game-scene-container {
        background: linear-gradient(135deg, #1a1a2e, #16213e);
        overflow: hidden;
        position: relative;
        z-index: 1;
    }

    :global(.game-scene-container canvas) {
        display: block;
        width: 100% !important;
        height: 100% !important;
        position: relative;
        z-index: 1;
    }
</style>
