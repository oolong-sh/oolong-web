import React from "react";
import {
  MDXEditor,
  headingsPlugin,
  linkPlugin,
  listsPlugin,
  quotePlugin,
  tablePlugin,
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
  InsertTable,
  SandpackConfig,
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";

const defaultSnippetContent = `
export default function App() {
  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
    </div>
  );
}
`.trim();

const simpleSandpackConfig: SandpackConfig = {
  defaultPreset: "react",
  presets: [
    {
      label: "React",
      name: "react",
      meta: "live react",
      sandpackTemplate: "react",
      sandpackTheme: "light",
      snippetFileName: "/App.js",
      snippetLanguage: "jsx",
      initialSnippetContent: defaultSnippetContent,
    },
  ],
};

// TODO: props type for InitializedMDXEditor component

export default function InitializedMDXEditor({ editorRef, ...props }) {
  return (
    <MDXEditor
      markdown={props.markdown} // TODO: ensure this works as intended, it had to be added to avoid typescript warnings
      plugins={[
        headingsPlugin(),
        linkPlugin(),
        listsPlugin(),
        quotePlugin(),
        tablePlugin(),
        thematicBreakPlugin(),
        diffSourcePlugin({
          diffMarkdown: props.markdown,
          viewMode: "source",
        }),

        codeBlockPlugin({ defaultCodeBlockLanguage: "js" }),
        sandpackPlugin({ sandpackConfig: simpleSandpackConfig }),
        codeMirrorPlugin({
          codeBlockLanguages: {
            // https://stackoverflow.com/a/27070872
            js: "JavaScript",
            jsx: "JavaScript (React)",
            ts: "TypeScript",
            tsx: "TypeScript (React)",
            css: "CSS",
            html: "HTML",
            json: "JSON",
            java: "Java",
            python: "Python",
            xml: "XML",
            groovy: "Groovy",
            sh: "Shell",
            bash: "Bash",
            c: "C",
            "": "Text",
          },
        }),

        toolbarPlugin({
          toolbarContents: () => (
            <>
              {" "}
              <UndoRedo />
              <BoldItalicUnderlineToggles />
              <InsertTable />
              <ConditionalContents
                options={[
                  {
                    when: (editor) => editor?.editorType === "codeblock",
                    contents: () => <ChangeCodeMirrorLanguage />,
                  },
                  {
                    when: (editor) => editor?.editorType === "sandpack",
                    contents: () => <ShowSandpackInfo />,
                  },
                  {
                    fallback: () => (
                      <>
                        <InsertCodeBlock />
                        <InsertSandpack />
                      </>
                    ),
                  },
                ]}
              />
              <DiffSourceToggleWrapper children=<>{/* TODO: */}</> />
            </>
          ),
        }),
      ]}
      {...props}
      ref={editorRef}
    />
  );
}
