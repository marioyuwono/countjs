interface iIcon {
	className?: string
}

export function Reload({ className }: iIcon) {
	// heroicons
	if (!className) {
		className = 'size-6'
	}
	return (
		<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={className}>
			<path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
		</svg>
	)
}

export function Loading({ className }: iIcon) {
	// https://magecdn.com/tools/svg-loaders/3-dots-bounce/
	if (!className) {
		className = 'size-6'
	}
	return (
		<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={className}>
			<circle cx="4" cy="12" r="3">
				<animate id="spinner_qFRN" begin="0;spinner_OcgL.end+0.25s" attributeName="cy" calcMode="spline" dur="0.6s" values="12;6;12" keySplines=".33,.66,.66,1;.33,0,.66,.33" />
			</circle >
			<circle cx="12" cy="12" r="3">
				<animate begin="spinner_qFRN.begin+0.1s" attributeName="cy" calcMode="spline" dur="0.6s" values="12;6;12" keySplines=".33,.66,.66,1;.33,0,.66,.33" />
			</circle>
			<circle cx="20" cy="12" r="3">
				<animate id="spinner_OcgL" begin="spinner_qFRN.begin+0.2s" attributeName="cy" calcMode="spline" dur="0.6s" values="12;6;12" keySplines=".33,.66,.66,1;.33,0,.66,.33" />
			</circle>
		</svg >
	)
}
