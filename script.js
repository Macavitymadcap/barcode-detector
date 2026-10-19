const IMAGES = {
  aztec: { option: 'aztec', file: 'images/aztec.gif', alt: 'aztec barcode' },
  codabar: { option: 'codabar', file: 'images/codabar.png', alt: 'codabar barcode' },
  code_128: { option: 'code_128', file: 'images/code-128.gif', alt: 'code 128 barcode' },
  code_39: { option: 'code_39', file: 'images/code-39.png', alt: 'code 39 barcode' },
  code_93: { option: 'code_93', file: 'images/code-93.png', alt: 'code 93 barcode' },
  data_matrix: { option: 'data_matrix', file: 'images/data-matrix.png', alt: 'data matrix barcode' },
  ean_13: { option: 'ean_13', file: 'images/ean-13.png', alt: 'ean 13 barcode' },
  ean_8: { option: 'ean_8', file: 'images/ean-8.png', alt: 'ean 8 barcode' },
  itf: { option: 'itf', file: 'images/itf.png', alt: 'itf barcode' },
  pdf417: { option: 'pdf417', file: 'images/pdf417.png', alt: 'pdf 417 barcode' },
  qr_code: { option: 'qr_code', file: 'images/qr-code.png', alt: 'qr code barcode' },
  upc_a: { option: 'upc_a', file: 'images/upc-a.png', alt: 'upc a barcode' },
  upc_e: { option: 'upc_e', file: 'images/upc-e.png', alt: 'upc e barcode' },
};

const getImages = (supportedFormats) => {
  if (!supportedFormats?.length) return IMAGES;

  return Object.fromEntries(
    supportedFormats
      .filter((format) => format in IMAGES)
      .map((format) => [format, IMAGES[format]])
  );
};

const getElements = () => ({
  supportedParagraph: document.querySelector('#api-supported-paragraph'),
  imageSelect: document.querySelector('#image-select'),
  image: document.querySelector('#barcode-image'),
  readButton: document.querySelector('#read-barcode'),
  fileInput: document.querySelector('#file-input'),
  barcodeOutput: document.querySelector('#barcode-output'),
  clearOutputButton: document.querySelector('#clear-output-button')
});

const setSupportedText = (isSupported, paragraph) => {
  paragraph.textContent = isSupported
    ? '✅ Barcode Detector is supported in this browser for the selectable options below. Alternatively, try reading a barcode from a photo that can be uploaded or taken directly if on mobile.'
    : '❌ Barcode Detector is not supported in this browser. You can browse different barcodes below, but not analyse them.';
};

const getSupportedFormats = async () => {
  const formats = await BarcodeDetector.getSupportedFormats();

  return formats.filter((format) => format !== 'unknown');
};

const setImageSelectOptions = (imageSelect, images) => {
  Object.values(images).forEach((image) => {
    const option = document.createElement('option');
    option.value = image.option;
    option.textContent = image.option;
    imageSelect.appendChild(option);
  });
};

const changeImage = (event, imageElement, images) => {
  const { file, alt } = images[event.target.value];
  imageElement.src = file;
  imageElement.alt = alt;
};

const getFirstImage = (images) => {
  return Object.values(images)[0];
}

const setImage = (imageElement, imageSrc, imageAlt) => {
  imageElement.setAttribute('src', imageSrc);
  imageElement.setAttribute('alt', imageAlt);
}

const setChangeImage = (elements, images) => {
  elements.imageSelect.addEventListener('change', (event) =>
    changeImage(event, elements.image, images)
  );
};

const readBarcode = async (image, formats) => 
  new BarcodeDetector({ formats }).detect(image);


const setBarcodeOutput = (outputElement, data) => {
  const pre = document.createElement('pre');
  const formattedData = syntaxHighlight(JSON.stringify(data, null, 2));
  pre.innerHTML = formattedData;
  outputElement.replaceChildren(pre);
}

const setReadButton = (readButton, image, supportedFormats, barcodeOutput) => {
  readButton.addEventListener('click', async (event) => {
    event.preventDefault();

    const detection = await readBarcode(image, supportedFormats);
    setBarcodeOutput(barcodeOutput, detection);
  });
}

const setClearButton = (clearButton, barcodeOutput) => {
  clearButton.addEventListener('click', (event) => {
    event.preventDefault();

    while (barcodeOutput.firstChild) {
      barcodeOutput.removeChild(barcodeOutput.lastChild);
    }
  });
}

const setFileInput = (fileInput, imageElement, supportedFormats, barcodeOutput) => {
  fileInput.addEventListener('change', async () => {
    const [file] = fileInput.files;
    if (!file) return;

    imageElement.src = URL.createObjectURL(file);
    imageElement.alt = file.name;

    const bitmap = await createImageBitmap(file);
    const detection = await readBarcode(bitmap, supportedFormats);
    bitmap.close();

    setBarcodeOutput(barcodeOutput, detection);
  });
};

// Source - https://stackoverflow.com/a/7220510
// Posted by user123444555621, modified by community. See post 'Timeline' for change history
// Retrieved 2026-10-19, License - CC BY-SA 3.0
const syntaxHighlight = (json) => {
    json = json
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
    
    return json
    .replace(
      /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, 
      (match) => {
        let className = 'number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                className = 'key';
            } else {
                className = 'string';
            }
        } else if (/true|false/.test(match)) {
            className = 'boolean';
        } else if (/null/.test(match)) {
            className = 'null';
        }
        return '<span class="' + className + '">' + match + '</span>';
    });
}

document.addEventListener('DOMContentLoaded', async () => {
  const elements = getElements();
  const isSupported = 'BarcodeDetector' in globalThis;
  setSupportedText(isSupported, elements.supportedParagraph);

  if (!isSupported) {
    setImageSelectOptions(elements.imageSelect, IMAGES);
    setChangeImage(elements, IMAGES);
    const firstImage = getFirstImage(IMAGES);
    setImage(elements.image, firstImage.file, firstImage.alt);
    elements.readButton.remove();
    return;
  }

  const supportedFormats = await getSupportedFormats();
  const images = getImages(supportedFormats);
  setImageSelectOptions(elements.imageSelect, images);
  setChangeImage(elements, images);
  const firstImage = getFirstImage(images);
  setImage(elements.image, firstImage.file, firstImage.alt);
  setReadButton(
    elements.readButton, 
    elements.image, 
    supportedFormats, 
    elements.barcodeOutput
  );
  setFileInput(
    elements.fileInput, 
    elements.image, 
    supportedFormats, 
    elements.barcodeOutput
  );
  setClearButton(elements.clearOutputButton, elements.barcodeOutput)
});