let pkgs: Packages = {};
let packageNames: string[];

export const getPackageNames = () => {
  return {packageNames};
};

export const getPackage = (name: string) => {
  return {name, ...pkgs[name]};
};

export const setPackages = (newPkgs: Packages) => {
  for (const name of Object.keys(newPkgs)) {
    const pkgToUpdate = newPkgs[name];
    if (pkgToUpdate.dependencies) {
      // Gather reverse dependencies
      for (const dependencyName of pkgToUpdate.dependencies) {
        const dependency = newPkgs[dependencyName];
        if (dependency) {
          if (!dependency.packagesDependOnThis) {
            dependency.packagesDependOnThis = [name];
          } else {
            dependency.packagesDependOnThis.push(name);
          }
        } else if (!pkgToUpdate.dependenciesNotInList) {
          // In case dependency is not in the list, store it in a separate list
          pkgToUpdate.dependenciesNotInList = [dependencyName];
        } else {
          pkgToUpdate.dependenciesNotInList.push(dependencyName);
        }
      }

      // Drop not existing dependencies from the original list
      pkgToUpdate.dependencies = pkgToUpdate.dependencies.filter(
        d => !pkgToUpdate.dependenciesNotInList?.includes(d)
      );
    }
  }

  pkgs = newPkgs;
  packageNames = Object.keys(pkgs).sort();
};
