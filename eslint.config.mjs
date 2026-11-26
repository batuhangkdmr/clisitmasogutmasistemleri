export default [
  { ignores: [".next/**", "node_modules/**"] },
  { files: ["app/**/*.{js,jsx}"], languageOptions: { ecmaVersion: "latest", sourceType: "module", parserOptions: { ecmaFeatures: { jsx: true } }, globals: { window: "readonly", document: "readonly", FormData: "readonly", URL: "readonly" } }, rules: { "no-undef": "error" } },
];
