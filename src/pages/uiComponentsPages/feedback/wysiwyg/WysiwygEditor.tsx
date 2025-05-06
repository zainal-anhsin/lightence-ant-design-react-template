import React, { useRef } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface WysiwygEditorProps {
  value: string;
  onChange: (value: string) => void;
}

// Add a custom blank button to the toolbar
const CustomToolbar = () => (
  <div id="custom-toolbar">
    <select className="ql-header" defaultValue="" onChange={e => e.persist()}>
      <option value="1"></option>
      <option value="2"></option>
      <option value=""></option>
    </select>
    <button className="ql-bold" />
    <button className="ql-italic" />
    <button className="ql-underline" />
    <button className="ql-list" value="ordered" />
    <button className="ql-list" value="bullet" />
    <button className="ql-align" value="" />
    <button className="ql-align" value="center" />
    <button className="ql-align" value="right" />
    <button className="ql-image" />
    <button className="ql-blank" title="Insert Blank" aria-label="Insert Blank">
      <svg width="18" height="18" viewBox="0 0 18 18">
        <rect x="3" y="8" width="12" height="2" rx="1" fill="#444" />
      </svg>
    </button>
    <button className="ql-clean" />
  </div>
);

const modules = {
  toolbar: {
    container: '#custom-toolbar',
    handlers: {
      image: function (this: any) {
        const quill = this.quill;
        const url = window.prompt('Enter image URL');
        if (url) {
          const range = quill.getSelection();
          quill.insertEmbed(range ? range.index : 0, 'image', url, 'user');
        }
      },
      blank: function (this: any) {
        const quill = this.quill;
        const range = quill.getSelection();
        if (range) {
          quill.insertText(range.index, '________ ', 'user');
          quill.setSelection(range.index + 9, 0, 'user');
        }
      },
    },
  },
};

const formats = [
  'header', 'bold', 'italic', 'underline',
  'align', 'list', 'bullet', 'image'
];

const WysiwygEditor: React.FC<WysiwygEditorProps> = ({ value, onChange }) => {
  const quillRef = useRef<ReactQuill | null>(null);

  return (
    <div style={{ background: '#23243a', borderRadius: 8 }}>
      <CustomToolbar />
      <style>{`
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