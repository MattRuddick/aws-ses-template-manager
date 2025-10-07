import CodeMirror from '@uiw/react-codemirror'
import { html } from '@codemirror/lang-html'
import { css } from '@codemirror/lang-css'
import { javascript } from '@codemirror/lang-javascript'
import { xml } from '@codemirror/lang-xml'

interface CodeEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  height?: string
}

const CodeEditor = ({ value, onChange, placeholder, height = '300px' }: CodeEditorProps) => {
  return (
    <div className="border border-gray-300 rounded-md overflow-hidden">
      <CodeMirror
        value={value}
        onChange={onChange}
        extensions={[html(), css(), javascript(), xml()]}
        placeholder={placeholder}
        height={height}
        basicSetup={{
          lineNumbers: true,
          foldGutter: true,
          dropCursor: false,
          allowMultipleSelections: false,
          indentOnInput: true,
          bracketMatching: true,
          closeBrackets: true,
          autocompletion: true,
          highlightSelectionMatches: false,
        }}
        theme="light"
      />
    </div>
  )
}

export default CodeEditor
