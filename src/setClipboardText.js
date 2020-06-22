import getPermission from './getPermission'

/**
 * Returns a promise resolved when the media is authorized and the stream is retrieved
 * @param   data    Content to write into te clipboard
 * @returns {Promise}
 */
export default async (data) => {
	return new Promise(async (resolve, reject) => {
		if (!navigator.clipboard) {
			reject(new DOMException('NOT_FOUND_ERR', 'NotFoundError'))
		} else {
			try {
				const [, text] = await Promise.all([
					await getPermission('clipboard-write'),
					await navigator.clipboard.write(data),
				])
				resolve(text)
			} catch (error) {
				reject(error)
			}
		}
	})
}
