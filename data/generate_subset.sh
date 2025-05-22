#!/bin/bash

# Vérifie que le fichier source est fourni
if [ $# -eq 0 ]; then
    echo "Usage: $0 <source_json_file>"
    exit 1
fi

SOURCE_FILE="$1"
OUTPUT_FILE="subset_cards.json"

# Génération du sous-ensemble de cartes
jq '
# Définir les types désirés directement dans le filtre
[
    .[] |
    # Traiter les cartes à faces multiples
    if has("card_faces") then
        .card_faces[]
    else
        .
    end |

    # Filtrer par type
    select(
        .type_line |
        split(" — ")[0] |
        test("^(Creature|Instant|Sorcery|Legendary Creature|Enchantment|Artifact|Land)")
    )
] |

# Grouper par type
group_by(.type_line | split(" — ")[0]) |

# Limiter le nombre de cartes par type
map(
    # Ajuster le nombre max par type
    if . | length > (
        if .[0].type_line | split(" — ")[0] == "Creature" then 300
        elif .[0].type_line | split(" — ")[0] == "Instant" then 150
        elif .[0].type_line | split(" — ")[0] == "Sorcery" then 150
        elif .[0].type_line | split(" — ")[0] == "Legendary Creature" then 150
        elif .[0].type_line | split(" — ")[0] == "Enchantment" then 100
        elif .[0].type_line | split(" — ")[0] == "Artifact" then 100
        elif .[0].type_line | split(" — ")[0] == "Land" then 50
        else 50
        end
    ) then
        .[:
            if .[0].type_line | split(" — ")[0] == "Creature" then 300
            elif .[0].type_line | split(" — ")[0] == "Instant" then 150
            elif .[0].type_line | split(" — ")[0] == "Sorcery" then 150
            elif .[0].type_line | split(" — ")[0] == "Legendary Creature" then 150
            elif .[0].type_line | split(" — ")[0] == "Enchantment" then 100
            elif .[0].type_line | split(" — ")[0] == "Artifact" then 100
            elif .[0].type_line | split(" — ")[0] == "Land" then 50
            else 50
            end
        ]
    else
        .
    end
) |

# Aplatir
flatten |

# Limiter à environ 1000 cartes
.[0:1000]
' "$SOURCE_FILE" > "$OUTPUT_FILE"

# Vérifier la répartition des types
echo "Répartition des types de cartes dans le sous-ensemble :"
jq -r '
[group_by(.type_line | split(" — ")[0]) |
    map({
        type: .[0].type_line | split(" — ")[0],
        count: length
    })
] |
flatten |
sort_by(.count) |
reverse |
.[] |
"\(.type): \(.count)"
' "$OUTPUT_FILE"

echo "Fichier de sous-ensemble créé : $OUTPUT_FILE"
