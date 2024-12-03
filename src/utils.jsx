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

// https://stackoverflow.com/a/57344759
export function toTree(paths) {
  return paths.reduce((r, path) => {
    var names = path.split(SEPARATOR_EXPRESSION);
    names.reduce((q, name) => {
      var temp = q.find(node => node.name === name);
      if (!temp)
        q.push(temp = { name, path, children: [] });
      return temp.children;
    }, r);
    return r;
  }, []);
};
