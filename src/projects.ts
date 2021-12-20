interface ILocale<T> {
  [key: string]: T;
}

interface IProject {
  version: string;
  name: ILocale<string>;
  description: ILocale<string>;
  readme: ILocale<string>;
}

export const projects = {
  /*GeneratorStart*/

  /*GeneratorEnd*/
};

