# OBA Boekhappen (OBA Book Bites)

# Table of contents
* [Assignment](#Assignment)
* [Description](#Description)
* [Prototype](#Prototype)
* [API](#API)
* [Install](#Install)
* * [Clone repository](#Clone-repo)
* * [Usage](#Usage)
* [License](#License)


<a name="Assignment"></a>
# Assignment
I've been tasked to create a single page webapp that helps children from 9-12 years old with their paper. This prototype uses the OBA API to fetch and display books and media from the OBA.

------

<a name="Description"></a>
# Description
This webapp focusses on the ideation phase for crating a paper. Based on a old dutch tradition known as koekhappen (cake bites), children can eat books of their liking. When they're done, they can go to a results page and see the book details.

------

<a name="Prototype"></a>
# Prototype
## Book bites
![](https://github.com/SqueezyDough/project-1-1920/blob/master/github/carousel.png?)

## Overview
![](https://github.com/SqueezyDough/project-1-1920/blob/master/github/res1.png?)
![](https://github.com/SqueezyDough/project-1-1920/blob/master/github/res2.png?)

## Details
# IMAGE HERE

------

<a name="API"></a>

# API
I use the OBA API to load books from a specific category.

------
# Progressive Web App
Progressive web apps brings functionality from native apps to the web. This allows user to have an offline experience, get push notifications, and information can be sychronised in the background. Achieving this would require a service worker to be implemented in your web app. You can also install the app on your dashboard or homescreen with a manifest file, but this is optional.

## Service worker
Service workers allow your web app to behave like a native app.

## Manifest
To make an app feel like it's an app you'll want it on your homescreen or dashboard. With a manifest file you can make your web app installable.
You can write your manifest file yourself, but this means you have to manually convert you app icons to the correct size. As a tip I can recommend to generate your manifest file using a (manifest generator)[https://app-manifest.firebaseapp.com].

<details>
<summary>My manifest file</summary>

I use a simple black theme color and I don't force the app to be in either landscape or portait mode.

```
{
  "name": "Boekhappen",
  "short_name": "Boekhappen",
  "theme_color": "#000000",
  "background_color": "#000000",
  "display": "standalone",
  "Scope": "/",
  "start_url": "/",
  "icons": [
    {
      "src": "images/icons/icon-72x72.png",
      "sizes": "72x72",
      "type": "image/png"
    },
    {... other sizes}
  ],
  "splash_pages": null
}
```
</details>

______

# Performance optimisation

## NPM

## Loading JS Files
I load all javascript files ont he bottom on the page to make them `non-blocking`. Additionally, javascript that only affects one specific page is only included in that page. This decreases the page load for other pages.

## Minifying CSS
I minify my CSS files to decrease file size using gulp. SCSS files are stored in a separate dev folder so the browser does not have to fetch them while they are practically useless for the browser.

## Minifying HTML

## Compressing

## Disabling ETAG

## Image reflow

## Service worker: Pre caching
My service worker precaches the homepage, offline page and css file. These files are important to load the first page.

```
const CORE_ASSETS = [
    '/',
    '/offline',
    '/dist/site.css',
]
```

### Caching all visited pages
Next, I cache all visited pages to provide an (Semi-)offline fallback when the internet connection says 'goodbye'. I do this dynamically using a different cache for every filetype.

<details>
    <summary>Image - cache</summary>
</details>

<details>
    <summary>Code - cache</summary>
    I have a function that returns all filetypes I want to cache when you visit a page.

    ```
        function isCachedFileType(fileType) {
            return ['image', 'font', 'script', 'manifest'].includes(fileType)
        }
    ```

    I check if the file is from a type I want to fetch

    ```
        function isFileGetRequest(request, fileType) {
            return request.method === 'GET' && (request.headers.get('accept') !== null && request.destination.indexOf(`${fileType}`) > -1)
        }
    ```

    I so, I cache the file

    ```
    ...
    } else if (isHtmlGetRequest(e.request) || (isFileGetRequest(e.request, fileType) && isCachedFileType(fileType))) {
        e.respondWith(
            caches.open(`${fileType}-cache`)
                .then(cache => cache.match(e.request.url))
                .then(res => res ? res : fetchAndCache(e.request, `${fileType}-cache`)
                .catch(e => {
                    return caches.open(CORE_CACHE_NAME)
                        .then(cache => cache.match('/offline'))
                })
            )
        )
    }
    ...
    ```
</details>

# Image here


<a name="Install"></a>
# Install
<a name="Clone-repo"></a>
## Clone repository
`git clone https://github.com/SqueezyDough/project-1-1920.git`

<a name="Usage"></a>
## Usage
`Run index.html with live server`

<a name="License"></a>
# License
[MIT](https://github.com/SqueezyDough/frontend-applications/blob/master/LICENSE) @ SqueezyDough
