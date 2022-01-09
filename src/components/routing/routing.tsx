import { createContext, FC, ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { proxy, useSnapshot } from "valtio";

interface IRouting {
  path?: string;
}

interface IRouteItem {
  show?: boolean;
  path?: string;
  title?: string;
}

interface IRoutingConfig {
  [key: string]: {
    routes: IRoutingConfig,
    render?: IRouteItem;
  };
}

const RoutingCtx = createContext<string[]>([]);
const StateCtx = createContext<IRoutingConfig>(null as any);

const joinPaths = (routing: string[]) => {
  return ('/' + routing.join('/')).replace(/\/+/, '/');
};

const makeRegExp = (path: string) => {
  return new RegExp(`^${path.split('/').map(e => {
    if (e == '*') return '([^/]+)';
    if (e == '**') return '(.*)';
    if (e[0] == ':') return `(?<${e.substring(1)}>[^\\/]+)`;
    if (!e) return '';
    return `(${e})`;
  }).join('\\/')}$`);
};

const getStructure = (config: IRoutingConfig, preKey = '', combinate: { path: string, render: IRouteItem; }[] = []) => {
  for (const key in config) {
    const { routes, render } = config[key];
    const path = preKey + (key ? `/${key}` : key);
    if (render) {
      combinate.push({ path: path || '/', render });
    }
    getStructure(routes, path, combinate);
  }

  return combinate;
};

export const useRouting = (addPath = '') => {
  const setFormatHash = () => (location.hash || '/').replace(/^\#/, '');
  const [hash, setHash] = useState(setFormatHash);
  const ctxRouting = useContext(RoutingCtx);
  const path = joinPaths([...ctxRouting, addPath]);
  const routing = path.split('/');
  let stateCtx = useContext(StateCtx);

  if (!stateCtx) {
    const [state] = useState(() => proxy(stateCtx || {}));

    stateCtx = state;

    useEffect(() => {
      const listener = () => {
        setHash(setFormatHash);
      };
      addEventListener('hashchange', listener);
      return () => removeEventListener('hashchange', listener);
    }, []);

    useEffect(() => {
      for (const render of getStructure(stateCtx)) {
        let { path } = render;
        const exec = makeRegExp(path).exec(hash);
        if (exec)
          console.log(render, exec);
      };
    }, [hash]);
  }

  stateCtx[addPath] = {
    routes: {}
  };

  useEffect(() => {
    return () => {
      delete stateCtx[addPath];
    };
  }, []);

  return {
    path,
    routing,
    state: stateCtx,
    Route: (({ children }) => {
      if (!stateCtx[addPath].render)
        stateCtx[addPath].render = {
          show: false
        };

      useEffect(() => {
        return () => { delete stateCtx[addPath]?.render; };
      }, []);

      const state = useSnapshot(stateCtx[addPath]);

      if (!state.render?.show)
        return null;

      return (
        <>
          {children}
        </>
      );
    }) as FC,
    Provider: (({ children }) => {
      return (
        <StateCtx.Provider value={stateCtx[addPath].routes as IRoutingConfig}>
          <RoutingCtx.Provider value={routing}>
            {children}
          </RoutingCtx.Provider>
        </StateCtx.Provider>
      );
    }) as FC
  };
};

export const Routing: FC<IRouting> = ({ path = '', children }) => {
  const { Provider } = useRouting(path);

  return (
    <>
      <Provider>
        {children}
      </Provider>
    </>
  );
};

export const Router: FC<IRouting> = ({ path, children }) => {
  const { Route } = useRouting(path);

  return (
    <Route>
      {children}
    </Route>
  );
}; 