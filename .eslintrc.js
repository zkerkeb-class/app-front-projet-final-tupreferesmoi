module.exports = {
    extends: ['next/core-web-vitals', 'prettier'],
    plugins: ['prettier'],
    rules: {
        'prettier/prettier': 'error',
        'no-unused-vars': 'warn',
        'no-console': 'warn',
        'react/prop-types': 'off',
        'react/react-in-jsx-scope': 'off'
    }
}
