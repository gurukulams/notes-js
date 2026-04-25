export default class NotesMaker {
    constructor(_contentRoot, _notiFyFn) {
        console.log('Taking Notes');
    }

    setEditable(_editable) {
        console.log('Editing mode set to ' + _editable);
    }

    setTextNotesMode(_textNotesMode) {
        console.log('Text Notes mode set to ' + _textNotesMode);
    }

}