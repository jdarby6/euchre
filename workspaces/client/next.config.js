// Need to transpile typescript from shared workspace
const withTM = require('next-transpile-modules')([
  '@euchre/shared',
]);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

module.exports = withTM(nextConfig);
