/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  // trailingSlash: true, // Optional: Add a trailing slash to all paths `/about` -> `/about/`
  // distDir: 'dist', // Optional: Change the output directory `out` -> `dist`
};

const withPlugins = require('next-compose-plugins');
const withTM = require('next-transpile-modules')(['remark-prism']);
const withPostCss = require('postcss')(require('./postcss.config.js'));

module.exports = {
  ...nextConfig,
  ...withPlugins([
    [withTM, {}],
    [withPostCss, {}],
  ]),
};
