import "@recogito/text-annotator/text-annotator.css";
import { createTextAnnotator } from "@recogito/text-annotator";

import ImageAnnotation from './components/ImageAnnotation'

export default class NotesMaker {

  constructor(_contentRoot, _notiFyFn) {
    console.log("Taking Notes");

    this.anno = createTextAnnotator(_contentRoot);

    // Load annotations from a file
    // anno.loadAnnotations('annotations.json');

    // Listen to user events
    this.anno.on("createAnnotation", (annotation) => {
      console.log("new annotation", annotation);
    });

    this.imageAnno = new ImageAnnotation(_contentRoot)

    this.setEditable(false);
  }

  setEditable(_editable) {
    this.anno.setAnnotatingEnabled(_editable)
  }

  setTextNotesMode(_textNotesMode) {
    console.log("Text Notes mode set to " + _textNotesMode);
  }
}


