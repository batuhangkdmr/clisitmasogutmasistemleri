export const imageMaxMb = 15;
export const imageMaxBytes = imageMaxMb * 1024 * 1024;
export const imageMimeTypes = ["image/jpeg", "image/png", "image/webp"];
export const imageAccept = imageMimeTypes.join(",");

export function imageFileError(file) {
  if (!file?.size || !imageMimeTypes.includes(file.type)) return "Bir JPG, PNG veya WebP görseli seçin.";
  if (file.size > imageMaxBytes) return `Görsel en fazla ${imageMaxMb} MB olabilir.`;
  return "";
}
