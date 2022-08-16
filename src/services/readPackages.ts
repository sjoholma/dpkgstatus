import fs from 'fs';
import readline from 'readline';
import {setPackages} from '../packages/packages';

const pkgPrefix = 'Package: ';
const descPrefix = 'Description: ';
const multilineDescPrefix = ' ';
const dependsPrefix = 'Depends: ';

export const readPackages = async () => {
  const filenameWithPath = process.env.FILENAME;

  if (!filenameWithPath) {
    throw '.env FILENAME missing';
  }

  await readFile(filenameWithPath);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  fs.watch(filenameWithPath, async (_event, _filename) => {
    if (fs.existsSync(filenameWithPath)) {
      readFile(filenameWithPath);
    }
  });
};

const readFile = async (filename: string) => {
  const fileStream = fs.createReadStream(filename);

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  const pkgs: Packages = {};
  let pkg: Package | undefined = undefined;

  for await (const line of rl) {
    if (!pkg && line.startsWith(pkgPrefix)) {
      // Use package name as selector
      pkg = {};
      pkgs[line.slice(pkgPrefix.length)] = pkg;
    } else if (pkg && line.startsWith(descPrefix)) {
      // Read description lines to an array
      pkg.descriptionLines = [line.slice(descPrefix.length)];
    } else if (
      pkg &&
      pkg.descriptionLines &&
      line.startsWith(multilineDescPrefix)
    ) {
      pkg.descriptionLines.push(line.slice(multilineDescPrefix.length));
    } else if (pkg && line.startsWith(dependsPrefix)) {
      // Parse dependency string to a list
      pkg.dependencies = line
        .slice(dependsPrefix.length)
        // Match either ', ' or ' | ' with non capturing groups
        .split(/(?:, )|(?: \| )/)
        .map(d => {
          // Strip version numbers
          const versionStartIndex = d.indexOf(' ');
          const sliceIndex =
            versionStartIndex > 0 ? versionStartIndex : undefined;
          return d.slice(0, sliceIndex);
        });
    } else if (line.length === 0) {
      // Empty line starts a next package
      pkg = undefined;
    }
  }

  setPackages(pkgs);
};
