const encoder = new TextEncoder();

const CRC32_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i += 1) {
    let c = i;
    for (let j = 0; j < 8; j += 1) {
      c = (c & 1) !== 0 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[i] = c >>> 0;
  }
  return table;
})();

function crc32(data: Uint8Array): number {
  let crc = 0xffffffff;
  for (let i = 0; i < data.length; i += 1) {
    const byte = data[i];
    crc = CRC32_TABLE[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function toDosDateTime(date: Date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = Math.floor(date.getSeconds() / 2);
  const dosDate = ((year - 1980) << 9) | (month << 5) | day;
  const dosTime = (hours << 11) | (minutes << 5) | seconds;
  return { date: dosDate, time: dosTime };
}

interface ZipFile {
  name: string;
  content: Uint8Array;
}

export function createZip(files: ZipFile[]): Blob {
  const entries: {
    header: Uint8Array;
    data: Uint8Array;
    central: Uint8Array;
    offset: number;
  }[] = [];
  let offset = 0;
  const now = new Date();
  const { date, time } = toDosDateTime(now);

  files.forEach(file => {
    const nameBytes = encoder.encode(file.name);
    const crc = crc32(file.content);
    const headerBuffer = new ArrayBuffer(30 + nameBytes.length);
    const headerView = new DataView(headerBuffer);

    headerView.setUint32(0, 0x04034b50, true);
    headerView.setUint16(4, 20, true);
    headerView.setUint16(6, 0, true);
    headerView.setUint16(8, 0, true);
    headerView.setUint16(10, time, true);
    headerView.setUint16(12, date, true);
    headerView.setUint32(14, crc, true);
    headerView.setUint32(18, file.content.byteLength, true);
    headerView.setUint32(22, file.content.byteLength, true);
    headerView.setUint16(26, nameBytes.length, true);
    headerView.setUint16(28, 0, true);

    const headerBytes = new Uint8Array(headerBuffer);
    headerBytes.set(nameBytes, 30);

    const centralBuffer = new ArrayBuffer(46 + nameBytes.length);
    const centralView = new DataView(centralBuffer);
    centralView.setUint32(0, 0x02014b50, true);
    centralView.setUint16(4, 20, true);
    centralView.setUint16(6, 20, true);
    centralView.setUint16(8, 0, true);
    centralView.setUint16(10, 0, true);
    centralView.setUint16(12, time, true);
    centralView.setUint16(14, date, true);
    centralView.setUint32(16, crc, true);
    centralView.setUint32(20, file.content.byteLength, true);
    centralView.setUint32(24, file.content.byteLength, true);
    centralView.setUint16(28, nameBytes.length, true);
    centralView.setUint16(30, 0, true);
    centralView.setUint16(32, 0, true);
    centralView.setUint16(34, 0, true);
    centralView.setUint32(36, 0, true);
    centralView.setUint32(40, 0, true);
    centralView.setUint32(44, offset, true);
    const centralBytes = new Uint8Array(centralBuffer);
    centralBytes.set(nameBytes, 46);

    entries.push({
      header: headerBytes,
      data: file.content,
      central: centralBytes,
      offset
    });

    offset += headerBytes.byteLength + file.content.byteLength;
  });

  const centralSize = entries.reduce((sum, entry) => sum + entry.central.byteLength, 0);
  const totalSize =
    entries.reduce((sum, entry) => sum + entry.header.byteLength + entry.data.byteLength, 0) +
    centralSize +
    22;
  const buffer = new Uint8Array(totalSize);
  let pointer = 0;

  entries.forEach(entry => {
    buffer.set(entry.header, pointer);
    pointer += entry.header.byteLength;
    buffer.set(entry.data, pointer);
    pointer += entry.data.byteLength;
  });

  entries.forEach(entry => {
    buffer.set(entry.central, pointer);
    pointer += entry.central.byteLength;
  });

  const eocdBuffer = new ArrayBuffer(22);
  const eocdView = new DataView(eocdBuffer);
  eocdView.setUint32(0, 0x06054b50, true);
  eocdView.setUint16(4, 0, true);
  eocdView.setUint16(6, 0, true);
  eocdView.setUint16(8, entries.length, true);
  eocdView.setUint16(10, entries.length, true);
  eocdView.setUint32(12, centralSize, true);
  eocdView.setUint32(16, offset, true);
  eocdView.setUint16(20, 0, true);
  buffer.set(new Uint8Array(eocdBuffer), pointer);

  return new Blob([buffer], { type: 'application/zip' });
}
