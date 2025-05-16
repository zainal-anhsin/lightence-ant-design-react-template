import React, { useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

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
    <button className="ql-clean" data-tooltip="Clear Formatting" />
    <button className="ql-blank" data-tooltip="Insert Blank">
      <svg width="18" height="18" viewBox="0 0 18 18">
        <rect x="3" y="8" width="12" height="2" rx="1" fill="#444" />
      </svg>
    </button>
  </div>
);

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

const formats = ['header', 'bold', 'italic', 'underline', 'align', 'list', 'bullet', 'image'];

const WysiwygEditor: React.FC<WysiwygEditorProps> = ({ value, onChange }) => {
  const quillRef = useRef<ReactQuill | null>(null);

  return (
    <div style={{ background: '#23243a', borderRadius: 8 }}>
      <CustomToolbar /> 
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
        modules={modules}
        formats={formats}
        style={{ background: '#23243a', color: '#f3f3f3', borderRadius: 8 }}
      />
    </div>
  );
};

export default WysiwygEditor;
