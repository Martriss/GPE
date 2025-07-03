<script lang="ts">
  import ButtonSubmitCustom from "$lib/components/Form/ButtonSubmitCustom.svelte";
  import InputEmailCustom from "$lib/components/Form/InputEmailCustom.svelte";
  import InputPasswordCustom from "$lib/components/Form/InputPasswordCustom.svelte";
  import type { PageProps } from "./$types";
  import loginPhoto from "$lib/assets/register-picture.webp";

  let { form }: PageProps = $props();
</script>

<!-- Attention la hauteur est en "dur", elle prends en compte la navbar mais si demain celle-ci change cela peut avoir des répercussions ici-->
<div class="flex h-[94vh]">
  <div class="flex-1 overflow-clip hidden lg:block">
    <img
      src={loginPhoto}
      alt="Jeu de carte classique avec uniquement la vu du dos des cartes"
      class="object-cover"
    />
    <p
      class="text-black absolute underline bottom-[1rem] left-[1rem] bg-[rgba(255,255,255,0.8)] px-2 rounded-lg"
    >
      Photo de Klim Musalimov
    </p>
  </div>
  <div class="flex-1 flex flex-col justify-center h-[100%]">
    <div class="flex justify-center mb-16">
      <h1 class="h1">Inscription</h1>
    </div>
    <form method="POST" class="flex flex-col gap-4 mx-4 sm:px-16">
      {#if form?.isMissing || form?.isIncorrect}
        <p class="text-(--color-error-500)">Identifiants incorrects !</p>
      {/if}
      <div class="mt-8 mb-6">
        <InputEmailCustom
          label="Adresse e-mail"
          name="email"
          value={form?.email ?? ""}
          required
        />
      </div>
      <div class="mt-6 mb-8">
        <InputPasswordCustom label="Mot de passe" name="password" required />
      </div>
      <div class="flex justify-center w-[100%]">
        <ButtonSubmitCustom name="S'inscrire" />
      </div>
    </form>
    <div class="flex justify-center mt-2">
      <p>
        Déjà inscrit ? <a
          href="/signin"
          class="text-(--color-primary-500) underline hover:brightness-125"
          >Se connecter</a
        >
      </p>
    </div>
  </div>
</div>
