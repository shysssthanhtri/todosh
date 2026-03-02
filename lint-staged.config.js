module.exports = {
  "{app,lib,components,constants,hooks}/**/*.{js,jsx,ts,tsx}": [
    "pnpm lint:fix",
  ],
  "*.ts": ["pnpm lint:fix"],
};
