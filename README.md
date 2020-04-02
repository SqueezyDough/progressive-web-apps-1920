# OBA Boekhappen (OBA Book Bites)

# Table of contents
* [Assignment](#Assignment)
* [Description](#Description)
* [Prototype](#Prototype)
* [API](#API)
* [Install](#Install)
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

<a name="Install"></a>
# Install Notes
## Clone repository
`git clone https://github.com/SqueezyDough/.git`

## Install packages
`npm run install`

## Usage
`npm run start`

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
# IMAGE HERE

## Compressing

## Disabling ETAG
# DISCRIPTION
```
 app.set('etag', false)
```

## Image reflow

## Service worker caching

### Precaching
My service worker precaches the homepage, offline page and css file. These files are important to load the first page.

```
const CORE_ASSETS = [
    '/',
    '/offline',
    '/dist/site.css',
]
```

------

### Caching all visited pages
Next, I cache all visited pages to provide an (Semi-)offline fallback when the internet connection says 'goodbye'. I do this dynamically using a different cache for every filetype.

------

#### Known Issue and how to solve it
#### The issue
When the user saves a book it will be displayed on the overview page. The overview page is then cached so it is available offline. When this happens the page becomes static as it will always fetch this page from the cache now. New choices will not be added until the caches are emptied.

#### Precaching won't solve it
The overview page displays all your current choices. Because this is dynamic the overview page is empty without interaction from the user and therefore cannot be precached.

#### The solution
The solution is to add a hash to every html file (or at least the overview page). When a new version of the page is available the service worker will compare these hashes. When they are different the service worker will replace the old page with the new one.

*Due to time constraints I sadly couldn't implement this feature.

------

### Caching other filetypes
To speed up the load time I also fetch other file types. I wrote a function to handle this dynamically.

<details>
    <summary>Image - cache</summary>
</details>

<details>
    <summary>Code - cache</summary>
    I have a function that checks if a value contains one of these filetypes.

    ```
        function isCachedFileType(fileType) {
            return ['image', 'font', 'script', 'manifest'].includes(fileType)
        }
    ```

    I check if the file is from a type I want to fetch also using the function as fescribed above.

    ```
        function isFileGetRequest(request, fileType) {
            return request.method === 'GET' && (request.headers.get('accept') !== null && request.destination.indexOf(`${fileType}`) > -1)
        }
    ```

    If so, I cache the file

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

------

### Problems with caching images
#### The issue
OBA's API has a problem when fetching images. When fetching server side, you don't need CORS and you need to use `trim()` to remove spaces. When fetching client-side you do need CORS however and this is where our problem begins.

My function sees an object of type `image` and says 'Good, let's cache that the usual way', however this image in particular fetches it from the OBA API and therefore requires CORS. Other file types that are stored on the server itself do NOT require CORS however. This means I need another function to check if this object requires CORS.

<details>
<summary>Solution</summary>

I handle this problem as follows:

I need to build the URL based on the properties of the request.
```
function fetchAndCache(request, cacheName) {
const url = buildUrl(request)

... other stuff
}

```

The cors prefix is added to destination paths that include `image` and `data.bibliotheek.nl`. If this fails it returns the original URL.
```
function buildUrl(req) {
    const cors = 'https://cors-anywhere.herokuapp.com/'
    return (req.destination === 'image' && req.url.includes('data.bibliotheek.nl') ? `${cors}${req.url}` : req.url)
}
```

</details>

------

### Web fonts cache
Another idea I had is to cache web fonts. As with images, loading web fonts can be a heavy task, since they have to load seperately. Caching them makes sense because fonts aren't updated frequently.

------

#### What the internet is saying

Other sources confirm the importance of storing webfonts as well.

<details>
<summary>Sources about the importance of caching webfonts</summary>

> Proper caching is a must
If your web application uses a service worker, serving font resources with  a cache-first strategy is appropriate for most use cases. You should not | store fonts using localStorage or IndexedDB; each of those has its own set of performance issues.

Source: [developers.google.com](https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/webfont-optimization)

> Since fonts are static resources that aren’t frequently updated, they can be cached locally in the browser, saving users having to download your fonts again the next time they access your site. This way, the amount of data the user’s browser has to download, as well as the number of HTTP requests, are reduced.

> Google’s Web Fundamentals guide recommends making sure your servers provide a long-lived max-age timestamp and a revalidation token to allow for efficient font reuse between different pages on your site.

Source: [WP Rocket](https://wp-rocket.me/blog/guide-web-font-optimization/)

</details>

------

#### Licenses
But is it allowed to cache fonts on your user's computer? It's hard to give a definite answer, since font licenses might vary per distributor / creator, but here's a quick overview.

| Distributor | Personal or non-commercial use | Commercial use
|-------------|:------------------------------:|----------------
| Google fonts (Open source)| allowed | allowed |
| Microsoft | not allowed | not allowed |
| Dafont.com | varies | varies |

Sources:
* [Google fonts FAQ](https://developers.google.com/fonts/faq)
* [Microsoft font FAQ](https://docs.microsoft.com/en-us/typography/fonts/font-faq)
* [Dafont FAQ](https://www.dafont.com/faq.php#copyright)

------

##### Caching
Google fonts are already cached if you use a link instead of downloading it for a whole year. This also means if you visit a page which also uses a cached font, it doesn't need to download again.

Source: [Smashing magazine](https://www.smashingmagazine.com/2019/06/optimizing-google-fonts-performance/)

If you choose to self-host a font this is also allowed by Google, but again other distributors might handle this differently. From my research it's hard to find caching mentioned explicitly in most EULA's. [House Industries](https://houseind.com/license/) is mentioning it however:

> The Licensed Software may not be copied or duplicated in any form except for storage or caching as may temporarily occur during proper use of the Licensed Software, and, optionally, a single copy solely for backup purposes. The Licensed Software and its related documentation may not be resold, rented, leased, sublicensed or lent to another person or entity.

[Microsoft](https://docs.microsoft.com/en-us/typography/fonts/font-faq) is only mentioning the restriction of redistribution. Since caching can be viewed as redistribution / copying it can be assumed that caching is not allowed, but further clarifications by Microsoft and other distributers might be necessary.


------

#### Conclusion
When caching fonts the general rules for using fonts still apply. The font should either be free for personal / commercial use or you have to pay a license fee. Caching fonts is the same as redistribution / copying fonts on other computers. If the license doesn't mention explicitly that caching is excluded from that rule, the distribution restriction should be followed, and therefore fonts should NOT be cached without risking a fine. 

Google Fonts is allowing caching for all their free fonts however and many web articles verify the importance of caching webfonts to improve the overall performance of your webapp. So if you want to play it safe, use Google fonts.



<a name="License"></a>
# License
[MIT](https://github.com/SqueezyDough/frontend-applications/blob/master/LICENSE) @ SqueezyDough
