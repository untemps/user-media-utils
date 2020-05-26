/**
 * Returns a promise resolved when the media is authorized and the stream retrieved
 * @param permissionName            Name of the permission. @see https://w3c.github.io/permissions/#enumdef-permissionname
 * @param mediaStreamConstraints    Constraints object. @see https://developer.mozilla.org/en-US/docs/Web/API/MediaStreamConstraints
 * @returns {Promise}
 */
export const getUserMediaStream = async (permissionName, mediaStreamConstraints) => {
	return new Promise(async (resolve, reject) => {
		if (!navigator.permissions) {
			reject(new Error('PERMISSIONS_NOT_SUPPORTED'))
		} else {
			try {
				const permissionStatus = await navigator.permissions.query({ name: permissionName })
				if (permissionStatus.state === 'denied') {
					reject(new Error('DENIED_BY_USER'))
				} else if (!navigator.mediaDevices) {
					reject(new Error('MEDIA_DEVICES_NOT_SUPPORTED'))
				} else {
					const promises = [await navigator.mediaDevices.getUserMedia(mediaStreamConstraints)]
					if (permissionStatus.state === 'prompt') {
						promises.push(
							await new Promise((resolve) => {
								permissionStatus.addEventListener('change', (event) => {
									if (event.target.state === 'denied') {
										reject(new Error('DENIED_BY_USER'))
									} else {
										resolve()
									}
								})
							})
						)
					}
					const [stream] = await Promise.all(promises)
					resolve(stream)
				}
			} catch (error) {
				reject(error)
			}
		}
	})
}
