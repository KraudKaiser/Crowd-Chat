// Lista provisional de triggers para imágenes
const imageTriggers = [
  "quiero que renderices una imagen",
  "quiero que crees una imagen",
  "genera una imagen",
  "dibuja una imagen",
  "haz un dibujo",
  "haz una ilustración",
];

export function detectWantsImage(message: string): boolean {
  return imageTriggers.some((t) => message.toLowerCase().includes(t));
}
