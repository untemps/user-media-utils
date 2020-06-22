import getPermission from './getPermission'

/**
 * Returns a promise resolved when the media is authorized and the stream is retrieved
 * @returns {Promise}
 */
export default async () => {
	return new Promise(async (resolve, reject) => {
		if (!navigator.clipboard) {
			reject(new DOMException('NOT_FOUND_ERR', 'NotFoundError'))
		} else {
			try {
				const [, text] = await Promise.all([
					await getPermission('clipboard-read'),
					await navigator.clipboard.read(),
				])
				resolve(text)
			} catch (error) {
				reject(error)
			}
		}
	})
}
