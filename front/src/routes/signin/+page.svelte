<script lang="ts">
  import ButtonSubmitCustom from "$lib/components/Form/ButtonSubmitCustom.svelte";
  import InputEmailCustom from "$lib/components/Form/InputEmailCustom.svelte";
  import InputPasswordCustom from "$lib/components/Form/InputPasswordCustom.svelte";
  import type { PageProps } from "./$types";
  import loginPhoto from "$lib/assets/login-picture.webp";
  import { page } from "$app/state";

  let { form }: PageProps = $props();

  let valueEmail: string = $state(form?.email ?? "");
  let valuePassword: string = $state("");
  let disabledButton: boolean = $derived(
    valueEmail.length < 1 || valuePassword.length < 1,
  );

  const redirectTo = page.url.searchParams.get("redirectTo");
</script>

<!-- Attention la hauteur est en "dur", elle prends en compte la navbar mais si demain celle-ci change cela peut avoir des répercussions ici-->
<div class="flex h-[94vh]">
  <div class="flex-1 overflow-clip hidden lg:block">
    <img
      src={loginPhoto}
      alt="Jeu de carte classique. Toutes les cartes sont en noire et blanc, hormis le l'AS de coeur présent au milieu"
      class="object-cover"
    />
    <p
      class="text-black absolute underline bottom-[1rem] left-[1rem] bg-[rgba(255,255,255,0.8)] px-2 rounded-lg"
    >
      Photo de Angshu Purkait
    </p>
  </div>
  <div class="flex-1 flex flex-col justify-center h-[100%]">
    <div class="flex justify-center mb-16">
      <h1 class="h1">Connexion</h1>
    </div>
    <form method="POST" class="flex flex-col gap-4 mx-4 sm:px-16">
      {#if form?.isMissing || form?.isIncorrect}
        <p class="text-(--color-error-500)">Identifiants incorrects !</p>
      {/if}
      <div class="mt-8 mb-6">
        <InputEmailCustom
          label="Adresse e-mail"
          name="email"
          bind:value={valueEmail}
        />
      </div>
      <div class="mt-6 mb-8">
        <InputPasswordCustom
          label="Mot de passe"
          name="password"
          bind:value={valuePassword}
        />
      </div>
      <div class="flex justify-center w-[100%]">
        <ButtonSubmitCustom name="Se connecter" disabled={disabledButton} />
      </div>
    </form>
    <div class="flex justify-center mt-2">
      <p>
        Pas encore inscrire ? <a
          href={redirectTo
            ? `/signup?redirectTo=${encodeURIComponent(redirectTo)}`
            : "/signup"}
          class="text-(--color-primary-500) underline hover:brightness-125"
          >S'inscrire</a
        >
      </p>
    </div>
  </div>
</div>
