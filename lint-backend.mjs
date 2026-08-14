// lint-backend.mjs - Cross-platform backend ESLint runner
// Sets ESLINT_USE_FLAT_CONFIG=false and runs eslint on the given files
import { execSync } from 'child_process';

const files = process.argv.slice(2);
if (files.length === 0) process.exit(0);

const cmd = `npx eslint --fix ${files.map(f => `"${f}"`).join(' ')}`;
execSync(cmd, {
  cwd: 'backend',
  stdio: 'inherit',
  env: { ...process.env, ESLINT_USE_FLAT_CONFIG: 'false' },
});
