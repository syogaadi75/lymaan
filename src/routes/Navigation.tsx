import ROUTES from "./Routes";
import {Route, Switch} from "react-router";
import {withQuicklink} from "quicklink/dist/react/hoc.js";

const Navigation = () => {
  const options = {
    origins: [],
  };

  return (
    <Switch>
      {ROUTES.PUBLIC.map((routes) => (
        <Route
          exact={true}
          key={routes.NAME}
          path={routes.PATH}
          component={withQuicklink(routes.COMPONENT, options)}
        />
      ))}
    </Switch>
  );
};

export default Navigation;
