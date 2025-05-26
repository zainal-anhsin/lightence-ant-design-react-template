import React, { useRef, useCallback, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Quill from 'quill';

interface WysiwygEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const CustomToolbar = () => (
  <div id="custom-toolbar" style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
    <div data-tooltip="Heading">
      <select className="ql-header" defaultValue="">
        <option value="1">Heading 1</option>
        <option value="2">Heading 2</option>
        <option value="">Normal</option>
      </select>
    </div>

    <button className="ql-bold" data-tooltip="Bold" />
    <button className="ql-italic" data-tooltip="Italic" />
    <button className="ql-underline" data-tooltip="Underline" />
    <button className="ql-list" value="ordered" data-tooltip="Ordered List" />
    <button className="ql-list" value="bullet" data-tooltip="Bullet List" />
    <select className="ql-align" defaultValue="" data-tooltip="Align">
      <option value="" />
      <option value="center" />
      <option value="right" />
      <option value="justify" />
    </select>
    <button className="ql-image" data-tooltip="Insert Image" />
    <button className="ql-audio" data-tooltip="Insert Audio">
      <svg width="18" height="18" viewBox="0 0 18 18">
        <path d="M6 14V4l7-2v16l-7-2z" fill="#444" />
      </svg>
    </button>
    <button className="ql-clean" data-tooltip="Clear Formatting" />
    <button className="ql-blank" data-tooltip="Insert Blank">
      <svg width="18" height="18" viewBox="0 0 18 18">
        <rect x="3" y="8" width="12" height="2" rx="1" fill="#444" />
      </svg>
    </button>
  </div>
);

// 1. Define and register a custom AudioBlot
const BlockEmbed = Quill.import('blots/block/embed');
class AudioBlot extends BlockEmbed {
  static blotName = 'audio';
  static tagName = 'div';
  static className = 'ql-audio-custom';

  static create(value: string) {
    const node = super.create();
    node.setAttribute('class', AudioBlot.className);
    node.setAttribute('style', 'display:block;margin:16px auto;max-width:380px;');
    const audio = document.createElement('audio');
    audio.setAttribute('controls', '');
    audio.setAttribute('src', value);
    audio.setAttribute('style', 'width:100%;');
    node.appendChild(audio);
    return node;
  }

  static value(node: HTMLElement) {
    const audio = node.querySelector('audio');
    return audio ? audio.getAttribute('src') : '';
  }
}
Quill.register(AudioBlot);

const modules = {
  toolbar: {
    container: '#custom-toolbar',
    handlers: {
      // Using any here because Quill's type definitions don't properly expose the toolbar handler context
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      image: function (this: any) {
        const quill = this.quill;
        const url = window.prompt('Enter image URL');
        if (url) {
          const range = quill.getSelection();
          quill.insertEmbed(range ? range.index : 0, 'image', url, 'user');
        }
      },
      // Using any here because Quill's type definitions don't properly expose the toolbar handler context
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      blank: function (this: any) {
        const quill = this.quill;
        const range = quill.getSelection();
        if (range) {
          quill.insertText(range.index, ' ________ ', 'user');
          quill.setSelection(range.index + 10, 0, 'user');
        }
      },
    },
  },
};

const formats = ['header', 'bold', 'italic', 'underline', 'align', 'list', 'bullet', 'image', 'audio'];

const WysiwygEditor: React.FC<WysiwygEditorProps> = ({ value, onChange }) => {
  const quillRef = useRef<ReactQuill | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const audioInputRef = useRef<HTMLInputElement | null>(null);

  // Handler to trigger file input when image button is clicked
  const handleImageUpload = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  }, []);

  // Handler to trigger audio input when audio button is clicked
  const handleAudioUpload = useCallback(() => {
    if (audioInputRef.current) {
      audioInputRef.current.value = '';
      audioInputRef.current.click();
    }
  }, []);

  // Handler to read file as base64 and insert into editor
  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const quill = quillRef.current?.getEditor();
        const range = quill?.getSelection();
        if (quill && reader.result) {
          quill.insertEmbed(range ? range.index : 0, 'image', reader.result, 'user');
        }
      };
      reader.readAsDataURL(file);
    }
  }, []);

  // Handler to read audio as base64 and insert audio player using custom blot
  const handleAudioChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const quill = quillRef.current?.getEditor();
        const range = quill?.getSelection();
        if (quill && reader.result) {
          quill.insertEmbed(range ? range.index : 0, 'audio', reader.result, 'user');
        }
      };
      reader.readAsDataURL(file);
    }
  }, []);

  // Custom modules with image and audio handler override
  const customModules = {
    ...modules,
    toolbar: {
      ...modules.toolbar,
      handlers: {
        ...modules.toolbar.handlers,
        image: handleImageUpload,
        audio: handleAudioUpload,
      },
    },
  };

  return (
    <div style={{ background: '#23243a', borderRadius: 8 }}>
      <CustomToolbar />
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      <input
        type="file"
        accept="audio/*"
        ref={audioInputRef}
        style={{ display: 'none' }}
        onChange={handleAudioChange}
      />
      <style>{`
        .ql-editor {
          font-family: 'Montserrat', 'Segoe UI', 'Arial', sans-serif;
          color: #f3f3f3;
          min-height: 100px;
        }
        .ql-editor img {
          display: block;
          margin: 16px auto;
          max-width: 380px;
          max-height: 320px;
          width: auto;
          height: auto;
          border-radius: 10px;
          object-fit: contain;
          box-shadow: 0 2px 12px rgba(0,0,0,0.10);
        }
        .ql-editor audio, .ql-audio-custom {
          display: block;
          margin: 16px auto;
          max-width: 380px;
        }
        [data-tooltip] {
          position: relative;
        }
        [data-tooltip]:hover::after {
          content: attr(data-tooltip);
          position: absolute;
          top: -30px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(0, 0, 0, 0.75);
          color: white;
          padding: 4px 8px;
          font-size: 12px;
          border-radius: 4px;
          white-space: nowrap;
          z-index: 100;
        }
        .ql-toolbar button, .ql-toolbar select {
          margin-right: 4px;
        }
      `}</style>
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={onChange}
        modules={customModules}
        formats={formats}
        style={{ background: '#23243a', color: '#f3f3f3', borderRadius: 8 }}
      />
    </div>
  );
};

export default WysiwygEditor;
