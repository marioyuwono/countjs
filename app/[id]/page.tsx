'use client'
import React, { use, useEffect, useState } from 'react'
import moment from 'moment'
import { iRow } from '../components/interfaces'
import Link from 'next/link'

interface iProps {
	params: Promise<{ id: string }>
}


export default function Page({ params }: Readonly<iProps>) {
	const [value, setValue] = useState(0)
	const [saving, setSaving] = useState(false)
	const [list, setList] = useState<iRow[] | undefined>(undefined)
	let { id } = use(params)
	id = id.toUpperCase()
	const url = `/api/data/${id}`

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
		<div className="hero min-h-screen">
			<div className="hero-overlay bg-white dark:bg-gray-900"></div>
			<div className="hero-content flex flex-col min-h-screen text-neutral-content text-center items-start">
				<Link href='/' className='text-left text-black dark:text-gray-300'>&laquo; Total</Link>
				<h1 className='text-[10rem] dark:text-gray-500 mx-auto p-0'>{id}</h1>
				<form
					className="flex flex-col max-w-sm gap-7"
					onSubmit={async e => {
						e.preventDefault()
						setSaving(true)
						const res = await fetch(url, {
							method: 'POST',
							body: JSON.stringify({
								value,
							}),
						})
						const data = await res.json()
						setList(data.ls)
						console.log('res:', res)
						setSaving(false)
					}}
				>
					<input
						type='number'
						className="input input-xl text-black dark:text-gray-300 text-6xl w-full px-8 py-[3rem]"
						min={0}
						max={999}
						value={value || ''}
						aria-label='value'
						onChange={e => setValue(Math.abs(parseInt(e.target.value) || 0))}
						autoFocus />
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
