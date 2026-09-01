'use client'
import Link from "next/link"
import { useCallback, useEffect, useState } from "react"
import { IRow } from "../types/row"
import { Reload } from "./components/icons"

interface iRef {
	[name: string]: number
}

const last = 'U'
const letters = Array.from({ length: last.charCodeAt(0) - 'A'.charCodeAt(0) + 1 },
	(_, i) => String.fromCharCode('A'.charCodeAt(0) + i)
)

export default function Home() {
	const [loading, setLoading] = useState(true)
	const [ref, setRef] = useState<iRef | undefined>(undefined)
	const [total, setTotal] = useState(0)
	const [lastUpdate, setLastUpdate] = useState(0)
	const url = `/api/data/all`

	const load = useCallback(() => {
		setLoading(true)
		fetch(url)
			.then(res => res.json())
			.then(data => {
				const values = {} as iRef
				let sum = 0
				let lastUpdated = 0
				data.ls.forEach((row: IRow) => {
					lastUpdated = Math.max(lastUpdated, row.ts)
					values[row.s] = row.v
					sum += row.v
				})
				setTotal(sum)
				setLastUpdate(lastUpdated)
				setRef(values)
				setLoading(false)
			})
	}, [url, setLoading, setRef, setTotal])

	useEffect(() => {
		if (ref == undefined) {
			load()
		}
	}, [ref, load])

	return (
		<div className="hero min-h-screen">
			<div className="hero-overlay bg-white dark:bg-gray-900"></div>
			<div className="hero-content min-h-screen text-neutral-content text-center items-start pt-16">
				<div className="flex flex-col max-w-sm">
					<div className='flex items-center gap-3'>
						<div className='text-4xl text-black text-left dark:text-gray-300'>{loading ? '.' : total}</div>
						<FormatDate ts={lastUpdate} className="text-xs text-teal-500 italic ms-auto" />
						<button className="cursor-pointer" onClick={load} disabled={loading}>
							<Reload className={`size-6 text-black dark:text-gray-300${loading ? ' animate-spin items-center' : ''}`} />
						</button>
					</div>
					<div className='grid grid-cols-3 gap-x-6 gap-y-7 mt-12'>
						{
							letters.map(alphabet => (
								<Link href={`/${alphabet}`} className='join items-center gap-1' key={alphabet}>
									<div className='btn join-item w-7'>
										{alphabet}
									</div>
									<span className='join-item border-0 text-black dark:text-gray-400 hover:text-blue-500 text-right w-7'>
										{loading
											? '.'
											: ref
												? ref[alphabet]
												: ''}
									</span>
								</Link>
							))
						}
					</div>
				</div>
			</div>
		</div >
	)
}

function FormatDate({ ts, className }: { ts: number, className?: string }) {
	if (ts == 0) {
		return null
	} else {
		const dt = new Date(ts)
		const pad = (n: number) => String(n).padStart(2, '0')
		return (
			<p className={className}>
				{pad(dt.getHours())}
				:
				{pad(dt.getMinutes())}
				:
				{pad(dt.getSeconds())}
			</p>
		)
	}
}
