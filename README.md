# SnowShoe Stamp Listener

A zero-dependency ES6 listener class for simple stamp detection.

## Installation

```bash
npm install @snowshoe/stamp_listener --save
```

## Usage

### Simple Stamp Detection

```js
import StampListener from '@snowshoe/stamp_listener';

const stampListener = new StampListener();

stampListener.listen((stampDataPoints, reEnableStampScreen) => {
    // stampDataPoints contains the array of data points. It can be passed to the stamp API in this format:
    const stampApiRequestPayload = {data: stampDataPoints};

    // Renable the stamp screen when you're finished (a good place for this is the finally() call of an HTTP client):
    reEnableStampScreen();
})
```

### Listener Configuration Options

```js
import StampListener from '@snowshoe/stamp_listener';

const stampListener = new StampListener({
    stampScreenElementId: 'stamp-screen',   // The ID of a specific element - by default the global "window" object is used.
    preventScrolling: true,                 // Disable scrolling - useful on mobile. 
    preventZooming: true,                   // Disable zooming - useful on mobile.
});
```

### Use an HTTP Client to Authenticate Stamp Data

You can use whichever client you want, but this example uses Axios:

```js
import StampListener from '@snowshoe/stamp_listener';
import axios from 'axios';

// Setup the HTTP client with the SnowShoe API base URL and your SnoeShoe API key:
let httpClient = axios.create({
    baseURL: 'https://api.snowshoestamp.com',
    headers: {
        post: {'SnowShoe-Api-Key': 'YOUR_SNOWSHOE_API_KEY'} // You will receive a 401 response if this key isn't set.
    }
});

const stampListener = new StampListener();

stampListener.listen((stampDataPoints, reEnableStampScreen) => {
    // Send the stamp data points to the API... 
    httpClient.post('/v3/stamp', {
        data: stampDataPoints,
        // If you are passing the stamp data through your server first, this is a good place to add extra data.
    })
        .then(response => {
            console.log(`Successfully verified stamp: ${response.data.stamp.serial}`);
        })
        .catch((error) => {
            const httpStatusCode = error.response?.status;
            if (httpStatusCode === 401) {
                console.log('The API key is most likely incorrect...', error.message);
            } else if (httpStatusCode === 400) {
                console.log('The stamp is most likely not registered...', error.response.data.error.message);
            } else {
                console.log('Some unlikely issue (like a network connection failure) has occurred...', error.message);
            }
        })
        .finally(() => {
            // Don't forget to make the screen stampable again...
            reEnableStampScreen();
        });
});
```


