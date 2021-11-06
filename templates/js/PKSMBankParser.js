window.addEventListener('bankFileLoaded', parseBankFile);

const BANK_MAGIC = "PKSMBANK"
const BANK_VERSION = 3
const SIZE_OF_UINT32_IN_BYTES = 4
const ENTRIES_PER_BOX = 30
const SPECIES_INDEX = 0x08
const ENTRY_DATA_SIZE = 0x148
const ENTRY_PADDING_SIZE = 4

function checkBankMagic(dataView) {
  for (let i = 0; i < BANK_MAGIC.length; i++) {
    if (BANK_MAGIC.charCodeAt(i) != dataView.getInt8(i)) {
      return false;
    }
  }
  return true;
}

function parseBankFile(event) {
  const bytes = event.detail;
  const dataView = new DataView(bytes);
  if (!checkBankMagic(dataView)) {
    alert("File is not a valid Bank file.");
    return;
  }

  var position = 8;
  const version = dataView.getUint32(position, /*littleEndian=*/true);
  position += SIZE_OF_UINT32_IN_BYTES;
  if (version < BANK_VERSION) {
    alert('Script does not support old bank versions. Expected: ' + BANK_VERSION + ' Actual: ' + version);
    return;
  }
  if (version > BANK_VERSION) {
    alert('This version is from the future! This script is still on version: ' + BANK_VERSION + ' Actual: ' + BANK_VERSION);
    return;
  }
  
  const entries = [];
  position = ParseEntries(dataView, position, entries);
  const capturedPokemon = [];
  ParseCapturedPokemon(entries, capturedPokemon);
  
  const totalPokemonCount = Object.keys(PokemonSpecies).length - 3  // UNUSED, UNSPECIFIED, _keys
  const capturedCount = capturedPokemon.length
  const completionPercentage = capturedCount / totalPokemonCount
  let output =  'Overall completion percentage: ' + (100 * completionPercentage).toFixed(2) + '%\n';
  
  const div = document.getElementById('results');
  div.innerHTML = output;
}

/** A helper function to parse entries from the data viewer. */
function ParseEntries(dataView, position, entries) {
  const boxes = dataView.getUint32(position, /*littleEndian=*/true);
  position += SIZE_OF_UINT32_IN_BYTES;
  const entiresCount = boxes * ENTRIES_PER_BOX;
  const buffer = dataView.buffer;
  for (let i = 0; i < entiresCount; i++) {
    // Generation does not appear to be used anymore, so skip this UINT32.
    position += SIZE_OF_UINT32_IN_BYTES;
    const entry = {};
    entry.data = buffer.slice(position, position+ENTRY_DATA_SIZE);
    position += ENTRY_DATA_SIZE;
    position += ENTRY_PADDING_SIZE;
    entries.push(entry);
  }
  return position;
}

const GEN_1 = 151;  // Red, blue, yellow
const GEN_2 = 251;  // Gold, silver, crystal
const GEN_3 = 386;  // Sapphire, ruby, emerald
const GEN_4 = 493;  // Diamond, pearl, platinum
const GEN_5 = 649;  // Black, white (black 2, white 2)
const GEN_6 = 721;  // X, Y (Omega ruby, alpha sapphire)
const GEN_7_A = 802;  // Sun, moon (ultra sun, ultra moon)
const GEN_7_B = 807;  // Ultra sun, ultra moon
const GEN_7_C = 809;  // Pokemon Let's Go / Pokemon Go
const GEN_8 = 898; // Sword, Shield TODO: Update when finalized.

function GameContainingSpecies(species) {
  const number = species.value;
  if (number <= GEN_1) {
    return 'Red, blue, yellow';
  } else if (number <= GEN_2) {
    return 'Gold, silver, crystal';
  } else if (number <= GEN_3) {
    return 'Sapphire, ruby, emerald';
  } else if (number <= GEN_4) {
    return 'Diamond, pearl, platinum';
  } else if (number <= GEN_5) {
    return 'Black (2), White (2)';
  } else if (number <= GEN_6) {
    return 'X, Y, (Omega Ruby, Alpha Sapphire)';
  } else if (number <= GEN_7_A) {
    return 'Sun, Moon, (Ultra Sun, Ultra Moon)';
  } else if (number <= GEN_7_B) {
    return 'Ultra Sun, Ultra Moon';
  } else if (number <= GEN_7_C) {
    return "Pokemon Let's Go / Pokemon Go";
  } else if (number <= GEN_8) {
    return 'Sword, Shield';
  }
  return 'Unknown';
}

/** Helper function to parse info from pokemon in the bank entries. */
function ParseCapturedPokemon(entries, capturedPokemon) {
  for (let entry of entries) {
    const dataView = new DataView(entry.data);
    const species = dataView.getUint16(SPECIES_INDEX, /*littleEndian=*/true);
    if (species == PokemonSpecies.UNUSED || species == PokemonSpecies.UNSPECIFIED) {
      continue;
    }
    const pokemon = {};
    pokemon.species = PokemonSpeciesFromValue(species);
    pokemon.game = GameContainingSpecies(pokemon.species)
    // Avoid adding duplicates
    if (capturedPokemon.filter(item => item.species === pokemon.species).length === 0) {
      capturedPokemon.push(pokemon);
    }
  }
}