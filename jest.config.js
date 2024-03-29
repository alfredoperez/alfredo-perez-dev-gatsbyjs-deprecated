module.exports = {
  cacheDirectory: '<rootDir>/.cache/unit',
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.spec.json',
    },
    __PATH_PREFIX__: ``,
  },
  moduleDirectories: ['node_modules', 'src'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    '.+\\.(css|styl|less|sass|scss)$': `identity-obj-proxy`,
    '.+\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': `<rootDir>/utils/jest/mocks/file-mock.js`,
    '@/(.*)': '<rootDir>/src/$1',
  },
  preset: 'ts-jest',
  rootDir: '.',
  setupFiles: [`<rootDir>/utils/jest/loadershim.js`],
  setupFilesAfterEnv: ['<rootDir>/utils/jest/setup.ts'],
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: [
    '<rootDir>/utils/jest/mocks/*',
    'node_modules',
    '\\.cache',
    '<rootDir>.*/public',
  ],
  testURL: `http://localhost`,
  transform: { '^.+\\.[tj]sx?$': 'ts-jest' },
  transformIgnorePatterns: [`node_modules/(?!(gatsby)/)`],
}
