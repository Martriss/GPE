<script>
  import ButtonFilled from "$lib/components/Button/ButtonFilled.svelte";
</script>

<div class="flex flex-col mx-4 my-8">
  <div class="flex justify-center mt-[15vh]">
    <h1 class="h1 text-center">Le Grimoire Infini</h1>
  </div>
  <div class="flex flex-col gap-[9.5vh] mt-[19vh] items-center">
    <ButtonFilled name="JOUER" handleClick={(e) => {}} isLarge disabled />
    <ButtonFilled name="REJOINDRE" handleClick={(e) => {}} isLarge disabled />
  </div>
</div>
