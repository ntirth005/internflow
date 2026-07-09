import crypto from "crypto";

/**
 * Computes deterministic HMAC-SHA256 hash digest for a student's graduation certificate.
 * Payload format: `studentId|projectId|issuedAt`
 */
export function generateCertificateHash(
  studentId: string,
  projectId: string,
  issuedAt: Date
): string {
  const payload = `${studentId}|${projectId}|${issuedAt.toISOString()}`;
  const secret = process.env.CERTIFICATE_SECRET || "skillbridge_certificate_hmac_sha256_private_secret_key";
  return crypto.createHmac("sha256", secret).update(payload).digest("hex");
}

/**
 * Verifies certificate signature authenticity using Node's timingSafeEqual
 * to defend against timing side-channel attacks.
 */
export function verifyCertificateHash(
  studentId: string,
  projectId: string,
  issuedAt: Date,
  hashToVerify: string
): boolean {
  const expectedHash = generateCertificateHash(studentId, projectId, issuedAt);

  const bufExpected = Buffer.from(expectedHash, "hex");
  const bufVerify = Buffer.from(hashToVerify, "hex");

  if (bufExpected.length !== bufVerify.length) {
    return false;
  }

  return crypto.timingSafeEqual(bufExpected, bufVerify);
}
