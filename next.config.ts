import type { NextConfig } from "next"

const nextConfig: NextConfig = {
	/*! 🌼 daisyUI 5.2.3 */
	/*
	Found 1 warning while optimizing generated CSS:
	
	│ }
	│ @layer base {
	│   @property --radialprogress {
	┆            ^-- Unknown at rule: @property
	┆
	│     syntax: "<percentage>";
	│     inherits: true;
	*/
	experimental: {
		useLightningcss: true,
	},
}

export default nextConfig
