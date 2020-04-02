# OBA Boekhappen (OBA Book Bites)

# Table of contents
* [Assignment](#Assignment)
* [Description](#Description)
* [Prototype](#Prototype)
* [API](#API)
* [Progressive web apps](#pwa)
* [Percieved performance](#perc-optim)
* [Optimisation results](#optim-res)
* [conclusion](#conclusion)
* [Install](#Install)
* [License](#License)

<a name="Assignment"></a>
# Assignment
In this course I will rework my client-side 'Book Bites' web app to a progressive web app. In this web app I will implement a service-worker and manifest file to give it an 'appy' feel. I also will improve this app's performance by analysing the CRP.

------

<a name="Description"></a>
# Description
This web app focusses on the ideation phase for creating a paper. Based on a old dutch tradition known as koekhappen (cake bites), children can eat books of their liking. When they're done, they can go to a results page and see the book details.

------

<a name="Prototype"></a>
# Prototype

## Carousel
User click (eat) books via a carousel-like interface.

![](https://github.com/SqueezyDough/project-1-1920/blob/master/github/carousel.png)

## Overview
All eaten books are displayed on an overview page.
<details>
  <summary>Image - Overview</summary>
    
  ![](https://user-images.githubusercontent.com/33430653/78300368-aaf42700-7537-11ea-9b3d-af457febe667.png)
</details>

## Details
The details page has basic book details. More book details can be viewed on the more info link.
<details>
  <summary>Image - Details</summary>
    
  ![](https://user-images.githubusercontent.com/33430653/78300138-4fc23480-7537-11ea-8484-9028599a0db8.png)
</details>

------

<a name="API"></a>

# API
I use the OBA API to load books from a specific category.

------

<a name="Install"></a>
# Install Notes
## Clone repository
`git clone https://github.com/SqueezyDough/progressive-web-apps-1920.git`

## Install packages
`npm run install`

## Usage
`npm run start`

------

<a name="pwa"></a>

# Progressive Web App
Progressive web apps brings functionality from native apps to the web. This allows user to have an offline experience, get push notifications, and information can be sychronised in the background. Achieving this would require a service worker to be implemented in your web app. You can also install the app on your dashboard or homescreen with a manifest file, but this is optional.

## Service worker
Service workers function as a proxy that controls how the requests in your web app are handled. My service worker dynamically caches files and precaches CORE files.

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

### Install app 
The manifest file and the service worker can work together, so you can install the app from thhe browser URL.
<details>
<summary>Image - install app</summary>
    
![](https://user-images.githubusercontent.com/33430653/78299882-e0e4db80-7536-11ea-88bd-1a2f8e849c13.png)
</details>

______

<a name="optim"></a>

# Performance optimisation
Web apps can be optimised by compressing and minimise critical files and prioritising some files over others so they won't be blocking.

## Loading JS Files
I load all javascript files on the bottom on the page to make them `non-blocking`. Additionally, javascript that only affects one specific page is only included in that page. This decreases the page load for other pages.

## Minifying CSS
CSS files are minified before being served to decrease overall file size using gulp. SCSS files are stored in a separate dev folder so the browser does not have to fetch them while they are practically useless for the browser.

## Minifying HTML
HTML files are minified before being served to decrease overall using `express-minify-html` package.

## GZIP Compressing
I use GZIP to decrease the size of the JSON response body.

## Disabling ETAG
I disable ETAG from my headers so the server doesn't compare each tag which would lead to excecuting more requests.

```
 app.set('etag', false)
```

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
<summary>Image - Cached files</summary>
    
![](https://user-images.githubusercontent.com/33430653/78299382-10dfaf00-7536-11ea-978c-f60d8067e3f8.png)
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

I've cached fonts the same way I do with other file types. As you could've seen above, I look for different file types, including fonts

```
function isCachedFileType(fileType) {
    return ['image', 'font', 'script', 'manifest'].includes(fileType)
}
```

------

#### What others are saying about caching fonts
Other sources confirm the importance of storing webfonts as well.

<details>
<summary>Sources about the importance of caching webfonts</summary>

> Proper caching is a must
If your web application uses a service worker, serving font resources with  a cache-first strategy is appropriate for most use cases. You should not | store fonts using localStorage or IndexedDB; each of those has its own set of performance issues. - Source: [developers.google.com](https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/webfont-optimization)

> Since fonts are static resources that aren’t frequently updated, they can be cached locally in the browser, saving users having to download your fonts again the next time they access your site. This way, the amount of data the user’s browser has to download, as well as the number of HTTP requests, are reduced.

> Google’s Web Fundamentals guide recommends making sure your servers provide a long-lived max-age timestamp and a revalidation token to allow for efficient font reuse between different pages on your site. - Source: [WP Rocket](https://wp-rocket.me/blog/guide-web-font-optimization/)

> Each font carries a weight that the web browser needs to download before they can be displayed. With the correct setup, the additional load time isn’t noticeable. However, get it wrong and your users could be waiting up to a few seconds before any text is displayed. - Source: [Smashing Magazine](https://www.smashingmagazine.com/2019/06/optimizing-google-fonts-performance/)

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

------

<a name="perc-optim"></a>

# Percieved performance optimisation
## Image reflow
All images have a fixed height and width, so images which are not yet fully loaded do show a visible container and the structure of the page remains intact.

<details>
<summary> Image - Image reflow </summary>
    
![](https://user-images.githubusercontent.com/33430653/78300015-18538800-7537-11ea-9e54-4e56e2dcb855.png)
</details>

------

<a name="optim-res"></a>

# Optimisation results
My website has very few items on the screen. Only 5 images are loaded each time. Real websites have far more items. I decided to increase the amount of items 5 times (25 images in total) to get a more realistic picture.

## Server side rendering
I started out without any optimisations. From here I enable each optimisation improvement to see its effect. The website scored a performance score of below 90's (sometimes 85-90) and the load time was just above `800ms`.

<details>
<summary>Initial critical rendering path</summary>
    
![](https://user-images.githubusercontent.com/33430653/78299395-13420900-7536-11ea-8d62-7f6c1191102c.png)
![](https://user-images.githubusercontent.com/33430653/78300314-9021b280-7537-11ea-9fbe-90dfc0d53548.png)
</details>

------

## Minify HTML
 Minifying HTML bumped up the score a bit and reduced the file size by about 8KB. I saw a decrease in load time of about 150ms, bringing it form 800ms+ to 650ms+.

I've used the `express-minify-html-2` npm package with these settings:

```
    removeComments: true,
    collapseWhitespace: true,
    collapseBooleanAttributes: true,
    removeAttributeQuotes: true,
    removeEmptyAttributes: true,
    minifyJS: true
```

<details>
<summary>Image - HTML load time</summary>
    
![](https://user-images.githubusercontent.com/33430653/78299391-13420900-7536-11ea-96a8-95e748dcf992.png)  
![](https://user-images.githubusercontent.com/33430653/78299393-13420900-7536-11ea-880e-d75934a22a0c.png)
</details>

------

## MinifyCSS
Minifying CSS was a very minor optimisation. It will only remove comments and spaces. It merely decreased its package size by 1KB. Although it's certainnly important for large websites, a website like this won't get any noticable benefit form it. Notheless I did notice another 100ms decrease in load time, but I assume this is a variable not an improvement.

<details>
<summary>Image - CSS load time</summary>
    
![](https://user-images.githubusercontent.com/33430653/78299388-12a97280-7536-11ea-82d1-3d0725f95194.png)
![](https://user-images.githubusercontent.com/33430653/78299389-12a97280-7536-11ea-8656-c86c0ec670f7.png) 
</details>

## Remove ETAG from headers
Removing ETAG gave me no noticable benefit.

------

## Add GZIP compression
Adding compression did al lot to bring the load time down. Most files are loaded in 450ms, which is half the time then when no optimasation was applied.
It also decreased the localhost response size significantly from 15.5KB to 1.5KB.

<details>
<summary>Image - Compression load time</summary>
    
![](https://user-images.githubusercontent.com/33430653/78299387-1210dc00-7536-11ea-839b-4d2b351a294b.png) 
![](https://user-images.githubusercontent.com/33430653/78299386-11784580-7536-11ea-8c26-021276ddd4d6.png)

</details>

------

## Caching files
It is expected thhat caching files will do the most to your load time. When critical files are cached the page loads within 40ms.

<details>
<summary>Image - caching load time</summary>

![](https://user-images.githubusercontent.com/33430653/78299384-10dfaf00-7536-11ea-9276-85bcb555add8.png)
</details>

------

## End results       
![](https://user-images.githubusercontent.com/33430653/78299379-0f15eb80-7536-11ea-89d0-671c65ae1f8a.png)

All improvements improved the websites load time by `178%`, excluding caching files. With file caching enabled the website is over `2000%` faster then without any applied optimisation.

The time to interact with the page has increased from 2.9s to 2.0s.

------

<a name="conclusion"></a>

# Conclusion
> Je snapt het verschil tussen client side en server side renderen en kan server side rendering toepassen voor het tonen van data uit een API

The server handles the data from the OBA API and requests from the client. My client-side JS handles user interaction and storing data in local storage. 

------

> Je begrijpt hoe een Service Worker werkt en kan deze in jouw applicatie op een nuttige wijze implementeren.

The service worker functions as a proxy between the server and the client, but `lives` on the client. A service worker can handle requests on its own before it gets the chance to reach the server and serve its very own content such as HTML, CSS, images and fonts from the cache based on the request object. This significantly speeds up the web app since it doesn't need to request it from the server anymore, it is already stored in the cache.

------

> Je begrijpt hoe de critical rendering path werkt, en hoe je deze kan optimaliseren.

A short description from our friends at MDN.
> The Critical Rendering Path is the sequence of steps the browser goes through to convert the HTML, CSS, and JavaScript into pixels on the screen. Optimizing the critical render path improves render performance. - [MDN](https://developer.mozilla.org/en-US/docs/Web/Performance/Critical_rendering_path)

------

Most ideally, the browser handles the most critical files first, so unnecessary files won't block the rendering path and meaningful content is loaded first.
The critical rendering path contains a few stages:

#### Time to first byte
First byte that the browser recieves when it makes an HTTP request --> I've improved this by `compressing response objects and minifying HTML and CSS`.

#### Time to first meaningful paint
First meaningful content that appears on the page --> I've improved this by making sure no secondary files are loaded first and block the primary content. I've done this by makeinng sure `JS is ecxecutes after the rest of the page is loaded`. This can be done by using `defer` or putting it on the bottom of the body element. Only necessary JS in being requested. For example: I have a carousel.js file that only loads on the homepage.

#### Time to interact
First moment the user can interact with the page --> `All above improvements have an effect on this stage` since they either affect the amount of data that needs to be downloaded or prevents JS to be blocking primary content such as HTML and CSS.

#### Page load time
Time it takes to load and stabilise the content  --> `All above improvements have an effect on this stage` for the same reason. Additionally I've made sure `images have a fixed container` so the content doesn't reflow when the images are fully loaded in this stage.


<a name="License"></a>
# License
[MIT](https://github.com/SqueezyDough/frontend-applications/blob/master/LICENSE) @ SqueezyDough
