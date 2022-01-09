interface ILocale<T> {
  [key: string]: T;
}

interface IProject {
  id: string;
  version: string;
  name: ILocale<string>;
  description: ILocale<string>;
  screenshots?: { name: string; value: Promise<typeof import("*?url")>; }[];
  readme: ILocale<Promise<typeof import("*?raw")>>;
}

export const projects: IProject[] = [
  /*generate*/
  {
    id: 'empty',
    version: '0.0.0',
    name: {
      en: 'Empty project'
    },
    description: {
      en: 'Project form settings builder'
    },
    screenshots: [
      {
        name: 'screen1.png',
        value: import('../projects/empty/screenshots/screen1.png?url')
      }
    ],
    readme: {
      en: import('../projects/empty/README.md?raw')
    }
  }
  /*generate*/
];

