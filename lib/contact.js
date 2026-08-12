/**
 * Simulates a contact-form submission. Swap this implementation for a real
 * API route, email provider, or backend call later — ContactForm does not
 * need to change, only this function's internals.
 */
export async function submitContactRequest(values) {
  await new Promise((resolve) => setTimeout(resolve, 700));
  return { ok: true };
}
