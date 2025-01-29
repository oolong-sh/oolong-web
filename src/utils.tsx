import type { Node } from "./types";

export async function responseStatusCheck(response: Response) {
  if (!response.ok) {
    // TODO better error message
    const responseText = await response.text();
    throw new Error(`Error during fetch: ${responseText}`);
  }

  return response;
}

export const SEPARATOR_EXPRESSION = /[\\/]+/i;

// https://stackoverflow.com/a/57344759
export function toTree(paths: string[]) {
  return paths.reduce((r, path) => {
    const names = path.split(SEPARATOR_EXPRESSION);
    names.reduce((q, name) => {
      let temp = q.find((node) => node.name === name);
      if (!temp) q.push((temp = { name, path, children: [] }));
      return temp.children;
    }, r);
    return r;
  }, []);
}

export function collapseChildren(node: Node) {
  node.children.forEach((child: Node) => {
    collapseChildren(child);
  });

  if (node.children.length === 1 && node.children[0].children.length > 0) {
    node.name = `${node.name}/${node.children[0].name}`.replace("//", "/");
    node.children = node.children[0].children;
  }
}
