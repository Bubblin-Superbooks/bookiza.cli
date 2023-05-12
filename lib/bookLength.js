import { readdirSync } from 'fs';

export default function bookLength() {
  const pages = (source) => readdirSync(source, {
    withFileTypes: true,
  }).reduce((a, c) => {
    c.isDirectory() && a.push(c.name);
    return a;
  }, []);

  return pages('./manuscript').length;
}
