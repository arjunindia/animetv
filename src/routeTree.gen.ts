/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as TableImport } from './routes/table'
import { Route as SettingsImport } from './routes/settings'
import { Route as SearchImport } from './routes/search'
import { Route as QueryImport } from './routes/query'
import { Route as PlayerImport } from './routes/player'
import { Route as AnimeidImport } from './routes/$animeid'
import { Route as IndexImport } from './routes/index'

// Create/Update Routes

const TableRoute = TableImport.update({
  path: '/table',
  getParentRoute: () => rootRoute,
} as any)

const SettingsRoute = SettingsImport.update({
  path: '/settings',
  getParentRoute: () => rootRoute,
} as any)

const SearchRoute = SearchImport.update({
  path: '/search',
  getParentRoute: () => rootRoute,
} as any)

const QueryRoute = QueryImport.update({
  path: '/query',
  getParentRoute: () => rootRoute,
} as any)

const PlayerRoute = PlayerImport.update({
  path: '/player',
  getParentRoute: () => rootRoute,
} as any)

const AnimeidRoute = AnimeidImport.update({
  path: '/$animeid',
  getParentRoute: () => rootRoute,
} as any)

const IndexRoute = IndexImport.update({
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/$animeid': {
      id: '/$animeid'
      path: '/$animeid'
      fullPath: '/$animeid'
      preLoaderRoute: typeof AnimeidImport
      parentRoute: typeof rootRoute
    }
    '/player': {
      id: '/player'
      path: '/player'
      fullPath: '/player'
      preLoaderRoute: typeof PlayerImport
      parentRoute: typeof rootRoute
    }
    '/query': {
      id: '/query'
      path: '/query'
      fullPath: '/query'
      preLoaderRoute: typeof QueryImport
      parentRoute: typeof rootRoute
    }
    '/search': {
      id: '/search'
      path: '/search'
      fullPath: '/search'
      preLoaderRoute: typeof SearchImport
      parentRoute: typeof rootRoute
    }
    '/settings': {
      id: '/settings'
      path: '/settings'
      fullPath: '/settings'
      preLoaderRoute: typeof SettingsImport
      parentRoute: typeof rootRoute
    }
    '/table': {
      id: '/table'
      path: '/table'
      fullPath: '/table'
      preLoaderRoute: typeof TableImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export const routeTree = rootRoute.addChildren({
  IndexRoute,
  AnimeidRoute,
  PlayerRoute,
  QueryRoute,
  SearchRoute,
  SettingsRoute,
  TableRoute,
})

/* prettier-ignore-end */

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/$animeid",
        "/player",
        "/query",
        "/search",
        "/settings",
        "/table"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/$animeid": {
      "filePath": "$animeid.tsx"
    },
    "/player": {
      "filePath": "player.tsx"
    },
    "/query": {
      "filePath": "query.tsx"
    },
    "/search": {
      "filePath": "search.tsx"
    },
    "/settings": {
      "filePath": "settings.tsx"
    },
    "/table": {
      "filePath": "table.tsx"
    }
  }
}
ROUTE_MANIFEST_END */