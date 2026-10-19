# Barcode Detection API

A small static page exploring the browser's
[Barcode Detection API](https://developer.mozilla.org/en-US/docs/Web/API/Barcode_Detection_API).
Pick a sample barcode or upload a photo of your own, and the page shows
what the browser's built-in detector finds.

## Features

- Detects whether the current browser supports `BarcodeDetector` and
  says so on the page.
- Lists only the sample barcodes whose formats the browser reports as
  supported; unsupported browsers can still browse every sample.
- Reads the selected sample, or an uploaded photo, and prints the raw
  detection result as syntax-highlighted JSON.
- Follows the system light or dark colour scheme.

## Browser support

Support is limited and depends on the platform's own barcode scanner,
so results vary between devices even in the same browser. At the time
of writing, Chromium-based browsers support the API on macOS, ChromeOS
and Android; desktop Windows and Linux, Firefox and Safari generally do
not. Check the
[MDN compatibility table](https://developer.mozilla.org/en-US/docs/Web/API/BarcodeDetector#browser_compatibility)
for current details.

The API is only available in a secure context, so the page must be
served over HTTPS or from `localhost`. Opening `index.html` directly
from the file system will not work.

## Running locally

Serve the project folder with any static file server:

```sh
bunx serve .
```

or:

```sh
python3 -m http.server 8000
```

Then open the address the server prints.

## Using your own images

Detection works on ordinary photos; the barcode does not need to fill
the frame. For the best results the barcode should be in focus, lit
evenly without glare, and large enough that individual bars are
distinct. Photos from a phone camera usually decode more reliably than
those from a laptop webcam.

An empty array in the output means the detector ran but found nothing
it could decode; it is not an error.

## Project structure

| File         | Purpose                                      |
| ------------ | -------------------------------------------- |
| `index.html` | Page markup                                  |
| `script.js`  | Feature detection, image handling, detection |
| `styles.css` | Layout, theming and JSON highlighting        |
| `images/`    | Sample barcodes, one per supported format    |

## Deployment

The site is plain HTML, CSS and JavaScript with no build step. To host
it on GitHub Pages, go to the repository's Settings, open Pages, and
set the source to deploy from the `main` branch root.

## Credits

- Sample barcode images are taken from the MDN
  [Barcode Detection API](https://developer.mozilla.org/en-US/docs/Web/API/Barcode_Detection_API)
  documentation.
- The JSON syntax highlighter is adapted from a
  [Stack Overflow answer](https://stackoverflow.com/a/7220510) by
  user123444555621, licensed under CC BY-SA 3.0.

Written by Dan Kiernan.
