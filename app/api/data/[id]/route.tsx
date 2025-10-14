import { iRow } from "@/app/components/interfaces"
import { serverDb } from "@/app/firestore/config"
import { merge } from "@/app/firestore/methods"
import { DocumentData, QuerySnapshot } from "firebase-admin/firestore"
import moment from "moment"
import { NextRequest, NextResponse } from "next/server"

interface iProps {
	params: Promise<{
		id: string,
	}>,
}

export async function GET(req: NextRequest, { params }: Readonly<iProps>) {
	const { id } = await params
	const ls = await load(id)
	return NextResponse.json({
		ls,
	})
}

export async function POST(req: NextRequest, { params }: Readonly<iProps>) {
	const { id } = await params
	const body = await req.json()
	const data = {
		s: id,
		v: body.value,
		t: new Date
	}
	const docId = moment().format(`[${id}]-YYYYMMDD-hhmmss`)
	await merge('kkr', docId, data)
	const ls = await load(id)
	return NextResponse.json({
		ls,
		body,
	})
}

async function load(id: string): Promise<iRow[]> {
	const name = id.toUpperCase()

	if (name == 'ALL') {
		// TODO: should be improved. kept for backward compatibility purposes
		const snapshots = await serverDb.collection('kkr')
			.orderBy('t', 'desc')
			.get()
		const found = {} as {
			[name: string]: boolean,
		}
		const ls = convert(snapshots).filter((row: DocumentData) => {
			if (row.s in found) {
				return false
			} else {
				found[row.s] = true
				return true
			}
		}).sort((a: iRow, b: iRow) => a.s > b.s ? 1 : -1)
		return ls

	} else {
		const snapshots = await serverDb.collection('kkr')
			.where('s', '==', name)
			.orderBy('t', 'desc')
			.limit(3)
			.get()
		return convert(snapshots)
	}
}

function convert(snapshots: QuerySnapshot<DocumentData>): iRow[] {
	return snapshots.docs.map(doc => {
		const data = doc.data()
		data['id'] = doc.id
		data['v'] = parseInt(data.v)
		data['ts'] = data.t._seconds * 1000 + data.t._nanoseconds / 1000 / 1000
		return data as iRow
	})
}