import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import TiptapImage from "@tiptap/extension-image";
import { 
  Bold, 
  Italic, 
  Underline, 
  Strikethrough, 
  List, 
  ListOrdered, 
  Quote, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  Link2, 
  Image, 
  Paperclip, 
  Smile, 
  Undo2, 
  Redo2,
  X
} from "lucide-react";
import EmojiPicker from 'emoji-picker-react';

// Declare ToolbarButton outside of render
const ToolbarButton = ({ onClick, isActive, children, title }) => (
  <button
    onClick={onClick}
    title={title}
    className={`
      group relative p-2 rounded-lg transition-all duration-200 
      ${isActive 
        ? "bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30" 
        : "bg-gray-200 dark:bg-slate-700/50 text-gray-700 dark:text-slate-300 hover:bg-gray-300 dark:hover:bg-slate-600/70 hover:text-gray-900 dark:hover:text-white hover:shadow-md"
      }
      active:scale-95
    `}
  >
    {children}
  </button>
);

// Declare Divider outside of render
const Divider = () => (
  <div className="w-px h-8 bg-gray-300 dark:bg-slate-600/50 mx-1" />
);

const TiptapEditor = ({ value, setValue }) => {
  const [showEmojiPicker, setShowEmojiPicker] = React.useState(false);
  const [showLinkModal, setShowLinkModal] = React.useState(false);
  const [linkUrl, setLinkUrl] = React.useState('');
  const [linkText, setLinkText] = React.useState('');

  const editor = useEditor({
    extensions: [
      StarterKit,
      TiptapImage,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      setValue(editor.getHTML());
    },
  });

  if (!editor) return null;

  const addEmoji = (emoji) => {
    editor.chain().focus().insertContent(emoji).run();
  };

  return (
    <>
      <input
        type="file"
        id="imageUpload"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files[0];
          if (!file) return;

          const reader = new FileReader();
          reader.onload = (event) => {
            const img = new window.Image();
            img.onload = () => {
              const MAX_WIDTH = 600;
              const MAX_HEIGHT = 400;
              let width = img.width;
              let height = img.height;

              if (width > MAX_WIDTH) {
                const scale = MAX_WIDTH / width;
                width = width * scale;
                height = height * scale;
              }
              if (height > MAX_HEIGHT) {
                const scale = MAX_HEIGHT / height;
                width = width * scale;
                height = height * scale;
              }

              const canvas = document.createElement("canvas");
              canvas.width = width;
              canvas.height = height;
              const ctx = canvas.getContext("2d");
              ctx.drawImage(img, 0, 0, width, height);

              const resizedDataUrl = canvas.toDataURL(file.type);
              editor.chain().focus().setImage({ src: resizedDataUrl }).run();
            };
            img.src = event.target.result;
          };
          reader.readAsDataURL(file);
        }}
      />

      <input
        type="file"
        id="attachmentUpload"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files[0];
          if (!file) return;

          const url = URL.createObjectURL(file);
          editor.chain().focus()
            .insertContent(
              `<a href="${url}" target="_blank" download="${file.name}" class="underline text-blue-400">${file.name}</a>`
            )
            .run();
        }}
      />

      <div className="bg-gradient-to-br from-gray-100 to-gray-50 dark:from-slate-900 dark:to-slate-800 p-4 rounded-xl shadow-2xl border border-gray-200 dark:border-slate-700/50 flex flex-col h-full">
        {/* Toolbar - Fixed at top */}
        <div className="flex flex-wrap items-center gap-1.5 mb-3 p-2 bg-white dark:bg-slate-800/50 rounded-lg flex-shrink-0">
          {/* Text formatting */}
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive("bold")}
            title="Bold"
          >
            <Bold className="w-4 h-4" />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive("italic")}
            title="Italic"
          >
            <Italic className="w-4 h-4" />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            isActive={editor.isActive("underline")}
            title="Underline"
          >
            <Underline className="w-4 h-4" />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleStrike().run()}
            isActive={editor.isActive("strike")}
            title="Strikethrough"
          >
            <Strikethrough className="w-4 h-4" />
          </ToolbarButton>

          <Divider />

          {/* Lists */}
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive("bulletList")}
            title="Bullet List"
          >
            <List className="w-4 h-4" />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive("orderedList")}
            title="Numbered List"
          >
            <ListOrdered className="w-4 h-4" />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            isActive={editor.isActive("blockquote")}
            title="Blockquote"
          >
            <Quote className="w-4 h-4" />
          </ToolbarButton>

          <Divider />

          {/* Text alignment */}
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            isActive={editor.isActive({ textAlign: "left" })}
            title="Align Left"
          >
            <AlignLeft className="w-4 h-4" />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            isActive={editor.isActive({ textAlign: "center" })}
            title="Align Center"
          >
            <AlignCenter className="w-4 h-4" />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            isActive={editor.isActive({ textAlign: "right" })}
            title="Align Right"
          >
            <AlignRight className="w-4 h-4" />
          </ToolbarButton>

          <Divider />

          {/* Link, Image, Attachment */}
          <ToolbarButton
            onClick={() => setShowLinkModal(true)}
            isActive={false}
            title="Insert Link"
          >
            <Link2 className="w-4 h-4" />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => document.getElementById('imageUpload').click()}
            isActive={false}
            title="Insert Image"
          >
            <Image className="w-4 h-4" />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => document.getElementById('attachmentUpload').click()}
            isActive={false}
            title="Attach File"
          >
            <Paperclip className="w-4 h-4" />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            isActive={showEmojiPicker}
            title="Insert Emoji"
          >
            <Smile className="w-4 h-4" />
          </ToolbarButton>

          <Divider />

          {/* Undo / Redo */}
          <ToolbarButton
            onClick={() => editor.chain().focus().undo().run()}
            isActive={false}
            title="Undo"
          >
            <Undo2 className="w-4 h-4" />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().redo().run()}
            isActive={false}
            title="Redo"
          >
            <Redo2 className="w-4 h-4" />
          </ToolbarButton>
        </div>

        {/* Link Modal */}
        {showLinkModal && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm rounded-xl flex items-center justify-center z-50 animate-in fade-in duration-200">
            <div className="bg-gradient-to-br from-white to-gray-50 dark:from-slate-800 dark:to-slate-900 p-6 rounded-xl shadow-2xl border border-gray-200 dark:border-slate-700 w-96 animate-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Link2 className="w-5 h-5 text-cyan-400" />
                  Insert Link
                </h3>
                <button
                  onClick={() => {
                    setShowLinkModal(false);
                    setLinkUrl('');
                    setLinkText('');
                  }}
                  className="p-1 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600 dark:text-slate-400" />
                </button>
              </div>
              
              <input
                type="text"
                placeholder="https://example.com"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                className="mb-3 p-3 rounded-lg w-full bg-gray-100 dark:bg-slate-700/50 border border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
              />
              
              <input
                type="text"
                placeholder="Display Text"
                value={linkText}
                onChange={(e) => setLinkText(e.target.value)}
                className="mb-4 p-3 rounded-lg w-full bg-gray-100 dark:bg-slate-700/50 border border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
              />
              
              <button
                onClick={() => {
                  editor
                    .chain()
                    .focus()
                    .insertContent(`<a href="${linkUrl}" target="_blank">${linkText}</a>`)
                    .run();
                  setShowLinkModal(false);
                  setLinkUrl('');
                  setLinkText('');
                }}
                className="w-full px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg text-white font-medium hover:from-cyan-600 hover:to-blue-700 transition-all duration-200 shadow-lg shadow-cyan-500/30 active:scale-95"
              >
                Insert Link
              </button>
            </div>
          </div>
        )}

        {/* Editor - Scrollable container */}
        <div className="flex-1 overflow-y-auto min-h-0">
          <EditorContent
            editor={editor}
            className="
              text-gray-900 dark:text-slate-100 min-h-full p-4 rounded-lg bg-white dark:bg-slate-900/30 border border-gray-200 dark:border-slate-700/30
              focus-within:border-cyan-500/50 focus-within:shadow-lg focus-within:shadow-cyan-500/10 transition-all duration-200
              [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-2
              [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:my-2
              [&_blockquote]:border-l-4 [&_blockquote]:border-cyan-500
              [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-gray-700 dark:[&_blockquote]:text-slate-300
              [&_img]:max-w-full [&_img]:h-auto [&_img]:my-3 [&_img]:rounded-lg [&_img]:shadow-xl
              [&_a]:text-cyan-400 [&_a]:underline [&_a]:hover:text-cyan-300
              [&_.ProseMirror]:outline-none [&_.ProseMirror]:min-h-[200px]
            "
          />
        </div>
      </div>

      {/* Emoji Picker */}
      {showEmojiPicker && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 animate-in zoom-in-95 fade-in duration-200">
          <div className="relative">
            <button
              onClick={() => setShowEmojiPicker(false)}
              className="absolute -top-3 -right-3 p-2 bg-white dark:bg-slate-800 rounded-full shadow-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors z-10 border border-gray-200 dark:border-slate-600"
            >
              <X className="w-4 h-4 text-gray-700 dark:text-slate-300" />
            </button>
            <EmojiPicker
              onEmojiClick={(emojiObject) => {
                addEmoji(emojiObject.emoji);
                setShowEmojiPicker(false);
              }}
              theme="auto"
              previewConfig={{ showPreview: false }}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default TiptapEditor;