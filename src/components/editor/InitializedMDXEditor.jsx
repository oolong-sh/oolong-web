import {
  MDXEditor,
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  // Toolbar
  toolbarPlugin,
  UndoRedo,
  BoldItalicUnderlineToggles,
  diffSourcePlugin,
  DiffSourceToggleWrapper,

  codeBlockPlugin,
  sandpackPlugin,
  codeMirrorPlugin,
  ConditionalContents,
  InsertCodeBlock,
  ChangeCodeMirrorLanguage,
  ShowSandpackInfo,
  InsertSandpack,
} from '@mdxeditor/editor';
import '@mdxeditor/editor/style.css';

const defaultSnippetContent = `
export default function App() {
  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
    </div>
  );
}
`.trim()


const simpleSandpackConfig = {
  defaultPreset: 'react',
  presets: [
    {
      label: 'React',
      name: 'react',
      meta: 'live react',
      sandpackTemplate: 'react',
      sandpackTheme: 'light',
      snippetFileName: '/App.js',
      snippetLanguage: 'jsx',
      initialSnippetContent: defaultSnippetContent
    },
  ]
}
 

export default function InitializedMDXEditor({
  editorRef,
  ...props
}) {
  return (
    <MDXEditor
      plugins={[
        headingsPlugin(),
        listsPlugin(),
        quotePlugin(),
        thematicBreakPlugin(),
        diffSourcePlugin(),

        codeBlockPlugin({defaultCodeBlockLanguage: 'js'}),
        sandpackPlugin({ sandpackConfig: simpleSandpackConfig }),
        codeMirrorPlugin({ codeBlockLanguages: { js: 'JavaScript', css: 'CSS' } }),

        toolbarPlugin({
          toolbarContents: () => (<>
            {' '}
            <UndoRedo />
            <BoldItalicUnderlineToggles />
            <ConditionalContents
              options={[
                { when: (editor) => editor?.editorType === 'codeblock', contents: () => <ChangeCodeMirrorLanguage /> },
                { when: (editor) => editor?.editorType === 'sandpack', contents: () => <ShowSandpackInfo /> },
                { fallback: () => (<> 
                  <InsertCodeBlock />
                  <InsertSandpack />
                </>)}
              ]}
            />
            <DiffSourceToggleWrapper />
          </>)
        }),
      ]}
      {...props}
      ref={editorRef}
    />
  );
}
