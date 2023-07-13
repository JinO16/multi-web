function cssLoader(css) {
  return `module.exports = ${JSON.stringify(css)}`;
}

module.exports = cssLoader