export const MAX_PRODUCT_IMAGES = 10;

export function addProductImages(currentFiles, selectedFiles) {
  const availableSlots = Math.max(
    MAX_PRODUCT_IMAGES - currentFiles.length,
    0,
  );
  const filesToAdd = selectedFiles.slice(0, availableSlots);

  return {
    files: [...currentFiles, ...filesToAdd],
    exceededLimit: filesToAdd.length < selectedFiles.length,
  };
}

export function removeProductImage(files, fileIndex) {
  return files.filter((_, index) => index !== fileIndex);
}
