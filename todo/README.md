# [Configuration with Plain Routes](https://github.com/ReactTraining/react-router/blob/v2.8.1/docs/guides/RouteConfiguration.md#configuration-with-plain-routes)

Since routes are usually nested, it's useful to use a concise nested syntax like JSX to describe their relationship to one another. However, you may also use an array of plain route objects if you prefer to avoid using JSX.

The <Redirect> configuration helper is not available when using plain routes, so you have to set up the redirect using the onEnter hook.

The route config we've discussed up to this point could also be specified like this:

const routes = {
  path: '/',
  component: App,
  indexRoute: {
     //[webpack:///./~/react-router/lib/getComponents.js line 14](https://github.com/ReactTraining/react-router/blob/v2.8.1/modules/getComponents.js#L5)  
      component: Dashboard,  
      **OR**  
      getComponent: (location, callback) => callback(null, require('frankel/components/NTG/NTG').default),

    },
   childRoutes: [
    // more route definitions...
    { path: 'about', 
      component: About 
      or
      getComponent: (locatin, callback) => callback(null, require('frankel/components/NTG/NTG').default),
    },
    
    ] 
}

render(<Router routes={routes} />, document.body)

# relay routes

```
import App from 'frankel-uk/components/App';
import { getRelayRoute } from './routerUtils';

getRelayRoute = (config) => {
    return Object.assign({
        render: function ({props, element}) {
            if (!props) {
                return <Loading />;
            } else {
                // element is dynamic so we have to call React.cloneElement; 
                // can't do return <Home {...props} />  because we don't know what <Home> is;
                return React.cloneElement(element, omitPropsForRender(props));
            }
        },
        queries: viewerQueries,
        prepareParams: (params) => config.prepareParams ? config.prepareParams(cleanParams(params)) : cleanParams(params),
    }, config);
};


export default getRelayRoute({
    path: '/',
    component: App,
});

```