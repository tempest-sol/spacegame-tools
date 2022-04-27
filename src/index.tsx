import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import {Provider} from "react-redux";
import store from "./redux/store";
import {Web3ContextProvider} from "./hooks/web3Context";

ReactDOM.render(
    <Web3ContextProvider>
        <Provider store={store}>
            <App/>
        </Provider>
    </Web3ContextProvider>,
    document.getElementById("root"));
