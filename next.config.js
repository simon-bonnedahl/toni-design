/** @type {import('next').NextConfig} */
require("dotenv").config();

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: "standalone",
  env: {
    SANITY_TOKEN: process.env.SANITY_TOKEN,
    SANITY_PROJECT_ID: process.env.SANITY_PROJECT_ID,
  },
};

if (
  process.env.LD_LIBRARY_PATH == null ||
  !process.env.LD_LIBRARY_PATH.includes(
    `${process.env.PWD}/node_modules/canvas/build/Release:`
  )
) {
  process.env.LD_LIBRARY_PATH = `${
    process.env.PWD
  }/node_modules/canvas/build/Release:${process.env.LD_LIBRARY_PATH || ""}`;
}

module.exports = nextConfig;
