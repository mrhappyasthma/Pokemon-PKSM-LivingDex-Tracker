/**
 * A PSKM script written in PicoC combatible C.
 *
 * To run, place this file on your 3DS in the following SD-card directry:
 *   3ds/PKSM/scripts/universal/
 *
 * 1. Then launch PKSM and click on `Scripts`.
 * 2. Press `Y` to go to "universal" scripts.
 * 3. Press `X` to go to the SD card scripts.
 * 4. Select `living-dex-tracker.c` and follow the prompts.
 */
#include <pksm.h>
#include <stdlib.h>
#include <stdio.h>

int GEN_1 = 151;  // Red, blue, yellow
int GEN_2 = 251;  // Gold, silver, crystal
int GEN_3 = 386;  // Sapphire, ruby, emerald
int GEN_4 = 493;  // Diamond, pearl, platinum
int GEN_5 = 649;  //  Black, white (black 2, white 2)
int GEN_6 = 721;  // X, Y (Omega ruby, alpha sapphire)
int GEN_7_A = 802;  // Sun, moon (ultra sun, ultra moon)
int GEN_7_B = 807;  // Ultra sun, ultra moon
int GEN_7_C = 809;  // Pokemon Let's Go / Pokemon Go
int GEN_8 = 898;  // Sword, Shield TODO: Update when finalized.

int LATEST_GEN = 8;  // TODO: Update anytime pokemon generation changes
int POKEMON_COUNT = GEN_8;  // TODO: Update anytime pokemon count changes

char *missing_pokemon_gen1_set;
char *missing_pokemon_gen2_set;
char *missing_pokemon_gen3_set;
char *missing_pokemon_gen4_set;
char *missing_pokemon_gen5_set;
char *missing_pokemon_gen6_set;
char *missing_pokemon_gen7_set;
char *missing_pokemon_gen8_set;

/** Returns the count of set 'bits' in the array. */
int countSetBits(char *array, int length) {
  int count = 0;
  for (int i = 0; i < length; i++) {
    if (array[i] == 1) {
      count++;
    }
  }
  return count;
}

/** Returns the count of pokemon available unique to each generation. */
int countForGeneration(int gen) {
  if (gen == 1) {
    return GEN_1;
  } else if (gen == 2) {
    return GEN_2 - GEN_1;
  } else if (gen == 3) {
    return GEN_3 - GEN_2;
  } else if (gen == 4) {
    return GEN_4 - GEN_3;
  } else if (gen == 5) {
    return GEN_5 - GEN_4;
  } else if (gen == 6) {
    return GEN_6 - GEN_5;
  } else if (gen == 7) {
    return GEN_7_C - GEN_6;
  } else if (gen == 8) {
    return GEN_8 - GEN_7_C;
  }
  return -1;
}

/** Returns species offset used to map a species number to its generation's array index. */
int speciesOffsetForGeneration(int gen) {
  if (gen == 1) {
    return 0;
  } else if (gen == 2) {
    return GEN_1;
  } else if (gen == 3) {
    return GEN_2;
  } else if (gen == 4) {
    return GEN_3;
  } else if (gen == 5) {
    return GEN_4;
  } else if (gen == 6) {
    return GEN_5;
  } else if (gen == 7) {
    return GEN_6;
  } else if (gen == 8) {
    return GEN_7_C;
  }
  return -1;
}

/** Returns the generation of a given species. */
int generationForSpecies(int species) {
  if (species < 0) {
    return -1;
  } else if (species <= GEN_1) {
    return 1;
  } else if (species <= GEN_2) {
    return 2;
  } else if (species <= GEN_3) {
    return 3;
  } else if (species <= GEN_4) {
    return 4;
  } else if (species <= GEN_5) {
    return 5;
  } else if (species <= GEN_6) {
    return 6;
  } else if (species <= GEN_7_C) {
    return 7;
  } else if (species <= GEN_8) {
    return 8;
  }
  return -1;
}

/** Returns the generation of a given species. */
char *missingPokemonSetForGeneration(int gen) {
  if (gen == 1) {
    return missing_pokemon_gen1_set;
  } else if (gen == 2) {
    return missing_pokemon_gen2_set;
  } else if (gen == 3) {
    return missing_pokemon_gen3_set;
  } else if (gen == 4) {
    return missing_pokemon_gen4_set;
  } else if (gen == 5) {
    return missing_pokemon_gen5_set;
  } else if (gen == 6) {
    return missing_pokemon_gen6_set;
  } else if (gen == 7) {
    return missing_pokemon_gen7_set;
  } else if (gen == 8) {
    return missing_pokemon_gen8_set;
  }
  return -1;
}

float completionPercentageForGeneration(int gen) {
  char *missing_pokemon_set = missingPokemonSetForGeneration(gen);
  int count = countForGeneration(gen);
  int missing_pokemon_count = countSetBits(missing_pokemon_set, count);
  float decimal = 1 - ((float)missing_pokemon_count / (float)count);
  return decimal * 100;  // Convert decimal to percent.
}

int main(int argc, char **argv) {
  if (!gui_choice("Examine living dex progress for a bank?")) {
    return 1;
  }

  /* Select the bank to iterate through. */
  gui_warn("Select the bank that contains your living dex.");
  bank_select();

  enum Generation gen_pkm;
  int boxes = bank_get_size();
  int slot_size = 30;

  char *captured_pokemon_set = calloc(POKEMON_COUNT, sizeof(*captured_pokemon_set));

  for (int box = 0; box < boxes; box++) {
    for (int slot = 0; slot < 30; slot++) {
      char *pkm = bank_get_pkx(&gen_pkm, box, slot);
      if (!pkx_is_valid(pkm, gen_pkm)) {
        free(pkm);
        continue;
      }
      int species = pkx_get_value(pkm, gen_pkm, SPECIES);
      captured_pokemon_set[species - 1] = 1;
      free(pkm);
    }
  }

  int captured_pokemon_count = countSetBits(captured_pokemon_set, POKEMON_COUNT);
  float completion_percentage_decimal = (float)captured_pokemon_count / (float)POKEMON_COUNT;
  char status[35] = {'\0'};
  sprintf(status, "Completion percentage %.2f", completion_percentage_decimal * 100);
  gui_warn(status);

  // Create sets to track the missing pokemon in each generation
  missing_pokemon_gen1_set = calloc(countForGeneration(1), sizeof(*missing_pokemon_gen1_set));
  missing_pokemon_gen2_set = calloc(countForGeneration(2), sizeof(*missing_pokemon_gen2_set));
  missing_pokemon_gen3_set = calloc(countForGeneration(3), sizeof(*missing_pokemon_gen3_set));
  missing_pokemon_gen4_set = calloc(countForGeneration(4), sizeof(*missing_pokemon_gen4_set));
  missing_pokemon_gen5_set = calloc(countForGeneration(5), sizeof(*missing_pokemon_gen5_set));
  missing_pokemon_gen6_set = calloc(countForGeneration(6), sizeof(*missing_pokemon_gen6_set));
  missing_pokemon_gen7_set = calloc(countForGeneration(7), sizeof(*missing_pokemon_gen7_set));
  missing_pokemon_gen8_set = calloc(countForGeneration(8), sizeof(*missing_pokemon_gen8_set));

  for (int i = 0; i < POKEMON_COUNT; i++) {
    // Skip over pokemon that are already caught.
    if (captured_pokemon_set[i] == 1) {
      continue;
    }
    // For any uncaught pokemon, mark it as such in the appropriate set.
    int generation = generationForSpecies(i + 1);
    int offset = speciesOffsetForGeneration(generation);
    char *missing_pokemon_set = missingPokemonSetForGeneration(generation);
    missing_pokemon_set[i - offset] = 1;
  }

  for (int i = 0; i < LATEST_GEN; i++) {
      int generation = i + 1;
      float completion_percentage = completionPercentageForGeneration(generation);
      sprintf(status, "Gen %d completion percentage %.2f", generation, completion_percentage);
      gui_warn(status);
  }

  free(missing_pokemon_gen1_set);
  free(missing_pokemon_gen2_set);
  free(missing_pokemon_gen3_set);
  free(missing_pokemon_gen4_set);
  free(missing_pokemon_gen5_set);
  free(missing_pokemon_gen6_set);
  free(missing_pokemon_gen7_set);
  free(missing_pokemon_gen8_set);
  free(captured_pokemon_set);

  return 0;
}
