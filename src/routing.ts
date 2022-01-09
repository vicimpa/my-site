import { makeRoutesUsing } from "library/makeRoutes";
import { createElement, FC, Fragment } from "react";

export const routes = makeRoutesUsing([
  {
    childs: [
      {
        path: '',
        childs: [
        ]
      },
      {
        path: 'team',
        childs: [
        ]
      },
      {
        path: 'kpi',
        childs: [
        ]
      },
      {
        path: 'staff',
        childs: [
        ]
      },
      {
        path: 'admin',
        childs: [
        ]
      }
    ]
  },
]);