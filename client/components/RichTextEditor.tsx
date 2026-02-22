import { useEditor, EditorContent } from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';
import { TextAlign } from '@tiptap/extension-text-align';
import { Color } from '@tiptap/extension-color';
import { Highlight } from '@tiptap/extension-highlight';
import { Bold, Italic, List, ListOrdered, Heading1, Heading2, Type } from 'lucide-react';
import { useEffect } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function RichTextEditor({ value, onChange, placeholder = "내용을 입력하세요...", className = "" }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
        codeBlock: false,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Color,
      Highlight.configure({
        multicolor: true,
      }),
    ],
    content: value || '<p></p>',
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || '<p></p>');
    }
  }, [value, editor]);

  if (!editor) {
    return (
      <div className={`flex flex-col dark:bg-purple-500/10 light:bg-white/50 dark:border dark:border-purple-500/30 light:border-2 light:border-purple-300 rounded-xl overflow-hidden min-h-96 ${className}`}>
        <div className="p-4 flex items-center justify-center h-96 dark:text-white/50 light:text-purple-600">
          로딩 중...
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col dark:bg-purple-500/10 light:bg-white/50 dark:border dark:border-purple-500/30 light:border-2 light:border-purple-300 rounded-xl overflow-hidden ${className}`}>
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 p-3 border-b dark:border-purple-500/20 light:border-purple-300 dark:bg-purple-500/5 light:bg-purple-100/30">
        {/* Heading 1 */}
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`p-2 rounded-lg transition-all ${
            editor.isActive('heading', { level: 1 })
              ? 'dark:bg-purple-500/30 light:bg-purple-300/50'
              : 'dark:hover:bg-purple-500/10 light:hover:bg-purple-200/30'
          }`}
          title="제목 1"
        >
          <Heading1 className="w-4 h-4 dark:text-purple-300 light:text-purple-700" />
        </button>

        {/* Heading 2 */}
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-2 rounded-lg transition-all ${
            editor.isActive('heading', { level: 2 })
              ? 'dark:bg-purple-500/30 light:bg-purple-300/50'
              : 'dark:hover:bg-purple-500/10 light:hover:bg-purple-200/30'
          }`}
          title="제목 2"
        >
          <Heading2 className="w-4 h-4 dark:text-purple-300 light:text-purple-700" />
        </button>

        {/* Divider */}
        <div className="w-px dark:bg-purple-500/20 light:bg-purple-300/30"></div>

        {/* Bold */}
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded-lg transition-all ${
            editor.isActive('bold')
              ? 'dark:bg-purple-500/30 light:bg-purple-300/50'
              : 'dark:hover:bg-purple-500/10 light:hover:bg-purple-200/30'
          }`}
          title="굵게"
        >
          <Bold className="w-4 h-4 dark:text-purple-300 light:text-purple-700" />
        </button>

        {/* Italic */}
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded-lg transition-all ${
            editor.isActive('italic')
              ? 'dark:bg-purple-500/30 light:bg-purple-300/50'
              : 'dark:hover:bg-purple-500/10 light:hover:bg-purple-200/30'
          }`}
          title="기울임"
        >
          <Italic className="w-4 h-4 dark:text-purple-300 light:text-purple-700" />
        </button>

        {/* Divider */}
        <div className="w-px dark:bg-purple-500/20 light:bg-purple-300/30"></div>

        {/* Bullet List */}
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded-lg transition-all ${
            editor.isActive('bulletList')
              ? 'dark:bg-purple-500/30 light:bg-purple-300/50'
              : 'dark:hover:bg-purple-500/10 light:hover:bg-purple-200/30'
          }`}
          title="목록"
        >
          <List className="w-4 h-4 dark:text-purple-300 light:text-purple-700" />
        </button>

        {/* Ordered List */}
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded-lg transition-all ${
            editor.isActive('orderedList')
              ? 'dark:bg-purple-500/30 light:bg-purple-300/50'
              : 'dark:hover:bg-purple-500/10 light:hover:bg-purple-200/30'
          }`}
          title="번호 목록"
        >
          <ListOrdered className="w-4 h-4 dark:text-purple-300 light:text-purple-700" />
        </button>

        {/* Divider */}
        <div className="w-px dark:bg-purple-500/20 light:bg-purple-300/30"></div>

        {/* Code Block */}
        <button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`p-2 rounded-lg transition-all ${
            editor.isActive('codeBlock')
              ? 'dark:bg-purple-500/30 light:bg-purple-300/50'
              : 'dark:hover:bg-purple-500/10 light:hover:bg-purple-200/30'
          }`}
          title="코드"
        >
          <Type className="w-4 h-4 dark:text-purple-300 light:text-purple-700" />
        </button>
      </div>

      {/* Editor Content */}
      <EditorContent
        editor={editor}
        className="flex-1 overflow-auto"
      />

      {/* CSS for editor styling */}
      <style>{`
        .ProseMirror {
          padding: 1rem;
          outline: none;
          color: inherit;
        }
        .dark .ProseMirror {
          color: rgba(255, 255, 255, 0.8);
        }
        .light .ProseMirror {
          color: rgb(63, 28, 99);
        }
        .ProseMirror p {
          margin: 0.5rem 0;
        }
        .ProseMirror h1 {
          font-size: 1.875rem;
          font-weight: bold;
          margin: 0.75rem 0;
        }
        .ProseMirror h2 {
          font-size: 1.5rem;
          font-weight: bold;
          margin: 0.5rem 0;
        }
        .ProseMirror h3 {
          font-size: 1.25rem;
          font-weight: bold;
          margin: 0.5rem 0;
        }
        .ProseMirror ul {
          margin: 0.5rem 0;
          padding-left: 1.5rem;
          list-style-type: disc;
        }
        .ProseMirror ol {
          margin: 0.5rem 0;
          padding-left: 1.5rem;
          list-style-type: decimal;
        }
        .ProseMirror li {
          margin: 0.25rem 0;
        }
        .ProseMirror strong {
          font-weight: bold;
        }
        .ProseMirror em {
          font-style: italic;
        }
        .ProseMirror pre {
          background: rgba(0, 0, 0, 0.1);
          padding: 0.75rem;
          border-radius: 0.5rem;
          overflow-x: auto;
          margin: 0.5rem 0;
        }
        .ProseMirror code {
          font-family: monospace;
          background: rgba(0, 0, 0, 0.05);
          padding: 0.25rem 0.5rem;
          border-radius: 0.25rem;
        }
      `}</style>
    </div>
  );
}
