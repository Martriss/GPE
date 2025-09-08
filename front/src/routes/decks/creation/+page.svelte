<script lang="ts">
  import TextareaCustom from "$lib/components/Form/TextareaCustom.svelte";
  import InputTextCustom from "$lib/components/Form/InputTextCustom.svelte";
  import SelectCustom from "$lib/components/Form/SelectCustom.svelte";
  import RadioGroup from "$lib/components/Form/RadioGroup.svelte";
  import DividerWithText from "$lib/components/Divider/DividerWithText.svelte";
  import RadioGroupForImport from "$lib/components/Form/RadioGroupForImport.svelte";
  import ButtonSubmitCustom from "$lib/components/Form/ButtonSubmitCustom.svelte";
  import type { PageProps } from "./$types";
  import type { OptionType } from "$lib/interfaces/InputType";

  let { data, form }: PageProps = $props();

  let rulesetsSelect: OptionType[] = $derived([
    { value: "", label: "---- Choisir un jeu de référence -----------" },
    ...data.rulesets.map((ruleset) => {
      return {
        label: ruleset.name,
        value: ruleset.id,
      };
    }),
  ]);

  const visibilitySaved = form?.visibility || "private";

  const dataVisibility = [
    {
      label: "Privé",
      value: "private",
      checked: visibilitySaved === "private",
    },
    {
      label: "Non répertorié",
      value: "unlisted",
      checked: visibilitySaved === "unlisted",
    },
    {
      label: "Public",
      value: "public",
      checked: visibilitySaved === "public",
    },
  ];

  let valueName: string = $state(form?.name ?? "");
  let valueSelect: string = $derived(form?.game ?? rulesetsSelect[0].value);
  let disabledButton: boolean = $derived(
    valueName.length < 1 || valueSelect === rulesetsSelect[0].value,
  );
</script>

<div class="my-page flex flex-col">
  <div class="flex justify-center">
    <h1 class="h1 my-title">Création d'un nouveau deck</h1>
  </div>
  <br />
  <form
    method="POST"
    action="?/createDeck"
    class="flex flex-col gap-4 my-content"
  >
    <p>* Champs obligatoires</p>
    {#if form?.isMissing}
      <p class="text-(--color-error-500)">
        Veuillez remplir tous les champs obligatoires avant de soumettre votre
        inscription
      </p>
    {/if}
    {#if form?.isError}
      <p class="text-(--color-error-500)">
        {form.message}
      </p>
    {/if}
    <InputTextCustom
      bind:value={valueName}
      label="Nom du deck"
      name="name"
      placeholder="Entrer un nom de deck"
      required
    />
    <SelectCustom
      bind:value={valueSelect}
      label="Jeu de référence"
      name="game"
      options={rulesetsSelect}
      required
    />
    <TextareaCustom
      label="Description (optionnel)"
      name="description"
      value={form?.description}
      rows={4}
      maxlength={500}
      placeholder="Ajouter une description ?"
    />
    <DividerWithText title="Options avancées" />
    <RadioGroup
      title="Visibilité du deck"
      name="visibility"
      checkboxes={dataVisibility}
    />
    <RadioGroupForImport title="Importer des cartes à la création ?" />
    <div class="flex justify-center">
      <ButtonSubmitCustom name="Créer" disabled={disabledButton} />
    </div>
  </form>
</div>

<style>
  .my-page {
    margin: 2rem 1rem;
  }
  .my-title {
    margin-bottom: 1rem;
  }

  @media (width >= 40rem) {
    /* = sm */
    .my-content {
      margin-inline: 5rem;
    }
  }

  @media (width >= 48rem) {
    /* = md  */
    .my-title {
      margin-bottom: 2rem;
      margin-top: 1rem;
    }
  }
  @media (width >= 64rem) {
    /* = lg */
    .my-content {
      margin-inline: 15rem;
    }
  }
</style>
