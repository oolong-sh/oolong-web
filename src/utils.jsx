import path from 'path';


export async function responseStatusCheck(response) {
  if (!response.ok) {
    // TODO better error message
    const responseText = await response.text();
    throw new Error(`Error during fetch: ${responseText}`);
  }

  return response;
}

const SEPARATOR_EXPRESSION = /[\\\/]+/i;

// https://dirask.com/posts/JavaScript-convert-file-paths-to-tree-multi-level-maps-DdoPK1
export function toTree(paths) {
    const tree = {};
    for (let i = 0; i < paths.length; ++i) {
        const path = paths[i];
        if (path) {
            let node = tree;
            const parts = path.split(SEPARATOR_EXPRESSION);
            for (let j = 0; j < parts.length; ++j) {
                const part = parts[j];
                if (part) {
                    node = node[part] ?? (node[part] = {});
                }
            }
        }
    }
    return tree;
};
