/* global process */
import { execSync } from 'child_process';
import fs from 'fs';

process.env.TEST_ENV = 'true';

const prismaSchemaPath = 'prisma/schema.prisma';
const prismaSchemaOriginal = fs.readFileSync(prismaSchemaPath, 'utf8');

const prismaSchemaTest = prismaSchemaOriginal
  .replace('provider = "postgresql"', 'provider = "sqlite"')
  .replace('env("DATABASE_URL")', '"file:./test.db?connection_limit=1"');

fs.writeFileSync(prismaSchemaPath, prismaSchemaTest);

try {
  execSync('npx prisma db push', { stdio: 'inherit' });
} finally {
  fs.writeFileSync(prismaSchemaPath, prismaSchemaOriginal);
}
