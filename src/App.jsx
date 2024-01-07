import React, { useState, useEffect } from 'react';
import EditorComponent from './components/EditorComponent';
import { EditorState, convertFromRaw, convertToRaw, Modifier, RichUtils } from 'draft-js';

/**
 * App is the main functional component representing the entire application.
 * @returns {JSX.Element} React component.
 */
const App = () => {
  // State to manage the editor's content
  const [editorState, setEditorState] = useState(() => {
    // Load saved content from localStorage or create an empty editor state
    const savedContent = localStorage.getItem('editorContent');
    if (savedContent) {
      const contentState = convertFromRaw(JSON.parse(savedContent));
      return EditorState.createWithContent(contentState);
    }
    return EditorState.createEmpty();
  });

  // useEffect hook to save the editor content to localStorage when it changes
  useEffect(() => {
    const contentState = editorState.getCurrentContent();
    const contentStateJson = JSON.stringify(convertToRaw(contentState));
    localStorage.setItem('editorContent', contentStateJson);
  }, [editorState]);

  /**
   * Handles input before it's inserted into the editor.
   * @param {string} input - The input to be inserted.
   * @param {EditorState} editorState - The current state of the editor.
   * @returns {string} - 'handled' or 'not-handled' based on whether the input is handled.
   */
  const handleBeforeInput = (input, editorState) => {
    const currentContent = editorState.getCurrentContent();
    const selection = editorState.getSelection();
    const block = currentContent.getBlockForKey(selection.getStartKey());
    const blockText = block.getText();

    // Check for specific patterns and apply corresponding styles or block types
    if (input === ' ' && blockText.trim() === '#') {
      const newContentState = Modifier.replaceText(
        currentContent,
        selection.merge({
          anchorOffset: 0,
          focusOffset: selection.getFocusOffset(),
        }),
        '',
      );
      const newState = EditorState.push(editorState, newContentState, 'remove-hashtag');
      setEditorState(RichUtils.toggleBlockType(newState, 'header-one'));
      return 'handled';
    } else if (input === ' ' && blockText.trim() === '*') {
      const newContentState = Modifier.replaceText(
        currentContent,
        selection.merge({
          anchorOffset: 0,
          focusOffset: selection.getFocusOffset(),
        }),
        '',
      );
      const newState = EditorState.push(editorState, newContentState, 'remove-asterisk');
      setEditorState(RichUtils.toggleInlineStyle(newState, 'BOLD'));
      return 'handled';
    } else if (input === ' ' && blockText.trim() === '**') {
      const newContentState = Modifier.replaceText(
        currentContent,
        selection.merge({
          anchorOffset: 0,
          focusOffset: selection.getFocusOffset(),
        }),
        '',
      );
      const newState = EditorState.push(editorState, newContentState, 'remove-double-asterisk');
      setEditorState(RichUtils.toggleInlineStyle(newState, 'COLOR_RED'));
      return 'handled';
    } else if (input === ' ' && blockText.trim() === '***') {
      const newContentState = Modifier.replaceText(
        currentContent,
        selection.merge({
          anchorOffset: 0,
          focusOffset: selection.getFocusOffset(),
        }),
        '',
      );
      const newState = EditorState.push(editorState, newContentState, 'remove-triple-asterisk');
      setEditorState(RichUtils.toggleInlineStyle(newState, 'UNDERLINE'));
      return 'handled';
    }

    return 'not-handled';
  };

  /**
   * Handles key commands (e.g., keyboard shortcuts).
   * @param {string} command - The key command.
   * @returns {string} - 'handled' or 'not-handled' based on whether the key command is handled.
   */
  const handleKeyCommand = (command) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);

    if (newState) {
      setEditorState(newState);
      return 'handled';
    }

    return 'not-handled';
  };

  /**
   * Handles saving the current editor state.
   */
  const handleSave = () => {
    const contentState = editorState.getCurrentContent();
    const isEmpty = contentState.getBlockMap().every(block => block.getText().trim() === '');

    if (!isEmpty) {
      const contentStateJson = JSON.stringify(convertToRaw(contentState));
      localStorage.setItem('editorContent', contentStateJson);
      alert('Content saved!');
    } else {
      alert('Editor is empty. Nothing to save.');
    }
  };

  // Render the main App component
  return (
    <div>
      <div className='heading-container'>
        <span></span>

        {/* Render the custom text editor component and pass the necessary props */}
        <h2>Demo editor by Jatin</h2>

        {/* Save button */}
        <button onClick={handleSave}>Save</button>

      </div>

      <EditorComponent
        editorState={editorState}
        onChange={setEditorState}
        handleKeyCommand={handleKeyCommand}
        handleBeforeInput={handleBeforeInput}
      />

    </div>
  );
};

export default App;
