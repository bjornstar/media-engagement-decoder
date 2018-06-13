const fs = require('fs');

function IsEOL(value) {
  return (value & 0x80) != 0;
}

function IsMatch(value, key) {
  console.log(String.fromCharCode(value & 0x7F));
  return (value & 0x7F) == key;
}

function GetReturnValue(value) {
  if ((value & 0xE0) == 0x80) {
    return value & 0x1F;
  }
}

function GetNextOffset(graph, index) {
  let nextOffset = index;
  let bytesConsumed = 1;

  const value = graph[index];

  switch(value & 0x60) {
  case 0x60:
    nextOffset += ((graph[index] & 0x1F) << 16) | (graph[index + 1] << 8) | graph[index + 2];
    bytesConsumed = 3;
    break;
  case 0x40:
    nextOffset += ((graph[index] & 0x1F) << 8) | graph[index + 1];
    bytesConsumed = 2;
    break;
  default:
    nextOffset += graph[index] & 0x3F;
  }

  if ((value & 0x80) != 0) {
    return false;
  }
  return nextOffset;
}

function testIsEOL(graph) {
  let sinceLast = '';
  for (let i = 0; i < graph.length; i += 1) {
    const isEOL = IsEOL(graph[i]);
    if (isEOL) {
      console.log(i, graph[i], sinceLast);
      sinceLast = '';
    } else {
      sinceLast += String.fromCharCode(graph[i]);
    }
  }
}

function testIsMatch(graph, key) {
  for (let i = 0; i < graph.length; i += 1) {
    const isMatch = IsMatch(graph[i], key);
    if (isMatch) {
      console.log(i, graph[i]);
    }
  }
}

function testGetReturnValue(graph) {
  for (let i = 0; i < graph.length; i += 1) {
    const returnValue = GetReturnValue(graph[i]);
    if (returnValue !== undefined) {
      console.log(i, returnValue);
    }
  }
}

function testGetNextOffset(graph) {
  for (let i = 0; i < 100; i += 1) {
    const nextOffset = GetNextOffset(graph, i);
    console.log(i, nextOffset);
  }
}

function testAdvance(graph, char) {
  let nextOffset = GetNextOffset(graph, 0);
  let isLastCharInLabel = IsEOL(graph[nextOffset]);
  let isMatch = IsMatch(graph[nextOffset], char);

  console.log({ isLastCharInLabel, isMatch });

}

const sources = [
  'preloaded_data.bd4ae5580a2f042107194b9cd10cae9017dae99e.dafsa',
  'preloaded_data.3218878932c1c5832f080fc3a327514b82497389.dafsa',
  'test1.dafsa',
  'test2.dafsa'
];

fs.readFile(sources[3], (error, buffer) => {
  // testIsEOL(buffer);
  // testIsMatch(buffer, 'g'.charCodeAt(0));
  // testGetReturnValue(buffer);
  // testGetNextOffset(buffer);
  testAdvance(buffer, 'a'.charCodeAt(0));
});
