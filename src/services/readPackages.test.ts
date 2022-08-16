import {getPackage, getPackageNames} from '../packages/packages';
import {readPackages} from './readPackages';

jest.mock('fs', () => ({
  createReadStream: jest.requireActual('fs').createReadStream,
  watch: () => Promise.resolve('foo'),
}));

test('readPackages', async () => {
  process.env.FILENAME = './src/tests/assets/status.real';

  await readPackages();

  const result = getPackageNames();
  expect(result.packageNames.length).toBe(700);

  const result2 = getPackage('libtext-charwidth-perl');

  expect(result2).toStrictEqual({
    name: 'libtext-charwidth-perl',
    descriptionLines: [
      'get display widths of characters on the terminal',
      'This module permits perl software to get the display widths of characters',
      'and strings on the terminal, using wcwidth() and wcswidth() from libc.',
      '.',
      'It provides mbwidth(), mbswidth(), and mblen().',
    ],
    dependencies: ['libc6', 'perl-base'],
    dependenciesNotInList: ['perlapi-5.14.2'],
    packagesDependOnThis: ['libtext-wrapi18n-perl', 'debconf-i18n'],
  });
});
