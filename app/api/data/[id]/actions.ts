import { merge } from "@/lib/firestore/access"
import { serverDb } from "@/lib/firestore/config"
import { createAdminClient } from "@/lib/supabase/admin"
import { IRow, IRowExt } from "@/types/row"
import { DocumentData, QuerySnapshot } from "@google-cloud/firestore"
import moment from "moment"

const TABLE_LIST = 'kkr'
const TABLE_SUMMARY = 'kkr_summary'

export async function load(id: string): Promise<IRow[]> {
	if (process.env.SUPABASE_SECRET) {
		return loadFromSupabase(id)
	} else {
		return loadFromFirestore(id)
	}
}

export async function loadFromSupabase(id: string): Promise<IRowExt[]> {
	const name = id.toUpperCase()
	const supabase = createAdminClient()

	const result = name === 'ALL'
		? await supabase.from(TABLE_SUMMARY).select('*').order('s', { ascending: true })
		: await supabase.from(TABLE_LIST)
			.select('*')
			.eq('s', name)
			.order('t', { ascending: false })
			.limit(3)

	if (result.error) {
		throw result.error
	}

	return convertSupabase(result.data ?? [])
}

export async function loadFromFirestore(id: string): Promise<IRowExt[]> {
	const name = id.toUpperCase();

	if (name == 'ALL') {
		// TODO: should be improved. kept for backward compatibility purposes
		const snapshots = await serverDb.collection('kkr')
			.orderBy('t', 'desc')
			.get();
		const found = {} as {
			[name: string]: boolean;
		}
		const ls = convertFirestore(snapshots).filter((row: DocumentData) => {
			if (row.s in found) {
				return false;
			} else {
				found[row.s] = true;
				return true;
			}
		}).sort((a: IRow, b: IRow) => a.s > b.s ? 1 : -1)
		return ls;

	} else {
		const snapshots = await serverDb.collection('kkr')
			.where('s', '==', name)
			.orderBy('t', 'desc')
			.limit(3)
			.get();
		return convertFirestore(snapshots)
	}
}

export async function save(docId: string, data: IRow) {
	if (process.env.SUPABASE_SECRET) {
		return saveToSupabase(data)
	} else {
		return saveToFirestore(docId, data)
	}
}

export async function saveToSupabase(data: IRow) {
	const supabase = createAdminClient()
	const { data: row, error } = await supabase
		.from(TABLE_LIST)
		.insert(data)
		.select()
		.single()

	if (error) {
		throw error
	}

	return row
}

export async function saveToFirestore(docId: string, data: IRow) {
	await merge('kkr', docId, data)
}

export function convertSupabase(rows: IRow[]): IRowExt[] {
	return rows.map(row => ({
		...row,
		id: `${row['s']}-${moment(row.t).format('YYYYMMDD-HHmmss')}`,
		ts: row.t ? new Date(row.t).getTime() : Date.now(),
	}))
}

export function convertFirestore(snapshots: QuerySnapshot<DocumentData>): IRowExt[] {
	return snapshots.docs.map(doc => {
		const data = doc.data()
		data['id'] = doc.id
		data['v'] = parseInt(data.v)
		data['ts'] = data.t._seconds * 1000 + data.t._nanoseconds / 1000 / 1000
		return data as IRowExt
	})
}
