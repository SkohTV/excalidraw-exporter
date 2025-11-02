# excalidraw-exporter

[![Release](https://img.shields.io/github/v/release/skohtv/excalidraw-exporter?label=Release&logo=github)](https://github.com/skohtv/excalidraw-exporter/releases/latest)
[![Tests](https://img.shields.io/github/actions/workflow/status/skohtv/excalidraw-exporter/test.yml?label=Tests&logo=github)](https://github.com/skohtv/excalidraw-exporter/actions/workflows/test.yml)

This action convert [`.excalidraw`](https://github.com/excalidraw/excalidraw) files into a SVGs, for easy embedding on your website/documentation !   
You can see it in working at https://skohtv.github.io/excalidraw-exporter/

## Usage

```yml
name: ci

on:
  push:
    branches: main

jobs:
  login:
    runs-on: ubuntu-latest
    steps:

      - name: Checkout
        uses: actions/checkout@v5

      - name: Install chrome
        uses: browser-actions/setup-chrome@v2
        id: setup-chrome

      - name: Run excalidraw-exporter 
        uses: ./
        with:
          pattern: path/to/**/*.excalidraw 
          chromePath: ${{ steps.setup-chrome.outputs.chrome-path }}
```

### Inputs

| **Inputs**           | **Required?** | **Default** | **Description**                            |
| -------------------- | ------------- | ----------- | ------------------------------------------ |
| `pattern`            | `true`        |             | Pattern containing excalidraw files        |
| `chromePath`         | `true`        |             | Chrome executable path                     |
| `exportBackground`   | `false`       | `true`      | The exported SVGs will have a background   |
| `exportWithDarkMode` | `false`       | `false`     | The exported SVGs will use dark mode theme |


### Outputs
Your SVGs will be available using this path:  
`path/to/myfile.excalidraw` -> `path/to/myfile.excalidraw.svg`

Exemple :
```html
<!-- Source excalidraw file -->
<a href="./path/to/myfile.excalidraw">source</a>

<!-- Rendered SVG -->
<img src="./path/to/myfile.excalidraw.svg">
```



## Licence
The scripts and documentation in this project are released under the [MIT License](./LICENSE).
