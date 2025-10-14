import { DocumentData } from "firebase-admin/firestore"
import { serverDb } from "./config"

export async function loadDocById(collection_name: string, id: string) {
	return serverDb.collection(collection_name).doc(id).get()
}


// https://cloud.google.com/firestore/docs/manage-data/add-data#web-version-8_2

export async function add(collection_name: string, data: unknown) {
	return serverDb.collection(collection_name).add(data as DocumentData)
}

export async function merge(collection_name: string, id: string, data: unknown) {
	return serverDb.collection(collection_name).doc(id).set(data as DocumentData, { merge: true })
}

export async function update(collection_name: string, id: string, data: unknown) {
	return serverDb.collection(collection_name).doc(id).update(data as DocumentData)
}
