// TextAnnotation.js

import "@recogito/text-annotator/text-annotator.css";
import { createTextAnnotator } from "@recogito/text-annotator";


export default class TextAnnotation {
  constructor(_contentRoot) {
    this.contentRoot = _contentRoot;

    this.anno = null;

    this.annotatingEnabled = true;

    this.init();
  }

  init() {
    this.initAnnotator();
  }

  initAnnotator() {
    if (this.anno) {
      this.anno.destroy();
      this.anno = null;
    }

    this.anno = createTextAnnotator(this.contentRoot);

    this.loadAnnotations();

    this.setAnnotatingEnabled(this.annotatingEnabled);

    this.anno.on("createAnnotation", () => this.saveAnnotations());

    this.anno.on("updateAnnotation", () => this.saveAnnotations());

    this.anno.on("deleteAnnotation", () => this.saveAnnotations());
  }

  storageKey() {
    return `text-annotations:${window.location.pathname}`;
  }

  saveAnnotations() {
    if (!this.anno) return;

    localStorage.setItem(
      this.storageKey(),
      JSON.stringify(this.anno.getAnnotations())
    );
  }

  loadAnnotations() {
    if (!this.anno) return;

    const saved = localStorage.getItem(this.storageKey());

    if (!saved) return;

    try {
      this.anno.setAnnotations(JSON.parse(saved));
    } catch (e) {
      console.warn("Invalid saved annotations", e);
    }
  }

  setAnnotatingEnabled(_editable) {
    this.annotatingEnabled = _editable;

    if (!this.anno) return;

    // enable/disable creating annotations
    this.anno.setAnnotatingEnabled(_editable);

    // optional hard readonly
    if (!_editable && this.anno.setUserSelectAction) {
      this.anno.setUserSelectAction("NONE");
    } else if (this.anno.setUserSelectAction) {
      this.anno.setUserSelectAction("EDIT");
    }
  }

  destroy() {
    if (this.anno) {
      this.anno.destroy();
    }
  }
}
