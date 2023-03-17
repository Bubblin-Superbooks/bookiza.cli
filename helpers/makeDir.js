import path from 'path';
import { mkdirSync, writeFileSync } from 'node:fs';

export default function makeDir(dirsArray, parentDir, callback) {
  dirsArray.forEach((dirName) => {
    let dirPath = '';
    if (parentDir === undefined) {
      dirPath = dirName;
    } else {
      dirPath = path.join(parentDir, dirName);
    }
    mkdirSync(dirPath);
    writeFileSync(path.join(dirPath, '.keep'), '');
  });
  if (typeof callback === 'function') {
    callback();
  }
}
