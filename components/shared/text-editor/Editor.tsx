'use client';

import 'suneditor/dist/css/suneditor.min.css';
import dynamic from 'next/dynamic';
import './editor.css';
import { EditorSkeleton } from './EditorSkeleton';

const SunEditor = dynamic(() => import('suneditor-react'), {
  ssr: false,
  loading: () => <EditorSkeleton />,
});

// RTL languages list
const RTL_LANGUAGES = ['ar', 'he', 'fa', 'ur', 'ps', 'sd', 'ku', 'dv'];

const isRTLLanguage = (language: string): boolean => {
  return RTL_LANGUAGES.includes(language.toLowerCase());
};

interface EditorProps {
  value: string;
  onChange: (content: string) => void;
  readOnly?: boolean;
  placeholder?: string;
  language?: string;
}

export default function Editor({
  value,
  onChange,
  readOnly = false,
  placeholder,
  language = 'en',
}: EditorProps) {
  const handleChange = (content: string) => {
    if (!readOnly) {
      onChange(content);
    }
  };

  const isRTL = isRTLLanguage(language);

  return (
    <div className="dark:bg-input/30 w-full max-w-full" dir={isRTL ? 'rtl' : 'ltr'}>
      <SunEditor
        setContents={value}
        onChange={handleChange}
        disable={readOnly}
        placeholder={placeholder}
        setOptions={{
          rtl: isRTL,
          height: '400px',
          buttonList: readOnly
            ? []
            : [
                ['undo', 'redo'],
                ['font', 'fontSize', 'formatBlock'],
                ['bold', 'underline', 'italic', 'strike', 'subscript', 'superscript'],
                ['removeFormat'],
                ['fontColor', 'hiliteColor'],
                ['outdent', 'indent'],
                ['align', 'horizontalRule', 'list', 'table'],
                ['link', 'image'],
                ['fullScreen', 'showBlocks', 'codeView'],
              ],
          defaultTag: 'div',
          minHeight: '400px',
          showPathLabel: false,
        }}
      />
    </div>
  );
}
