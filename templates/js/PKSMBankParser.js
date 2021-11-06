window.addEventListener('bankFileLoaded', parseBankFile);

const BANK_MAGIC = "PKSMBANK"
const BANK_VERSION = 3
const SIZE_OF_UINT32_IN_BYTES = 4
const SIZE_OF_UINT16_IN_BYTES = 2
const ENTRIES_PER_BOX = 30
const ENTRY_DATA_SIZE = 0x148
const ENTRY_PADDING_SIZE = 4

function parseBankFile(event) {
  const file = event.detail;
  if (file.substring(0, 8) != BANK_MAGIC) {
    return;
  }
  const bytes = new TextEncoder().encode(file);
  const dataView = new DataView(bytes.buffer);

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
}
}