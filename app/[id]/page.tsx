'use client'
import { IRow } from '@/types/row'
import moment from 'moment'
import Link from 'next/link'
import { SubmitEvent, use, useEffect, useRef, useState } from 'react'
import { AlertError } from '../components/alert'

interface IProps {
	params: Promise<{ id: string }>
}


export default function Page({ params }: Readonly<IProps>) {
	const [value, setValue] = useState(0)
	const [saving, setSaving] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [list, setList] = useState<IRow[] | undefined>(undefined)
	const savingRef = useRef(false)
	let { id } = use(params)
	id = id.toUpperCase()
	const url = `/api/data/${id}`

	async function onSubmit(e: SubmitEvent<HTMLFormElement>) {
		e.preventDefault()
		if (savingRef.current) return

		setError(null)
		savingRef.current = true
		setSaving(true)

		try {
			let attempts = 0
			while (true) {
				try {
					const res = await fetch(url, {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({
							value,
						}),
					})

					if (!res.ok) {
						throw new Error(`Request failed with status ${res.status}`)
					}

					const data = await res.json()
					setList(data.ls)
					setValue(0)
					return
				} catch (err) {
					attempts += 1
					if (attempts >= 3) {
						const message = err instanceof Error ? err.message : 'Unable to save value.'
						setError(`Save failed: ${message}`)
						return
					}
					await new Promise(resolve => setTimeout(resolve, attempts * 1000))
				}
			}
		} catch (err) {
			console.error('Failed to save value after retries', err)
			setError('Save failed. Please try again.')
		} finally {
			savingRef.current = false
			setSaving(false)
		}
	}

	useEffect(() => {
		if (list == undefined) {
			fetch(url)
				.then(res => res.json())
				.then(data => {
					setList(data.ls)
				})
		}
	}, [url, id, list, setList])

	return (
		<div className="hero h-full align-top">
			<div className="hero-overlay bg-white dark:bg-gray-900"></div>
			<div className="hero-content flex flex-col text-neutral-content text-center items-start mb-auto">
				<Link href='/' className='text-left text-black dark:text-gray-300 mt-5'>&laquo; Total</Link>
				<form
					className="flex flex-col max-w-sm gap-7 mt-5"
					onSubmit={onSubmit}
				>
					<div className="join">
						<span className="join-item text-8xl px-3">{id}</span>
						<input
							type='number'
							className="input input-xl join-item text-black dark:text-gray-300 text-6xl w-full px-8 py-12"
							min={0}
							max={999}
							value={value || ''}
							aria-label='value'
							onChange={e => setValue(Math.abs(parseInt(e.target.value) || 0))}
							autoFocus />
					</div>
					<button
						className="flex relative btn btn-accent btn-outline text-4xl rounded-2xl w-full p-7"
						disabled={value == 0 || saving}
					>
						<span className="absolute inset-0 flex justify-center items-center">
							{saving ? "Saving" : "Save"}
						</span>
						{
							saving
							&&
							<span className="loading loading-spinner loading-xs absolute right-3"></span>
						}
					</button>
					{error && <AlertError>{error}</AlertError>}
					<div className="overflow-x-auto mt-7">
						<table className="table">
							<tbody>
								{
									list?.map(row => (
										<tr key={row.id}>
											<td className='text-3xl text-black dark:text-gray-300'>{row.v}</td>
											<td className='text-2xl text-gray-400  dark:text-gray-500 text-right'>{moment(row.ts).format('HH:MM')}</td>
										</tr>
									))
								}
							</tbody>
						</table>
					</div>
				</form>
			</div>
		</div >
	)
}
