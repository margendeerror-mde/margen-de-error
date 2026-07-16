import fs from 'fs';
const redirects = JSON.parse(fs.readFileSync('redirects.json', 'utf-8'));

const config = `import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return ${JSON.stringify(redirects, null, 6)};
  }
};

export default nextConfig;
`;

fs.writeFileSync('next.config.ts', config);
