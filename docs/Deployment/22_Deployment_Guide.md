# 22 - Production Deployment Guide

This document defines the deployment operations, environment matrix configuration, connection pooling parameters, daily backup crons, and rollback procedures for the SkillBridge Internship Management Portal (IMP).

---

## 1. Vercel Hosting Setup

Follow these steps to deploy the portal to Vercel:

### Step 1: Create a Vercel Project
1. Log in to the [Vercel Dashboard](https://vercel.com/dashboard).
2. Click **Add New** and select **Project**.
3. Import the Git repository linked to your codebase.

### Step 2: Configure Environment Variables
Set the following critical parameters in **Project Settings > Environment Variables**:

| Variable | Scope | Purpose | Example |
|:---|:---|:---|:---|
| `DATABASE_URL` | Production | PgBouncer pooled PostgreSQL transaction string. | `postgresql://user:pass@host:5432/db?connection_limit=10&pgbouncer=true` |
| `DIRECT_URL` | Build / Migrations | Direct database connection string bypassing PgBouncer. | `postgresql://user:pass@host:5432/db` |
| `JWT_SECRET` | Production | Stateless JWT session signing key. | `your_long_cryptographically_secure_random_string` |
| `CERTIFICATE_SECRET` | Production | Timing-safe certificate HMAC signature key. | `your_certificate_signature_secret_key` |
| `NEXT_PUBLIC_APP_URL` | Production | Root hosted URL used for public verification links. | `https://your-app-domain.vercel.app` |

### Step 3: Trigger Initial Build & Migrations
1. In the build settings, confirm the build commands align with `vercel.json`:
   - Build Command: `prisma generate && next build`
   - Install Command: `npm install`
2. Run database migrations during the post-build phase:
   - In production CI/CD workflows, execute database changes by running:
     ```bash
     npx prisma migrate deploy
     ```

---

## 2. Database Connection Pooling (PgBouncer)

To protect the PostgreSQL database from starvation due to serverless connection scaling:
- Ensure the `DATABASE_URL` transaction connection string appends `?connection_limit=10&pgbouncer=true`.
- Always configure `DIRECT_URL` for migration scripts (`npx prisma migrate deploy` or `prisma db push`) to prevent locking issues in PgBouncer.

---

## 3. Scheduled Database Backups

The project includes a database dump utility at `scratch/backup.sh`. To configure automated backups:

### Configure Daily Cron (Linux Staging Host)
Run the script daily using a cron task. To schedule a daily backup at 2:00 AM:
1. Open the crontab editor:
   ```bash
   crontab -e
   ```
2. Append the following entry (replacing with absolute paths):
   ```cron
   0 2 * * * DATABASE_URL="your_prod_database_url" /path/to/your/project/scratch/backup.sh >> /path/to/your/project/backups/backup_cron.log 2>&1
   ```

---

## 4. Rollback Operational Procedures

In the event of a critical runtime error or regression in production:
1. Open the Vercel Project Dashboard.
2. Select **Deployments**.
3. Locate the last healthy deployment version.
4. Click the options menu and select **Rollback**.
5. Vercel will instantly route 100% of network traffic back to the healthy deployment.
