
export interface IRow {
	s: string
	v: number
	t: Date
}

export interface IRowExt extends IRow {
	id: string
	ts: number
}
