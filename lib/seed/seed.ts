import { dbConnect } from '@/lib/db';
import User from '@/lib/models/User';
import bcrypt from 'bcryptjs';

declare global {
  // prevents re-running in the same server process (per cold start)
  // eslint-disable-next-line no-var
  var __adminSeedDone: boolean | undefined;
}

/**
 * Idempotently ensures an admin user exists.
 * Reads ADMIN_EMAIL and ADMIN_PASSWORD from environment.
 * Safe to call multiple times; it no-ops after the first call per process,
 * and uses an atomic upsert to avoid race conditions.
 */
export async function ensureAdminSeed() {
  if (global.__adminSeedDone) return;
  global.__adminSeedDone = true;

  // If you don't want this to run unless both vars are set, bail early:
  const rawEmail = process.env.ADMIN_EMAIL || '';
  const password = process.env.ADMIN_PASSWORD || '';
  if (!rawEmail || !password) return; // nothing to seed

  const email = rawEmail.toLowerCase().trim();

  await dbConnect();

  // Pre-compute the hash (needed for $setOnInsert)
  const passwordHash = await bcrypt.hash(password, 10);

  // Upsert (atomic) so parallel cold starts won't create duplicates.
  // Requires a unique index on User.email (you already have unique: true in the schema).
  await User.findOneAndUpdate(
    { email },
    {
      $setOnInsert: {
        name: 'Admin',
        email,
        passwordHash,
        role: 'admin',
      },
    },
    { upsert: true, new: false } // new:false returns pre-existing doc if it exists
  );
}
