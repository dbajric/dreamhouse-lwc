function findLinkByUrl(doc, url) {
  return doc.querySelector(`link[href='${url}']`);
}

function findScriptByUrl(doc, url) {
  return doc.querySelector(`script[src='${url}']`);
}

function createStyle(doc, url) {
  const link = doc.createElement('link');
  link.href = url;
  link.charset = 'utf-8';
  link.type = 'text/css';
  link.rel = 'stylesheet';
  return link;
}

function createScript(doc, url) {
  const script = doc.createElement('script');
  script.src = url;
  script.charset = 'utf-8';
  script.type = 'text/javascript';
  return script;
}

function promiseStyle(doc, link, skipload) {
  return new Promise(function(resolve, reject) {
    link.addEventListener('load', resolve);
    link.addEventListener('onerror', err => {
      err.stopPropagation();
      reject(link.href, err.message);
    });
    if (!skipload) {
      doc.head.appendChild(link);
    }
  });
}

function promiseScript(doc, script, skipload) {
  return new Promise(function(resolve, reject) {
    script.addEventListener('load', resolve);
    script.addEventListener('onerror', err => {
      err.stopPropagation();
      reject(script.src, err.message)
    });
    if (!skipload) {
      doc.head.appendChild(script);
    }
  });
}

export function loadStyle(doc, url) {
  const link = createStyle(doc, url);
  // Let the element handle relative to absolute mapping (link.url).
  const existingLink = findLinkByUrl(doc, link.url);
  return promiseStyle(doc, existingLink || link, !!existingLink);
}

export function loadScript(doc, url) {
  const script = createScript(doc, url);
  // Let the element handle relative to absolute mapping (script.src).
  const existingScript = findScriptByUrl(doc, script.src);
  return promiseScript(doc, existingScript || script, !!existingScript);
}

