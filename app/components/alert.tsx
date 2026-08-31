"use client"
import { useEffect, useState } from "react"

export function AlertError({ children }: { children?: React.ReactNode }) {
	const [show, setShow] = useState(true)
	const [isClosing, setIsClosing] = useState(false)

	useEffect(() => {
		if (!isClosing) return

		const timer = window.setTimeout(() => setShow(false), 300)
		return () => window.clearTimeout(timer)
	}, [isClosing])

	if (!show) return null

	return (
		<div
			role="alert"
			className={`alert alert-error alert-dash transition-all duration-300 ease-out ${isClosing
				? "pointer-events-none -translate-y-1 opacity-0"
				: "translate-y-0 opacity-100"
				}`}
		>
			<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
				<path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0-10.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.25-8.25-3.286Zm0 13.036h.008v.008H12v-.008Z" />
			</svg>
			<span>{children}</span>
			<span
				className="cursor-pointer ms-auto"
				onClick={() => setIsClosing(true)}
				aria-label="Dismiss"
			>
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
					<path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
				</svg>
			</span>
		</div>
	)
}
