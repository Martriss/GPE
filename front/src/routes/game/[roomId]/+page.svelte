<script lang="ts">
  import GameScene from '$lib/components/Game/GameScene.svelte';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();
</script>

<svelte:head>
  <title>Card Game - Room {data.roomId}</title>
  <meta name="description" content="Interactive 3D multiplayer card game built with Three.js and SvelteKit" />
</svelte:head>

<div class="game-page h-full w-full">
  <GameScene roomId={data.roomId} userId={data.userId} isHost={data.isHost} />
</div>