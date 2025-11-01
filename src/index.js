import * as core from "@actions/core";
import fsp from 'fs/promises';
import * as glob from '@actions/glob';
import puppeteer from 'puppeteer-core';



const pattern = core.getInput('pattern');
const chromePath = core.getInput('chromePath');
const exportBackground = core.getInput('exportBackground');
const exportWithDarkMode = core.getInput('exportWithDarkMode');

const browser = await puppeteer.launch({
  executablePath: chromePath,
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-web-security',
    '--user-data-dir="/var/tmp/chrome"'
  ],
});


const globber = await glob.create(pattern);
for await (const file of globber.globGenerator()) {
  let content = await fsp.readFile(file);
  let data = JSON.parse(content);

  data.appState.exportBackground = (exportBackground === "true");
  data.appState.exportWithDarkMode = (exportWithDarkMode === "true");

  const page = await browser.newPage();

  // For debug
  // page.on('console', m => core.info(m.text()))

  await page.setContent(gen_fake_html(JSON.stringify(data)))
  let loc = await page.locator("svg").waitHandle();

  let svg = await loc.evaluate(e => e.outerHTML);
  fsp.writeFile(`${file}.svg`, svg);
}

await browser.close();



function gen_fake_html(data) {
  return `\
<html>

  <script type="importmap">
    {
      "imports": {
        "react": "https://esm.sh/react@19.0.0",
        "react/jsx-runtime": "https://esm.sh/react@19.0.0/jsx-runtime",
        "react-dom": "https://esm.sh/react-dom@19.0.0"
      }
    }
  </script>


  <body>
    <div class="container">
      <h1>Excalidraw Embed Example</h1>
      <div id="app"></div>
    </div>
  </body>

  <script type="module">
    import * as ExcalidrawLib from 'https://esm.sh/@excalidraw/excalidraw@0.18.0/dist/dev/index.js?external=react,react-dom';

    ExcalidrawLib.exportToSvg(${data}).then((x) => document.body.appendChild(x));
  </script>

</html>`
}
