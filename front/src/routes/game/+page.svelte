<script lang="ts">
  import GameScene from '$lib/components/Game/GameScene.svelte';
</script>

<svelte:head>
  <title>Card Game - Three.js Game Engine</title>
  <meta name="description" content="Interactive 3D card game built with Three.js and SvelteKit" />
</svelte:head>

<div class="game-page h-full w-full">
  <GameScene />
</div>