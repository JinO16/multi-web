import React, { Suspense } from "react";
import ReactDOM from "react-dom";
// import { App } from '@containers/editor/app';
import { HashRouter, Route } from "react-router-dom";
import routers from "@containers/editor/router";

ReactDOM.render(
  <HashRouter>
    <Suspense fallback={<div>Loading...</div>}>
        {
            routers.map(({path, component}) => (
                <Route
                    key={path}
                    path={path}
                    component={component}
                />
            ))
        }
    </Suspense>
  </HashRouter>,
  document.getElementById('root')
);