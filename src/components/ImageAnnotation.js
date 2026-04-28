import { createImageAnnotator } from '@annotorious/annotorious';
import '@annotorious/annotorious/annotorious.css';

import OpenSeadragon from 'openseadragon';
import { createOSDAnnotator } from '@annotorious/openseadragon';
import '@annotorious/openseadragon/annotorious-openseadragon.css';

export default class ImageAnnotation {

  constructor(_contentRoot) {
    this.contentRoot = _contentRoot;

    this.anno = null;
    this.currentMode = 'rectangle';
    this.currentImageKey = null;
    this.pendingImageSrc = null;
    this.selectedAnnotation = null;
    this.annotatingEnabled = false;
    this.viewerMode = 'standard';
    this.osdViewer = null;

    this.init();
  }

  init() {
    this.createOffcanvas();
    this.bindFigures();
  }

  setAnnotatingEnabled(_editable) {

    this.annotatingEnabled = _editable;
  
    if (this.anno) {
      this.anno.setDrawingEnabled(_editable);
  
      if (_editable) {
        this.anno.setDrawingTool(
          this.currentMode
        );
      }
    }
  
    const rectBtn =
      document.getElementById(
        'anno-rect-btn'
      );
  
    const polyBtn =
      document.getElementById(
        'anno-poly-btn'
      );
  
    const deleteBtn =
      document.getElementById(
        'anno-delete-btn'
      );
  
    rectBtn.disabled = !_editable;
    polyBtn.disabled = !_editable;
  
    deleteBtn.disabled =
      !_editable || !this.selectedAnnotation;
  }
  bindFigures() {
    this.contentRoot.querySelectorAll('figure').forEach(figure => {

      figure.addEventListener('dblclick', () => {
        const img = figure.querySelector('img');
        if (!img) return;

        this.openImage(img, figure);
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
      <div class="offcanvas offcanvas-end border-0" 
     tabindex="-1" 
     id="imageAnnotationCanvas" 
     style="width:100vw">
     
    <div class="offcanvas-header border-bottom border-secondary">
        <h5 id="annotation-title" class="mb-0">
            Image Annotation
        </h5>

        <div class="d-flex align-items-center ms-auto me-3 gap-2">
            <select id="viewer-mode-select" class="form-select form-select-sm" style="width:auto;">
                <option value="standard">Standard</option>
                <option value="deepzoom">Deep Zoom</option>
            </select>

            <div class="btn-group btn-group-sm">
                <button id="anno-rect-btn" class="btn btn-outline-primary active">
                    <i class="bi bi-square me-1"></i> Rectangle
                </button>
                <button id="anno-poly-btn" class="btn btn-outline-primary">
                    <i class="bi bi-pentagon me-1"></i> Polygon
                </button>
                <button id="anno-delete-btn" class="btn btn-outline-danger" disabled>
                    <i class="bi bi-trash"></i>
                </button>
            </div>
        </div>

        <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
    </div>

    <div class="offcanvas-body p-0 position-relative overflow-hidden">
        
        <div class="d-flex align-items-center justify-content-center w-100 h-100">
            
            <img id="annotation-image" 
                 class="img-fluid" 
                 style="max-height: 100%; max-width: 100%; object-fit: contain; display: block;" />

            <div id="annotation-viewer" 
                 style="display:none; width:100%; height:100%; background: #000;">
            </div>
            
        </div>

    </div>
</div>
      `
    );

    this.canvasEl =
      document.getElementById('imageAnnotationCanvas');

    this.imageEl =
      document.getElementById('annotation-image');

    this.viewerEl =
      document.getElementById(
        'annotation-viewer'
      );

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

      document
      .getElementById('anno-delete-btn')
      .addEventListener(
        'click',
        () => this.deleteSelected()
      );

      document
      .getElementById('viewer-mode-select')
      .addEventListener(
        'change',
        e => this.setViewerMode(
            e.target.value
        )
      );
  }

  setViewerMode(mode) {

    if (this.viewerMode === mode) {
      return;
    }
  
    this.viewerMode = mode;
  
    this.initAnnotator();
  }

  openImage(img, figure) {

    this.currentImageKey =
    this.relativePath(img.src);
  
    this.pendingImageSrc = img.src;

    const caption =
      figure.querySelector('figcaption');

    document.getElementById(
    'annotation-title'
    ).textContent =
    caption
      ? caption.textContent.trim()
      : 'Image Annotation';

    this.bsCanvas.show();
  }

initAnnotator() {

  if (this.anno) {
    this.anno.destroy();
    this.anno = null;
  }

  if (this.osdViewer) {
    this.osdViewer.destroy();
    this.osdViewer = null;
  }

  if (this.viewerMode === 'deepzoom') {

    this.imageEl.style.display='none';
    this.viewerEl.style.display='block';

    this.osdViewer =
      OpenSeadragon({
        element: this.viewerEl,
        prefixUrl:
      'https://openseadragon.github.io/openseadragon/images/',

        tileSources:{
          type:'image',
          url:this.pendingImageSrc ||
              this.imageEl.src
        },

        showNavigator:true
      });

    this.anno =
      createOSDAnnotator(
         this.osdViewer
      );

  } else {

    this.viewerEl.style.display='none';
    this.imageEl.style.display='block';

    this.anno =
      createImageAnnotator(
        this.imageEl,
        {
          drawingEnabled:true
        }
      );
  }

  this.anno.setDrawingTool(
    this.currentMode
  );

  this.setAnnotatingEnabled(
    this.annotatingEnabled
  );

  this.loadAnnotations();

  this.anno.on(
    'createAnnotation',
    ()=>this.saveAnnotations()
  );

  this.anno.on(
    'updateAnnotation',
    ()=>this.saveAnnotations()
  );

  this.anno.on(
    'deleteAnnotation',
    ()=>this.saveAnnotations()
  );

  this.anno.on(
    'selectionChanged',
    selected => {

      if (selected?.length > 0) {

        this.selectedAnnotation =
          selected[0];

        document
          .getElementById(
            'anno-delete-btn'
          ).disabled =
            !this.annotatingEnabled;

      } else {

        this.selectedAnnotation=null;

        document
         .getElementById(
           'anno-delete-btn'
         ).disabled=true;
      }

    });
}

  deleteSelected() {



    if (!this.selectedAnnotation || !this.anno) {
      return;
    }
  
    this.anno.removeAnnotation(
      this.selectedAnnotation.id
    );
  
    this.selectedAnnotation = null;
  
    document
      .getElementById('anno-delete-btn')
      .disabled = true;
  
    this.saveAnnotations();
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