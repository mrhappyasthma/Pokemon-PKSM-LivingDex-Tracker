window.addEventListener('bankFileParsed', parsingFinished);

function didChangeSelectedGeneration(e) {
  const gen = generation_picker.value
  const div = document.getElementById('generation_breakdown');
  div.innerHTML = textForGeneration(misisngPokemonForGeneration(gen), gen);
}

function range(start, end) {
  return Array.apply(0, Array(end - start))
    .map((element, index) => index + start);
}

let missingPokemonGen1 = range(1, GEN_1+1)
let missingPokemonGen2 = range(missingPokemonGen1[missingPokemonGen1.length - 1] + 1, GEN_2 + 1)
let missingPokemonGen3 = range(missingPokemonGen2[missingPokemonGen2.length - 1] + 1, GEN_3 + 1)
let missingPokemonGen4 = range(missingPokemonGen3[missingPokemonGen3.length - 1] + 1, GEN_4 + 1)
let missingPokemonGen5 = range(missingPokemonGen4[missingPokemonGen4.length - 1] + 1, GEN_5 + 1)
let missingPokemonGen6 = range(missingPokemonGen5[missingPokemonGen5.length - 1] + 1, GEN_6 + 1)
let missingPokemonGen7 = range(missingPokemonGen6[missingPokemonGen6.length - 1] + 1, GEN_7_C + 1)
let missingPokemonGen8 = range(missingPokemonGen7[missingPokemonGen7.length - 1] + 1, GEN_8 + 1)

function filterLivingDexes(capturedPokemon) {
  const capturedPokemonIDs = new Set();
  for (const pokemon of capturedPokemon) {
    const species = pokemon.species;
    const number = PokemonSpecies[species];
    capturedPokemonIDs.add(number);
  }
  missingPokemonGen1 = missingPokemonGen1.filter(Id => !capturedPokemonIDs.has(Id));
  missingPokemonGen2 = missingPokemonGen2.filter(Id => !capturedPokemonIDs.has(Id));
  missingPokemonGen3 = missingPokemonGen3.filter(Id => !capturedPokemonIDs.has(Id));
  missingPokemonGen4 = missingPokemonGen4.filter(Id => !capturedPokemonIDs.has(Id));
  missingPokemonGen5 = missingPokemonGen5.filter(Id => !capturedPokemonIDs.has(Id));
  missingPokemonGen6 = missingPokemonGen6.filter(Id => !capturedPokemonIDs.has(Id));
  missingPokemonGen7 = missingPokemonGen7.filter(Id => !capturedPokemonIDs.has(Id));
  missingPokemonGen8 = missingPokemonGen8.filter(Id => !capturedPokemonIDs.has(Id));
}

function parsingFinished(event) {
  const capturedPokemon = event.detail;
  filterLivingDexes(capturedPokemon);
}

function countForGeneration(gen) {
  if (gen == 'gen1') {
    return GEN_1;
  } else if (gen == 'gen2') {
    return GEN_2 - GEN_1;
  } else if (gen == 'gen3') {
    return GEN_3 - GEN_2;
  } else if (gen == 'gen4') {
    return GEN_4 - GEN_3;
  } else if (gen == 'gen5') {
    return GEN_5 - GEN_4;
  } else if (gen == 'gen6') {
    return GEN_6 - GEN_5;
  } else if (gen == 'gen7') {
    return GEN_7_C - GEN_6;
  } else if (gen == 'gen8') {
    return GEN_8 - GEN_7_C;
  }
  return -1;
}

function misisngPokemonForGeneration(gen) {
  if (gen == 'gen1') {
    return missingPokemonGen1;
  } else if (gen == 'gen2') {
    return missingPokemonGen2;
  } else if (gen == 'gen3') {
    return missingPokemonGen3;
  } else if (gen == 'gen4') {
    return missingPokemonGen4;
  } else if (gen == 'gen5') {
    return missingPokemonGen5;
  } else if (gen == 'gen6') {
    return missingPokemonGen6;
  } else if (gen == 'gen7') {
    return missingPokemonGen7;
  } else if (gen == 'gen8') {
    return missingPokemonGen8;
  }
  return -1;
}

function textForGeneration(pokemon, generation) {
  let completionPercentage = 1 - (pokemon.length / countForGeneration(generation));
  let output = generation + ' completion percentage: ' + (100 * completionPercentage).toFixed(2) + '%\n';
  if (pokemon.length) {
    output += '<p>Missing:</p>'
    for (const pokemonId of pokemon) {
      output += PokemonSpeciesFromValue(pokemonId) + ' #' + pokemonId + '<br>'
    }
  }
  return output;
}