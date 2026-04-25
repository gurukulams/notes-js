import { createTextAnnotator } from '@recogito/text-annotator';

import '@recogito/text-annotator/text-annotator.css';

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

    }

    setEditable(_editable) {
        console.log('Editing mode set to ' + _editable);
    }

    setTextNotesMode(_textNotesMode) {
        console.log('Text Notes mode set to ' + _textNotesMode);
    }

}