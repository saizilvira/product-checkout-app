module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    moduleFileExtensions: ['js', 'ts', 'json', 'vue'],
    transform: {
        '^.+\\.vue$': '<rootDir>/jest-vue-transformer.cjs',
        '^.+\\.ts$': [
            'ts-jest',
            {
                tsconfig: 'tsconfig.test.json',
                diagnostics: false,
                babelConfig: true
            }
        ],
        '^.+\\.(js|mjs)$': 'babel-jest',
    },
    transformIgnorePatterns: [
        'node_modules/(?!(pinia|nostics|@vue/devtools-api)/)'
    ],
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
        '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/src/__mocks__/fileMock.js'
    },
    testMatch: [
        '**/__tests__/**/*.spec.[jt]s?(x)',
        '**/?(*.)+(spec|test).[jt]s?(x)'
    ],
    collectCoverageFrom: [
        'src/**/*.{js,ts,vue}',
        '!src/main.ts',
        '!src/setupTests.ts',
        '!src/router/index.ts',
        '!src/**/*.d.ts'
    ]
}