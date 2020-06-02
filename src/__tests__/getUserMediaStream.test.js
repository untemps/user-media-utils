import getUserMediaStream from '../getUserMediaStream'

import NavigatorPermissionsMock from './NavigatorPermissionsMock'
import NavigatorMediaDevicesMock from './NavigatorMediaDevicesMock'

describe('userMediaUtils', () => {
	describe('getUserMediaStream', () => {
		it('rejects promise since navigator.permissions is not implemented', async () => {
			try {
				await getUserMediaStream()
			} catch (error) {
				expect(error).toEqual(new Error('PERMISSIONS_NOT_SUPPORTED'))
			}
		})

		it('rejects promise since user has previously denied permissions', async () => {
			NavigatorPermissionsMock.mock('denied')
			try {
				await getUserMediaStream()
			} catch (error) {
				expect(error).toEqual(new Error('DENIED_BY_USER'))
			}
		})

		it('rejects promise since navigator.mediaDevices is not implemented', async () => {
			NavigatorPermissionsMock.mock('prompt')
			try {
				await getUserMediaStream()
			} catch (error) {
				expect(error).toEqual(new Error('MEDIA_DEVICES_NOT_SUPPORTED'))
			}
		})

		it('resolves promise with stream since user has previously granted permission', async () => {
			NavigatorPermissionsMock.mock('granted')
			NavigatorMediaDevicesMock.mock('foo')
			try {
				const stream = await getUserMediaStream()
				expect(stream).toBe('foo')
			} catch (error) {
				throw error
			}
		})

		it('rejects promise since user has been prompted and has denied permissions', async () => {
			NavigatorPermissionsMock.mock('prompt', 'denied')
			NavigatorMediaDevicesMock.mock('foo')
			try {
				await getUserMediaStream()
			} catch (error) {
				expect(error).toEqual(new Error('DENIED_BY_USER'))
			}
		})

		it('resolves promise with stream since user has been prompted and has granted permissions', async () => {
			NavigatorPermissionsMock.mock('prompt', 'granted')
			NavigatorMediaDevicesMock.mock('foo')
			try {
				const stream = await getUserMediaStream()
				expect(stream).toBe('foo')
			} catch (error) {
				throw error
			}
		})
	})
})
