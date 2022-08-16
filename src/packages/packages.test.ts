import {getPackage, getPackageNames, setPackages} from './packages';

let packages = {};

beforeEach(() => {
  packages = {
    abc: {
      descriptionLines: ['123', '654'],
      dependencies: ['foo', 'bar', 'zyx'],
    },
    foo: {
      descriptionLines: ['fooobaar'],
      dependencies: ['bar', 'zyx'],
    },
    bar: {
      descriptionLines: ['fooobaar'],
      dependencies: ['zyx', 'raf'],
    },
  };
});

test('getPackageNames', () => {
  setPackages(packages);
  const result = getPackageNames();

  expect(result).toStrictEqual({packageNames: ['abc', 'bar', 'foo']});
});

test('getPackage - abc', () => {
  setPackages(packages);
  const result = getPackage('abc');

  expect(result).toStrictEqual({
    name: 'abc',
    descriptionLines: ['123', '654'],
    dependencies: ['foo', 'bar'],
    dependenciesNotInList: ['zyx'],
  });
});

test('getPackage - foo', () => {
  setPackages(packages);
  const result = getPackage('foo');

  expect(result).toStrictEqual({
    name: 'foo',
    descriptionLines: ['fooobaar'],
    dependencies: ['bar'],
    dependenciesNotInList: ['zyx'],
    packagesDependOnThis: ['abc'],
  });
});

test('getPackage - bar', () => {
  setPackages(packages);
  const result = getPackage('bar');

  expect(result).toStrictEqual({
    name: 'bar',
    descriptionLines: ['fooobaar'],
    dependencies: [],
    dependenciesNotInList: ['zyx', 'raf'],
    packagesDependOnThis: ['abc', 'foo'],
  });
});
