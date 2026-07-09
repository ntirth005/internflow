#!/bin/bash

# SkillBridge IMP PostgreSQL Database Backup Utility
# Automatically extracts tables structure and raw contents using pg_dump

set -e

# Configuration
BACKUP_DIR="./backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
OUTPUT_FILE="${BACKUP_DIR}/db_backup_${TIMESTAMP}.sql"
COMPRESSED_FILE="${OUTPUT_FILE}.gz"

# Create backup directory if it does not exist
mkdir -p "${BACKUP_DIR}"

# Ensure database URL is available
if [ -z "${DATABASE_URL}" ]; then
  # Fallback to local default connection parameters
  echo "Warning: DATABASE_URL variable not set. Attempting connection via local default flags..."
  DB_URL="postgresql://postgres:postgres@localhost:5432/skillbridge_imp"
else
  DB_URL="${DATABASE_URL}"
fi

echo "Initiating database backup export..."

# Run pg_dump using the URL connection parameter
# Note: --no-owner is recommended for migrations compatibility
pg_dump "${DB_URL}" --no-owner --clean --if-exists > "${OUTPUT_FILE}"

echo "Database dump complete. Compressing backup file..."

# Compress the SQL dump file
gzip -f "${OUTPUT_FILE}"

echo "Compression complete. Backup stored successfully:"
echo "Location: ${COMPRESSED_FILE}"
echo "Size: $(du -sh ${COMPRESSED_FILE} | cut -f1)"
