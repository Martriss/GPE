<script lang="ts">
  import TextareaCustom from "$lib/components/Form/TextareaCustom.svelte";
  import InputTextCustom from "$lib/components/Form/InputTextCustom.svelte";
  import SelectCustom from "$lib/components/Form/SelectCustom.svelte";
  import RadioGroup from "$lib/components/Form/RadioGroup.svelte";
  import DividerWithText from "$lib/components/Divider/DividerWithText.svelte";
  import RadioGroupForImport from "$lib/components/Form/RadioGroupForImport.svelte";
  import ButtonCustom from "$lib/components/Form/ButtonCustom.svelte";

  const mock = [
    { uuid: "", name: "---- Choisir un jeu de référence -----------"},
    { uuid: "mtg", name: "Magic the Gathering"},
    { uuid: "wankil", name: "Wankil"},
    { uuid: "poke", name: "Pokémon"},
    { uuid: "yu", name: "Yu-Gi-Oh"},
    { uuid: "one", name: "One Pièce"},
    { uuid: "lorcana", name: "Lorcana"},
    { uuid: "star wars", name: "Star Wars"},
    { uuid: "dragon", name: "Dragon Ball"}
  ];

  const dataVisibility = [
    { label: "Privé", value: "private", checked: true },
    { label: "Non répertorié", value: "unlisted" },
    { label: "Public", value: "public" }
  ]

  const colorUsed = "var(--color-primary-800)";
</script>

<div>
  <p style:color={colorUsed}>* Champs requis</p>
  <form method="POST">
    <InputTextCustom 
      label="Nom du deck"
      name="name"
      required
      colorRequired={colorUsed}
      placeholder="Entrer un nom de deck"
    />
    <SelectCustom
      label="Jeu de référence"
      name="game"
      options={mock}
      required
      colorRequired={colorUsed}
    />
    <TextareaCustom 
      label="Description"
      name="description"
      rows={4}
      maxlength={500}
      placeholder="Ajouter une description ?"
    />
    <DividerWithText title="Options avancées" />
    <RadioGroup title="Visibilité du deck" name="visibility" checkboxes={dataVisibility}/>
    <RadioGroupForImport title="Importer des cartes à la création ?" />
    <ButtonCustom name="Créer" />
  </form>
</div>
  