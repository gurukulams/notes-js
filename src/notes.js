import '@recogito/text-annotator/text-annotator.css';
import { createTextAnnotator } from '@recogito/text-annotator';

import { Annotorious } from '@recogito/annotorious';



export default class NotesMaker {
    constructor(_contentRoot, _notiFyFn) {
        console.log('Taking Notes');

        const anno = createTextAnnotator(_contentRoot);

        // Load annotations from a file
        // anno.loadAnnotations('annotations.json');

        
        // Listen to user events
        anno.on('createAnnotation', annotation => {
            console.log('new annotation', annotation);
        });    
        
        const iA = new ImageAnnotation(_contentRoot)

    }

    setEditable(_editable) {
        console.log('Editing mode set to ' + _editable);
    }

    setTextNotesMode(_textNotesMode) {
        console.log('Text Notes mode set to ' + _textNotesMode);
    }

}

class ImageAnnotation {
    constructor(_contentRoot) {
        this.root = _contentRoot;
        this.offcanvas = null;
        this.anno = null;
        this.isEditable = false;

        this._initEvents();
        console.log('ImageAnnotation System Initialized');
    }

    _initEvents() {
        // Find all figures in the content root
        const figures = this.root.querySelectorAll('figure');
        figures.forEach(figure => {
            figure.style.cursor = 'zoom-in';
            figure.addEventListener('dblclick', () => {
                const img = figure.querySelector('img');
                const caption = figure.querySelector('figcaption')?.innerText || "Image Note";
                
                if (img) {
                    this._openStudio(img.src, caption);
                }
            });
        });
    }

    _openStudio(imgSrc, title) {
        const id = 'offcanvasImageStudio';
    
    // 1. Remove existing offcanvas if any
    document.getElementById(id)?.remove();

    // 2. Create the Offcanvas HTML
    // 'offcanvas-end' makes it slide from right to left
    const html = `
<div class="offcanvas offcanvas-end w-100 border-0" tabindex="-1" id="${id}">
    <div class="offcanvas-header border-bottom border-secondary">
        <h5 class="offcanvas-title">${title}</h5>
        <button type="button" class="btn-close" data-bs-dismiss="offcanvas"></button>
    </div>
    <div class="offcanvas-body p-0 position-relative"> 
        <div class="d-flex align-items-center justify-content-center w-100 h-100">
            <img id="anno-target-img" src="${imgSrc}">
        </div>
    </div>
</div>`;

    document.body.insertAdjacentHTML('beforeend', html);

        const el = document.getElementById(id);
        
        // 3. Initialize Bootstrap Offcanvas
        this.offcanvas = new bootstrap.Offcanvas(el);
        this.offcanvas.show();

        // 4. Initialize Annotorious after it's visible
        el.addEventListener('shown.bs.offcanvas', () => {
            this.anno = new Annotorious({
                image: 'anno-target-img',
                readOnly: !this.isEditable,
                allowEmpty: false
            });

            // Load from LocalStorage
            const storageKey = `img-anno-${btoa(imgSrc).substring(0, 20)}`;
            const saved = localStorage.getItem(storageKey);
            if (saved) this.anno.setAnnotations(JSON.parse(saved));

            // Auto-save logic
            const save = () => {
                localStorage.setItem(storageKey, JSON.stringify(this.anno.getAnnotations()));
            };
            this.anno.on('createAnnotation', save);
            this.anno.on('deleteAnnotation', save);
        });

        // 5. Cleanup on close
        el.addEventListener('hidden.bs.offcanvas', () => {
            if (this.anno) this.anno.destroy();
            el.remove();
        });
    }

    // Public method called by your main toggle
    setEditable(state) {
        this.isEditable = state;
        if (this.anno) {
            this.anno.readOnly = !state;
        }
    }
}