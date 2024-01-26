import React, { useState, useEffect } from 'react';
import { Editor, EditorState, convertToRaw, convertFromRaw, RichUtils, Modifier } from 'draft-js';
import 'draft-js/dist/Draft.css';

function MyEditor() {
    const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
	
	useEffect(() => {
		const savedData = localStorage.getItem('editorContent');
		if (savedData) {
			setEditorState(EditorState.createWithContent(convertFromRaw(JSON.parse(savedData))));
		}
	}, []);
	
	const saveContent = () => {
		const content = editorState.getCurrentContent();
		localStorage.setItem('editorContent', JSON.stringify(convertToRaw(content)));
		alert('Content saved successfully!');
	};
	
	const handleBeforeInput = (char, editorState) => {
		const selection = editorState.getSelection();
		const currentContent = editorState.getCurrentContent();
		const currentBlock = currentContent.getBlockForKey(selection.getStartKey());
		const start = selection.getStartOffset();
		const blockText = currentBlock.getText();
		
		const applyStyle = (symbolLength) => {
			const newContentState = Modifier.replaceText(
				currentContent,
				selection.merge({
					anchorOffset: start - symbolLength,
					focusOffset: start,
				}),
				""
			);
			
			const newState = EditorState.push(
				editorState,
				newContentState,
				"change-inline-style"
			);
			
			const newSelection = newState.getSelection().merge({
				anchorOffset: start - symbolLength,
				focusOffset: start - symbolLength,
			});
			
			return EditorState.acceptSelection(newState, newSelection);
		};
		
		if (char === " ") {
			if (blockText.endsWith("#")) {
				setEditorState(RichUtils.toggleBlockType(applyStyle(1), "header-one"));
				return "handled";
			} else if (blockText.endsWith("***")) {
				setEditorState(RichUtils.toggleInlineStyle(applyStyle(3), "UNDERLINE"));
				return "handled";
			} else if (blockText.endsWith("**")) {
				setEditorState(RichUtils.toggleInlineStyle(applyStyle(2), "REDCOLOR"));
				return "handled";
			} else if (blockText.endsWith("*")) {
				setEditorState(RichUtils.toggleInlineStyle(applyStyle(1), "BOLD"));
				return "handled";
			}
		}
		
		return 'not-handled';
	};
	
	const styleMap = {
		'REDCOLOR': {
			color: 'red',
		},
	};
	
	return (
		<div className="container">
			<button onClick={saveContent}>Save</button>
			<Editor
				editorState={editorState}
				onChange={setEditorState}
				handleBeforeInput={handleBeforeInput}
				customStyleMap={styleMap}
			/>
		</div>
	);
}

export default MyEditor;
