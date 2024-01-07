import React from 'react';
import { Editor } from 'draft-js';
import 'draft-js/dist/Draft.css';

/**
 * Custom styles for the editor content.
 */
const styleMap = {
    'COLOR_RED': {
        color: 'red',
    },
};

/**
 * EditorComponent is a functional component that represents a text editor.
 * @param {Object} props - The properties passed to the component.
 * @param {EditorState} props.editorState - The current state of the editor.
 * @param {Function} props.onChange - Callback function to handle editor state changes.
 * @param {Function} props.handleKeyCommand - Callback function to handle key commands.
 * @param {Function} props.handleBeforeInput - Callback function to handle input before insertion.
 * @returns {JSX.Element} React component.
 */
const EditorComponent = ({ editorState, onChange, handleKeyCommand, handleBeforeInput }) => {
    return (
        <div className='editor'>
            <Editor
                editorState={editorState}
                handleKeyCommand={handleKeyCommand}
                handleBeforeInput={handleBeforeInput}
                onChange={onChange}
                customStyleMap={styleMap}
            />
        </div>
    );
};

export default EditorComponent;
