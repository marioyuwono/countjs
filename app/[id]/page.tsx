import type { Metadata } from 'next'
import Content from './content'

interface IProps {
	params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: IProps): Promise<Metadata> {
	const { id } = await params

	return {
		title: `${id.toUpperCase()} | KPIN`,
	}
}

export default async function Page({ params }: Readonly<IProps>) {
	const { id } = await params
	return <Content id={id} />
}
