import { createImageAnnotator } from '@annotorious/annotorious';
import '@annotorious/annotorious/annotorious.css';

export default class ImageAnnotation {

  constructor(_contentRoot) {
    this.contentRoot = _contentRoot;

    this.anno = null;
    this.currentMode = 'rectangle';
    this.currentImageKey = null;
    this.pendingImageSrc = null;

    this.init();
  }

  init() {
    this.createOffcanvas();
    this.bindFigures();
  }

  bindFigures() {
    this.contentRoot.querySelectorAll('figure').forEach(figure => {

      figure.addEventListener('dblclick', () => {
        const img = figure.querySelector('img');
        if (!img) return;

        this.openImage(img);
      });

    });
  }

  createOffcanvas() {

    if (document.getElementById('imageAnnotationCanvas')) {
      return;
    }

    document.body.insertAdjacentHTML(
      'beforeend',
      `
      <div class="offcanvas offcanvas-start"
           tabindex="-1"
           id="imageAnnotationCanvas"
           style="width:90vw">

        <div class="offcanvas-header border-bottom">
          <h5 class="mb-0">
             Image Annotation
          </h5>

          <div class="btn-group ms-auto me-3">
            <button id="anno-rect-btn"
                    class="btn btn-outline-primary active">
               Rectangle
            </button>

            <button id="anno-poly-btn"
                    class="btn btn-outline-primary">
               Polygon
            </button>
          </div>

          <button class="btn-close"
                  data-bs-dismiss="offcanvas">
          </button>
        </div>

        <div class="offcanvas-body text-center">
          <img id="annotation-image"
               class="img-fluid"
               style="max-height:85vh;" />
        </div>

      </div>
      `
    );

    this.canvasEl =
      document.getElementById('imageAnnotationCanvas');

    this.imageEl =
      document.getElementById('annotation-image');

    this.bsCanvas =
      new bootstrap.Offcanvas(this.canvasEl);

    // initialize only after offcanvas is visible
    this.canvasEl.addEventListener(
      'shown.bs.offcanvas',
      () => {
        if (this.pendingImageSrc) {
          this.imageEl.src = this.pendingImageSrc;
          this.initAnnotator();
          this.pendingImageSrc = null;
        }
      }
    );

    document
      .getElementById('anno-rect-btn')
      .addEventListener(
        'click',
        () => this.setMode('rectangle')
      );

    document
      .getElementById('anno-poly-btn')
      .addEventListener(
        'click',
        () => this.setMode('polygon')
      );
  }

  openImage(img) {

    this.currentImageKey =
      this.relativePath(img.src);

    this.pendingImageSrc =
      img.src;

    this.bsCanvas.show();
  }

  initAnnotator() {

    if (this.anno) {
      this.anno.destroy();
      this.anno = null;
    }
  
    console.log(createImageAnnotator); // should log a function
  
    this.anno = createImageAnnotator(
      this.imageEl,
      {
        drawingEnabled: true
      }
    );
  
    this.anno.setDrawingTool(this.currentMode);
  
    this.loadAnnotations();
  
    this.anno.on(
      'createAnnotation',
      () => this.saveAnnotations()
    );
  
    this.anno.on(
      'updateAnnotation',
      () => this.saveAnnotations()
    );
  
    this.anno.on(
      'deleteAnnotation',
      () => this.saveAnnotations()
    );
  }
  setMode(mode) {

    this.currentMode = mode;

    if (this.anno) {
      this.anno.setDrawingTool(mode);
    }

    document
      .getElementById('anno-rect-btn')
      .classList.toggle(
        'active',
        mode === 'rectangle'
      );

    document
      .getElementById('anno-poly-btn')
      .classList.toggle(
        'active',
        mode === 'polygon'
      );
  }

  storageKey() {
    return `image-annotations:${this.currentImageKey}`;
  }

  saveAnnotations() {

    if (!this.anno) return;

    localStorage.setItem(
      this.storageKey(),
      JSON.stringify(
        this.anno.getAnnotations()
      )
    );
  }

  loadAnnotations() {

    const saved =
      localStorage.getItem(
        this.storageKey()
      );

    if (!saved || !this.anno) return;

    try {
      this.anno.setAnnotations(
        JSON.parse(saved)
      );
    } catch(e) {
      console.warn(
        'Invalid saved annotations',
        e
      );
    }
  }

  // Ignore host, use only relative path
  relativePath(url) {
    return new URL(
      url,
      window.location.origin
    ).pathname;
  }

  destroy() {
    if (this.anno) {
      this.anno.destroy();
    }
  }
}