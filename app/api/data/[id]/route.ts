import moment from "moment"
import { NextRequest, NextResponse } from "next/server"
import { load, save } from "./actions"
import { IRow } from "@/types/row"

interface IProps {
	params: Promise<{
		id: string,
	}>,
}

export async function GET(req: NextRequest, { params }: Readonly<IProps>) {
	const { id } = await params
	const ls = await load(id)
	return NextResponse.json({
		ls,
	})
}

export async function POST(req: NextRequest, { params }: Readonly<IProps>) {
	const { id } = await params
	const body = await req.json()
	const data: IRow = {
		s: id,
		v: body.value,
		t: new Date
	}
	const docId = moment().format(`[${id}]-YYYYMMDD-hhmmss`)
	await save(docId, data)
	const ls = await load(id)
	return NextResponse.json({
		ls,
		body,
	})
}
