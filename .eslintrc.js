module.exports = {
    env: {
        browser: true,
        es2021: true,
    },
    extends: [
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:import/errors",
        "plugin:import/warnings",
    ],
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 12,
        sourceType: "module",
    },
    plugins: ["react", "import"],
    rules: {
        "react/react-in-jsx-scope": "off",
        "react/prop-types": "off",
        "import/no-unresolved": "off",
    },
    settings: {
        react: {
            version: "detect",
        },
    },
};
