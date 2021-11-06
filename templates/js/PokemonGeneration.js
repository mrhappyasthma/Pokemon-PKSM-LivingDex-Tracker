// Based on PKSM-Core enums/Generation.hpp
const PokemonGeneration = {
  "ONE": 7,
  "TWO": 8,
  "THREE": 6,
  "FOUR": 0,
  "FIVE": 1,
  "SIX": 2,
  "SEVEN": 3,
  "LGPE": 4,
  "EIGHT": 5,
  "UNUSED": 0xFFFFFFFF
}

PokemonGeneration._keys = Object.keys(PokemonGeneration).sort(function(a, b){
  return PokemonGeneration[a] - PokemonGeneration[b];
});

Object.freeze(PokemonGeneration);

function PokemonGenerationFromValue(value) {
  return PokemonGeneration._keys[value];
}