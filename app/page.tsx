'use client'
import { useCallback, useEffect, useState } from "react"
import { iRow } from "./components/interfaces"
import Link from "next/link"
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
	const url = `/api/data/all`

	const load = useCallback(() => {
		setLoading(true)
		fetch(url)
			.then(res => res.json())
			.then(data => {
				let sum = 0
				setRef(prev => {
					if (prev == undefined) {
						prev = {} as iRef
					}
					data.ls.forEach((row: iRow) => {
						console.log('s:', sum, row.v)
						prev[row.s] = row.v
						sum += row.v
					})
					setTotal(sum)
					return prev
				})
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
			<div className="hero-content min-h-screen text-neutral-content text-center items-start pt-[4rem]">
				<div className="flex flex-col max-w-sm">
					<div className='flex gap-3'>
						<div className='text-4xl text-black dark:text-gray-300'>{loading ? '.' : total}</div>
						<button className='ms-auto' onClick={() => load()} disabled={loading}>
							<Reload className={`size-6 text-black dark:text-gray-300${loading ? ' animate-spin items-center' : ''}`} />
						</button>
					</div>
					<div className='grid grid-cols-3 gap-x-6 gap-y-7 mt-[3rem]'>
						{
							letters.map(alphabet => (
								<Link href={`/${alphabet}`} className='join items-center gap-1' key={alphabet}>
									<div className='btn join-item w-7'>
										{alphabet}
									</div>
									<span className='join-item text-black dark:text-gray-400 text-right w-7'>
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