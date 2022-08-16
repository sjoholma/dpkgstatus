type Packages = {
  [selector: string]: Package;
};

type Package = {
  descriptionLines?: string[];
  dependencies?: string[];
  dependenciesNotInList?: string[];
  packagesDependOnThis?: string[];
};
