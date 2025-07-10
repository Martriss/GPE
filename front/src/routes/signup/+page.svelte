<script lang="ts">
  import ButtonSubmitCustom from "$lib/components/Form/ButtonSubmitCustom.svelte";
  import InputEmailCustom from "$lib/components/Form/InputEmailCustom.svelte";
  import InputPasswordCustom from "$lib/components/Form/InputPasswordCustom.svelte";
  import type { PageProps } from "./$types";
  import loginPhoto from "$lib/assets/register-picture.webp";
  import Check from "@lucide/svelte/icons/check";
  import X from "@lucide/svelte/icons/x";
  import { page } from "$app/state";

  let { form }: PageProps = $props();

  let valueEmail: string = $state(form?.email ?? "");
  let valuePassword: string = $state("");

  let hasCapital: boolean = $derived(/[A-Z]/.test(valuePassword));
  let hasLower: boolean = $derived(/[a-z]/.test(valuePassword));
  let hasNumber: boolean = $derived(/[0-9]/.test(valuePassword));
  let hasSpecial: boolean = $derived(
    /[!@#$%^&*()_+\-={}[\]:;,.?\/]/.test(valuePassword),
  );
  let hasLength: boolean = $derived(
    valuePassword.length <= 4096 && valuePassword.length >= 12,
  );

  let disabledButton: boolean = $derived(
    valueEmail.length < 1 ||
      !hasCapital ||
      !hasLower ||
      !hasNumber ||
      !hasSpecial ||
      !hasLength,
  );

  const redirectTo = page.url.searchParams.get("redirectTo");
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
    <form method="POST" class="flex flex-col lg:gap-4 mx-4 sm:px-16">
      <p>* Champs obligatoires</p>
      {#if form?.isMissing}
        <p class="text-(--color-error-500)">
          Veuillez remplir tous les champs obligatoires avant de soumettre votre
          inscription
        </p>
      {/if}
      {#if form?.isInvalidPwd}
        <p class="text-(--color-error-500)">
          Votre mot de passe ne respect pas notre politique de sécurité de mot
          de passe. Veuillez choisir un mot de passe plus complexe
        </p>
      {/if}
      {#if form?.isInvalidEmail}
        <p class="text-(--color-error-500)">
          Cette adresse mail est déjà utilisé. Veuillez en choisir une autre
        </p>
      {/if}

      <div class="mt-8 mb-6">
        <InputEmailCustom
          label="Adresse e-mail"
          name="email"
          bind:value={valueEmail}
          required
        />
      </div>
      <div class="mt-6 mb-8">
        <InputPasswordCustom
          label="Mot de passe"
          name="password"
          bind:value={valuePassword}
          maxlength={4096}
          required
        />
        <ul>
          <li class="flex gap-4">
            <span>
              {#if hasLength}
                <Check />
              {:else}
                <X />
              {/if}
            </span>Au moins 12 caractères
          </li>
          <li class="flex gap-4">
            <span>
              {#if hasCapital}
                <Check />
              {:else}
                <X />
              {/if}
            </span>Au moins 1 majuscule
          </li>
          <li class="flex gap-4">
            <span>
              {#if hasLower}
                <Check />
              {:else}
                <X />
              {/if}
            </span>Au moins 1 minuscule
          </li>
          <li class="flex gap-4">
            <span>
              {#if hasNumber}
                <Check />
              {:else}
                <X />
              {/if}
            </span>Au moins 1 chiffre
          </li>
          <li class="flex gap-4">
            <span>
              {#if hasSpecial}
                <Check />
              {:else}
                <X />
              {/if}
            </span>Au moins 1 caractère spécial
          </li>
        </ul>
      </div>
      <div class="flex justify-center w-[100%]">
        <ButtonSubmitCustom name="S'inscrire" disabled={disabledButton} />
      </div>
    </form>
    <div class="flex justify-center mt-2">
      <p>
        Déjà inscrit ? <a
          href={redirectTo
            ? `/signin?redirectTo=${encodeURIComponent(redirectTo)}`
            : "/signin"}
          class="text-(--color-primary-500) underline hover:brightness-125"
          >Se connecter</a
        >
      </p>
    </div>
  </div>
</div>
