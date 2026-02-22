import { useEditor, EditorContent } from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';
import { TextAlign } from '@tiptap/extension-text-align';
import { Color } from '@tiptap/extension-color';
import { Highlight } from '@tiptap/extension-highlight';
import { Bold, Italic, List, ListOrdered, Heading1, Heading2, Type, Palette } from 'lucide-react';

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
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Color,
      Highlight.configure({
        multicolor: true,
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) {
    return null;
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
        className={`flex-1 p-4 dark:text-white/80 light:text-purple-900 focus:outline-none prose dark:prose-invert max-w-none prose-sm prose-p:my-2 prose-h1:my-3 prose-h1:text-2xl prose-h2:my-2 prose-h2:text-xl prose-ul:my-2 prose-ol:my-2 prose-li:my-1 [&_.ProseMirror]:outline-none [&_.ProseMirror>*]:my-2`}
      />
    </div>
  );
}
