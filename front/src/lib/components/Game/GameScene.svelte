<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { SceneManager } from '$lib/game/managers/SceneManager';

  let container: HTMLDivElement;
  let sceneManager: SceneManager | null = null;

  onMount(() => {
    if (container) {
      sceneManager = new SceneManager(container);
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
  }

  :global(.game-scene-container canvas) {
    display: block;
    width: 100% !important;
    height: 100% !important;
  }
</style>