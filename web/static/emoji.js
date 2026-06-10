function emoji2ascii(texto) {
  const mapaEquivalencias = {
    // --- CARAS ALEGRES / SONRISAS ---
    '😀': ':D',    '😃': ':)',    '😄': ':)',    '😁': ':D',
    '😆': 'xD',    '😅': '😅',    '😂': "😂",   '🤣': 'xD',
    '😊': ':-)',   '😇': 'O:)',   '🙂': ':)',    '🙃': '🙃',
    '😉': ';)',

    // --- CARAS DE AMOR / AFECTO ---
    '😍': '*_*',   '🥰': '🥰',    '😘': ':*',    '😗': ':*',
    '😙': ':*',    '😚': ':*',    '😋': ':P',

    // --- CARAS DE ASOMBRO / COOL / LENGUA ---
    '😛': ':P',    '😜': ';P',    '🤪': '🤪',    '😝': 'p:',
    '😎': 'B)',    '🤓': 'B-)',   '🧐': '🧐',    '😲': ':-O',
    '😮': ':O',    '😳': '😳',    '😱': '😱',

    // --- CARAS NEGATIVAS / TRISTES / ENOJO ---
    '😭': ":'(",   '😢': ":'(",   '😥': '😥',    '😞': ':(',
    '😓': '😓',    '😩': '😩',    '😫': '😫',    '🥱': '🥱',
    '😴': 'zzZ',   '🤔': '🤔',    '🤨': '🤨',    '😐': ':|',
    '😑': ':|',    '😒': ':s',    '😓': '😓',    '😔': ':(',
    '😕': ':/',    '🙃': '🙃',    '😲': ':-O',   '☹️': ':(',
    '🙁': ':(',    '😖': '😖',    '😞': ':(',    '😟': ':(',
    '😤': '😤',    '😡': '>:(',   '😠': '>:(',   '🤬': '🤬',

    // --- MANOS / GESTOS ---
    '👍': '(y)',   '👎': '(n)',   '👌': 'OK',    '✌️': 'V',
    '👋': '👋',    '🖐️': '🖐️',    '✋': '✋',    '💪': '💪',
    '🙏': '🙏',    '👏': '👏',    '🙌': '🙌',

    // --- CORAZONES Y SÍMBOLOS ---
    '❤️': '<3',   '💖': '<3',   '💝': '<3',   '💕': '<3',
    '🖤': '<3',   '💔': '</3',  '🌟': '*',     '⭐': '*',
    '✨': '*.*',   '💥': '💥',    '❓': '?',     '❗': '!'
  };

  // Escapa caracteres especiales de regex por seguridad y une las llaves
  const emojis = Object.keys(mapaEquivalencias);
  const patron = new RegExp(emojis.join('|'), 'g');

  return texto.replace(patron, (match) => mapaEquivalencias[match]);
}