module.exports = {
    transform: {
    '^.+\\.(t|j)sx?$': '@swc/jest',
    },
    setupFiles: ['<rootDir>/jest.setup.js'],
   }
   