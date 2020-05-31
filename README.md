# @untemps/user-media-utils

Collection of utility functions to manage user media permissions.

![.github/workflows/index.yml](https://github.com/untemps/user-media-utils/workflows/.github/workflows/index.yml/badge.svg?branch=master)

## Installation

```bash
yarn add @untemps/user-media-utils
```

## Utils

*getUserMediaStream*:

Returns a promise resolved when the media is authorized and the stream is retrieved

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

-   Rewrite with TypeScript
-   Add commitlint to ensure commit logs are valid
