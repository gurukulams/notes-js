import "@recogito/text-annotator/text-annotator.css";
import { createTextAnnotator } from "@recogito/text-annotator";

import TextAnnotation from './components/TextAnnotation'
import ImageAnnotation from './components/ImageAnnotation'

export default class NotesMaker {

  constructor(_contentRoot, _notiFyFn) {
    console.log("Taking Notes");

    this.textanno = new TextAnnotation(_contentRoot)
    this.imageAnno = new ImageAnnotation(_contentRoot)

    this.setEditable(false);
  }

  setEditable(_editable) {
    this.textanno.setAnnotatingEnabled(_editable)
    this.imageAnno.setAnnotatingEnabled(_editable)
  }

}


