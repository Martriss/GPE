import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  writeBatch,
  addDoc,
} from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import fs from "fs/promises";
import dotenv from "dotenv";

dotenv.config();

const RULESET_ID = process.env.FIREBASE_RULESET_ID;

// Configuration Firebase
const firebaseConfig = {
  apiKey: process.env.FIREBASE_APIKEY,
  authDomain: process.env.FIREBASE_AUTHDOMAIN,
  projectId: process.env.FIREBASE_PROJECTID,
  storageBucket: process.env.FIREBASE_STORAGEBUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGINGSENDERID,
  appId: process.env.FIREBASE_APPID,
};

// Initialiser Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

/**
 * Authentifie l'utilisateur avec email/mot de passe
 */
async function authenticate() {
  const email = process.env.FIREBASE_EMAIL;
  const password = process.env.FIREBASE_PASSWORD;

  if (!email || !password) {
    throw new Error(
      "Email ou mot de passe manquant dans les variables d'environnement",
    );
  }

  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );
    console.log("Authentifié avec succès:", userCredential.user.email);
    return userCredential.user;
  } catch (authError) {
    console.error("Erreur d'authentification:", authError);
    console.error("Message:", authError.message);
    console.error("Code:", authError.code);
    throw authError;
  }
}

/**
 * Transforme une carte Scryfall en format compatible avec notre structure Firestore
 */
function transformScryfallCard(scryfallCard) {
  // Extraire les propriétés principales
  const cardProperties = [
    { name: "name", value: scryfallCard.name },
    { name: "mana_cost", value: scryfallCard.mana_cost || "" },
    { name: "type_line", value: scryfallCard.type_line },
    { name: "description", value: scryfallCard.oracle_text || "" },
    { name: "power", value: scryfallCard.power || "" },
    { name: "toughness", value: scryfallCard.toughness || "" },
    { name: "rarity", value: scryfallCard.rarity },
    { name: "set", value: scryfallCard.set },
  ].filter((prop) => prop.value !== ""); // Éliminer les propriétés vides

  // Créer l'objet de carte au format Firestore
  return {
    name: scryfallCard.name,
    nameLower: scryfallCard.name.toLowerCase(), // Pour la recherche
    ruleSetId: RULESET_ID, // Référence au ruleset
    front: {
      cardTypeId: 1, // On simplifie en utilisant un seul type pour l'instant
      skin: `${scryfallCard.set}_${scryfallCard.collector_number}.webp`, // Format de nom de fichier
      properties: cardProperties,
    },
    // Métadonnées et champs additionnels
    originalId: scryfallCard.id,
    scryfallUri: scryfallCard.scryfall_uri,
    imageUrl: scryfallCard.image_uris?.normal || "",
    createdAt: new Date().toISOString(),
    createdBy: auth.currentUser.uid,
  };
}

/**
 * Importe les cartes Scryfall dans Firestore
 */
async function importCards(cardsData) {
  try {
    // Authentification
    const user = await authenticate();

    // ID du ruleset Magic
    const rulesetId = RULESET_ID;

    // Créer le ruleset s'il n'existe pas déjà
    await setDoc(
      doc(db, "rulesets", rulesetId),
      {
        name: "Magic: The Gathering",
        description: "Le jeu de cartes à collectionner original",
        createdBy: user.uid,
        createdAt: new Date().toISOString(),
      },
      { merge: true },
    );

    console.log("Ruleset Magic créé ou mis à jour");

    // Importer les cartes par lots (Firestore limite à 500 opérations par batch)
    const batchSize = 450; // Un peu moins que 500 pour être sûr
    let totalImported = 0;

    for (let i = 0; i < cardsData.length; i += batchSize) {
      const batch = writeBatch(db);
      const currentBatch = cardsData.slice(
        i,
        Math.min(i + batchSize, cardsData.length),
      );

      console.log(
        `Préparation du lot ${Math.floor(i / batchSize) + 1}: ${currentBatch.length} cartes`,
      );

      // Ajouter chaque carte au batch
      for (const scryfallCard of currentBatch) {
        try {
          const transformedCard = transformScryfallCard(scryfallCard);

          // Laisser Firestore générer automatiquement l'ID du document
          const cardRef = doc(collection(db, "rulesets", rulesetId, "cards"));

          batch.set(cardRef, transformedCard);
        } catch (error) {
          console.error(
            `Erreur lors de la transformation de la carte ${scryfallCard.name}:`,
            error,
          );
        }
      }

      // Envoyer le batch à Firestore
      try {
        await batch.commit();
        totalImported += currentBatch.length;
        console.log(
          `Lot ${Math.floor(i / batchSize) + 1} importé avec succès (${totalImported}/${cardsData.length} cartes)`,
        );
      } catch (error) {
        console.error(
          `Erreur lors de l'import du lot ${Math.floor(i / batchSize) + 1}:`,
          error,
        );
        console.error(error);
      }
    }

    console.log(
      `Import terminé: ${totalImported} cartes importées sur ${cardsData.length}`,
    );
  } catch (error) {
    console.error("Erreur lors de l'import:", error);
  }
}

async function main() {
  try {
    // Lire le fichier JSON contenant les cartes
    console.log("Lecture du fichier JSON...");
    const jsonData = await fs.readFile("./subset_cards.json", "utf8");
    const cardsData = JSON.parse(jsonData);

    console.log(`${cardsData.length} cartes trouvées dans le fichier`);

    // Importer les cartes
    await importCards(cardsData);
    process.exit(0);
  } catch (error) {
    console.error("Erreur dans le programme principal:", error);
    process.exit(1);
  }
}

// Exécuter le script
main();
