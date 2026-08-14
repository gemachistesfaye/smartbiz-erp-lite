const path = require('path');

module.exports = {
  '*.{ts,tsx,js,jsx}': (files) => {
    const frontendFiles = files.filter((f) => f.startsWith('frontend/'));
    const backendFiles = files.filter((f) => f.startsWith('backend/'));

    const commands = [];

    if (frontendFiles.length > 0) {
      const relFiles = frontendFiles
        .map((f) => path.relative('frontend', f))
        .filter((f) => !f.startsWith('dist'));
      if (relFiles.length > 0) {
        commands.push(
          `cd frontend && npx eslint --fix ${relFiles.map((f) => `"${f}"`).join(' ')}`,
        );
      }
    }

    if (backendFiles.length > 0) {
      const relFiles = backendFiles
        .map((f) => path.relative('backend', f))
        .filter((f) => !f.startsWith('dist'));
      if (relFiles.length > 0) {
        commands.push(
          `node lint-backend.mjs ${relFiles.map((f) => `"${f}"`).join(' ')}`,
        );
      }
    }

    return commands.length > 0 ? commands : [];
  },
  '*.{json,md,yml,yaml}': ['prettier --write'],
};
