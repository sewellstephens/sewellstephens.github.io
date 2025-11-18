---
title: Axios vs Javascript fetch
date: 2023-04-03
---

If you've ever dealt with APIs, you've probably heard of several ways to make API calls. Today we're focusing primarily on Fetch and Axios.

First thing to note is that Axios is not like Fetch.

### Lets look at fetch first.

Fetch can call APIs in the frontend and backend depending on cors restrictions without an NPM package unlike Axios. Fetch tipically requires more configuration than Axios, although it isn't too big of a difference. For those who don't want to fool around with NPM to make an API call, I would say fetch is the way to go. A fetch call will look something like this.

```javascript
fetch('https://example.com', {
  method: 'POST',
  body: JSON.stringify(subdata),
})
  .then((response) => response.json())
  .then((subdata) => {
    console.log('Success:');
  })
  .catch((error) => {
    console.error('Error:', error);
  });
```

Axios on the other hand requires an NPM package but requires less code upfront. Axios also is really easy to use. Not that fetch isnt, but I've seen Axios requests that are only two lines of code literally. Axios calls are formatted completely different, meaning that you will need to understand differently. Heres an Axios call for you.

```javascript
const options = {
  url: "https://example.com",
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  data: {
    "id": "example",
    "title": "Example",
    "pubkey": "random"
  }
};

axios(options)
  .then(response => {
    console.log(response.status);
  });
```

Anyway, thats all