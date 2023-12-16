import App from "App";
import {ConfigProvider} from "antd";
import {Provider} from "jotai";
import ReactDOM from "react-dom";
import {BrowserRouter} from "react-router-dom";
import "tailwindcss/tailwind.css";
import {config} from "theme/antd";

ReactDOM.render(
  <BrowserRouter>
    <Provider>
      <ConfigProvider theme={config}>
        <App />
      </ConfigProvider>
    </Provider>
  </BrowserRouter>,
  document.getElementById("root"),
);
