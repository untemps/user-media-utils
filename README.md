# @untemps/user-media-utils

Collection of utility functions to manage user permissions.

![.github/workflows/index.yml](https://github.com/untemps/user-media-utils/workflows/.github/workflows/index.yml/badge.svg?branch=master)
[![codecov](https://codecov.io/gh/untemps/user-media-utils/branch/master/graph/badge.svg)](https://codecov.io/gh/untemps/user-media-utils)

## Installation

```bash
yarn add @untemps/user-media-utils
```

## Utils

`getPermission`:

Returns a promise resolved when the permission is granted

```javascript
import { getPermission } from '@untemps/user-media-utils'

const init = async () => {
    try {
    	const status = await getPermission('microphone')
    	if(status === 'granted') {
    	    console.error('Permission is granted')
            ...
    	}
    } catch (error) {
        console.error(error)
    }
}
```

`getUserMediaStream`:

Returns a promise resolved when the permission is granted and the stream is retrieved

```javascript
import { getUserMediaStream } from '@untemps/user-media-utils'

const init = async () => {
    try {
    	const stream = await getUserMediaStream('microphone', { audio: true })
    	if(!!stream) {
    	    const audioContext = new AudioContext()
    	    const streamNode = audioContext.createMediaStreamSource(stream)
            ...
    	} else {
    	    console.error('Stream is not available')
    	}
    } catch (error) {
        console.error(error)
    }
}
```

## Todos

-   Add permissions-based API:
    -   clipboard
    -   geolocation
    -   notification
    -   ...
-   Add commitlint to ensure commit logs are valid
