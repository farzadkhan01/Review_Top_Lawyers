/** @format */

/**
 * Mock upload handler. The ImageUploader component only depends on this
 * function's signature (file in, { url } out, or a thrown Error) — swap the
 * body for a real storage integration (S3, Cloudinary, etc.) later.
 */
export async function uploadImage(file) {
  await new Promise((resolve) => setTimeout(resolve, 900));

  if (!file.type.startsWith("image/")) {
    const error = new Error("Please upload an image file (PNG, JPG, or WEBP).");
    error.code = "INVALID_FILE_TYPE";
    throw error;
  }

  if (file.size > 5 * 1024 * 1024) {
    const error = new Error("Image must be smaller than 5MB.");
    error.code = "FILE_TOO_LARGE";
    throw error;
  }

  return { url: URL.createObjectURL(file) };
}
