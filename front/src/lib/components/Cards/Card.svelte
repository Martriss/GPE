<script lang="ts">
  import type CardType from "$lib/interfaces/CardType";

  interface CardProps extends CardType {}

  let { name, front } = $props();
</script>

<img alt={`image de la carte ${name}`} src={front.skin} />

<style>
  img {
    aspect-ratio: 1 / 2.449;
    height: 20.81rem;
    width: auto;
  }
</style>
