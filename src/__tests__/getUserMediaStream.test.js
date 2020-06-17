import getUserMediaStream from '../getUserMediaStream'

describe('getUserMediaStream', () => {
	describe('navigator.permissions is not implemented', () => {
		beforeAll(() => {
			global.navigator.permissions = undefined
		})

		it('rejects promise', async () => {
			try {
				await getUserMediaStream()
			} catch (error) {
				expect(error).toEqual(new Error('PERMISSIONS_NOT_SUPPORTED'))
			}
		})
	})

	describe('navigator.permissions is implemented', () => {
		const mockPermissionsQuery = jest.fn()

		beforeAll(() => {
			global.PermissionStatus = jest.fn(() => ({
				state: 'granted',
				addEventListener: jest.fn(),
			}))
			global.Permissions = jest.fn(() => ({
				query: mockPermissionsQuery,
			}))
			global.navigator.permissions = new Permissions()
		})

		afterAll(() => {
			global.PermissionStatus.mockReset()
			global.Permissions.mockReset()
		})

		describe('navigator.mediaDevices is not implemented', () => {
			beforeAll(() => {
				global.navigator.mediaDevices = undefined
			})

			it('rejects promise', async () => {
				const status = new PermissionStatus()
				status.state = 'prompt'
				mockPermissionsQuery.mockResolvedValue(status)
				try {
					await getUserMediaStream()
				} catch (error) {
					expect(error).toEqual(new Error('MEDIA_DEVICES_NOT_SUPPORTED'))
				}
			})
		})

		describe('navigator.mediaDevices is implemented', () => {
			beforeAll(() => {
				global.MediaDevices = jest.fn(() => ({
					getUserMedia: jest.fn().mockResolvedValue('foo'),
				}))
				global.navigator.mediaDevices = new MediaDevices()
			})

			afterAll(() => {
				global.MediaDevices.mockReset()
			})

			it('rejects promise since user has previously denied permissions', async () => {
				const status = new PermissionStatus()
				status.state = 'denied'
				mockPermissionsQuery.mockResolvedValue(status)
				try {
					await getUserMediaStream()
				} catch (error) {
					expect(error).toEqual(new Error('DENIED_BY_USER'))
				}
			})

			it('resolves promise with stream since user has previously granted permission', async () => {
				const status = new PermissionStatus()
				status.state = 'granted'
				mockPermissionsQuery.mockResolvedValue(status)
				try {
					const stream = await getUserMediaStream()
					expect(stream).toBe('foo')
				} catch (error) {
					throw error
				}
			})

			it('rejects promise since user has been prompted and has denied permissions', async () => {
				const status = new PermissionStatus()
				status.state = 'prompt'
				status.addEventListener = jest.fn((e, cb) => {
					const event = {
						target: {
							state: 'denied',
						},
					}
					cb(event)
				})
				mockPermissionsQuery.mockResolvedValue(status)
				try {
					await getUserMediaStream()
				} catch (error) {
					expect(error).toEqual(new Error('DENIED_BY_USER'))
				}
			})

			it('resolves promise with stream since user has been prompted and has granted permissions', async () => {
				const status = new PermissionStatus()
				status.state = 'prompt'
				status.addEventListener = jest.fn((e, cb) => {
					const event = {
						target: {
							state: 'granted',
						},
					}
					cb(event)
				})
				mockPermissionsQuery.mockResolvedValue(status)
				try {
					const stream = await getUserMediaStream()
					expect(stream).toBe('foo')
				} catch (error) {
					throw error
				}
			})
		})
	})
})
