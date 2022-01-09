import { Component, FC, ReactNode } from "react";

type TComponent = FC | Component | (() => ReactNode);
type TGet<T> = T | (() => T) | (() => Promise<T>) | (() => Promise<{ default: T; }>);

interface IRoute {
  path?: string;
  component?: TGet<TComponent>;
  notFound?: TGet<TComponent>;
  hasError?: TGet<TComponent>;
  childs?: TGet<IRoute | IRoute[]>[];
}

interface IBuildRoute {
  path: string;
  indexing: number[];
  pathRegExp: RegExp;
  component: TGet<TComponent>;
  notFound?: TGet<TComponent>;
  hasError?: TGet<TComponent>;
}

const makeRegExp = (path: string) => {
  return new RegExp(`^${path.split('/').map(e => {
    if (e == '*') return '([^/]+)';
    if (e == '**') return '(.*)';
    if (e[0] == ':') return `(?<${e.substring(1)}>[^\\/]+)`;
    if (!e) return '';
    return `(${e})`;
  }).join('\\/')}$`);
};

const makeRoute = async (route: IRoute, paths = [''], indexing = [0]) => {
  const outputRoutes: IBuildRoute[] = [];
  const { component, notFound, hasError, childs = [] } = route;
  let { path } = route;

  path && paths.push(path);
  path = paths.join('/') || '/';

  if (component) {
    // indexing.push(indexing.pop()! + 1);
    outputRoutes.push({
      path,
      pathRegExp: makeRegExp(path),
      component,
      hasError,
      notFound,
      indexing: [...indexing]
    } as IBuildRoute);
  }

  outputRoutes.push(
    ...await makeRoutes(childs, notFound, hasError, [...paths], [...indexing, -1])
  );

  return outputRoutes;
};

const loader = async <T>(input: TGet<T>): Promise<T> => {
  return await Promise.resolve()
    .then(async () => {
      return input instanceof Function ? input() : input;
    })
    .then(e => 'default' in e ? e.default : e);
};

const makeRoutes = async (
  routes: IRoute['childs'],
  notFound?: TGet<TComponent>,
  hasError?: TGet<TComponent>,
  paths = [''],
  indexing = [-1]
) => {
  const outputRoutes: IBuildRoute[] = [];

  for (const childLoad of routes || []) {
    const child = await loader(childLoad);

    if (Array.isArray(child)) {
      outputRoutes.push(...await makeRoutes(child, notFound, hasError, [...paths], indexing));
    } else {
      indexing.push(indexing.pop()! + 1);
      outputRoutes.push(
        ...await makeRoute(child, [...paths], indexing)
      );
    }
  }

  return outputRoutes;
};

export const makeRoutesUsing = async (routes: IRoute['childs']) => {
  const outputRoutes = await makeRoutes(routes);
  const delta: number[] = [];
  let preview: number[] | undefined;
  let index = 0;

  for (const { indexing } of outputRoutes) {
    if (preview) {
      for (let i = 0; i < Math.max(indexing.length, preview.length); i++) {
        if (delta.indexOf(i) != -1) continue;
        if ((indexing[i] ?? preview[i] ?? undefined) === undefined) continue;
        if (indexing[i] != preview[i]) delta.push(i);
      }
    }

    preview = indexing;
  }

  for (let i = 0; i < outputRoutes.length; i++) {
    const route = outputRoutes[i];
    route.indexing = route.indexing.filter((e, i) => delta.indexOf(i) != -1);
  }

  return outputRoutes;
};

export const makeExportRoutes = (routes: IRoute[]) => {
  return routes;
};