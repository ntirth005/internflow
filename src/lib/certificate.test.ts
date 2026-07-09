import { test } from "node:test";
import assert from "node:assert";
import { generateCertificateHash, verifyCertificateHash } from "./certificate";

test("generateCertificateHash - should generate deterministic HMAC-SHA256 signature", () => {
  const studentId = "student-123";
  const projectId = "project-abc";
  const issuedAt = new Date("2026-07-09T12:00:00.000Z");

  const hash1 = generateCertificateHash(studentId, projectId, issuedAt);
  const hash2 = generateCertificateHash(studentId, projectId, issuedAt);

  // Determinism check
  assert.strictEqual(hash1, hash2);
  // Length check (hex encoded SHA256 digest is always 64 characters long)
  assert.strictEqual(hash1.length, 64);
});

test("verifyCertificateHash - should verify matching certificate signature correctly", () => {
  const studentId = "student-123";
  const projectId = "project-abc";
  const issuedAt = new Date("2026-07-09T12:00:00.000Z");

  const hash = generateCertificateHash(studentId, projectId, issuedAt);

  const isValid = verifyCertificateHash(studentId, projectId, issuedAt, hash);
  assert.strictEqual(isValid, true);
});

test("verifyCertificateHash - should reject modified signature", () => {
  const studentId = "student-123";
  const projectId = "project-abc";
  const issuedAt = new Date("2026-07-09T12:00:00.000Z");

  const hash = generateCertificateHash(studentId, projectId, issuedAt);
  // Modify one character at the end of the hash signature
  const corruptedHash = hash.substring(0, 63) + (hash[63] === "a" ? "b" : "a");

  const isValid = verifyCertificateHash(studentId, projectId, issuedAt, corruptedHash);
  assert.strictEqual(isValid, false);
});

test("verifyCertificateHash - should reject signature length mismatch", () => {
  const studentId = "student-123";
  const projectId = "project-abc";
  const issuedAt = new Date("2026-07-09T12:00:00.000Z");

  const hash = generateCertificateHash(studentId, projectId, issuedAt);
  const truncatedHash = hash.substring(0, 32);

  const isValid = verifyCertificateHash(studentId, projectId, issuedAt, truncatedHash);
  assert.strictEqual(isValid, false);
});
