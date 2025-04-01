const generateApiExports = require('./generateAPIExports');

module.exports = {
  name: 'api-client-plugin',
  generateComplete(outputPath) {
    generateApiExports(outputPath);
  }
};
