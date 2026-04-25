(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.NotesMaker = factory());
})(this, (function () { 'use strict';

    class NotesMaker {
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

    return NotesMaker;

}));
//# sourceMappingURL=notes.bundle.js.map
