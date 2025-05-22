<script lang="ts">
  import TextareaCustom from "$lib/components/Form/TextareaCustom.svelte";
  import InputTextCustom from "$lib/components/Form/InputTextCustom.svelte";
  import SelectCustom from "$lib/components/Form/SelectCustom.svelte";
  import RadioGroup from "$lib/components/Form/RadioGroup.svelte";
  import DividerWithText from "$lib/components/Divider/DividerWithText.svelte";
  import RadioGroupForImport from "$lib/components/Form/RadioGroupForImport.svelte";
  import ButtonCustom from "$lib/components/Form/ButtonCustom.svelte";
  import type { PageProps } from "./$types";
  import type RulesetType from "$lib/interfaces/RulesetType";

  let { data }: PageProps = $props();

  let rulesetsSelect: RulesetType[] = $derived([
    { uuid: "", name: "---- Choisir un jeu de référence -----------" },
    ...data.rulesets,
  ]);

  const dataVisibility = [
    { label: "Privé", value: "private", checked: true },
    { label: "Non répertorié", value: "unlisted" },
    { label: "Public", value: "public" },
  ];
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
    <InputTextCustom
      label="Nom du deck"
      name="name"
      placeholder="Entrer un nom de deck"
      required
    />
    <SelectCustom
      label="Jeu de référence"
      name="game"
      options={rulesetsSelect}
      required
    />
    <TextareaCustom
      label="Description (optionnel)"
      name="description"
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
      <ButtonCustom name="Créer" />
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
