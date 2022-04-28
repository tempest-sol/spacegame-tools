/* eslint-disable global-require */
import React, {useEffect, useState} from "react";
import {FC} from "react";
import {useWeb3Context, Web3ContextProvider} from "./hooks/web3Context";
import {Provider} from "react-redux";
import {BrowserRouter} from "react-router-dom";
import store from "./redux/store";
import Dashboard from "./views/Dashboard/Dashboard";
import {Button} from "@material-ui/core";
import {CssBaseline, ThemeProvider} from "@mui/material";
import useTheme from "./hooks/useTheme";

import {dark as darkTheme} from "./themes/dark.js";
import {light as lightTheme} from "./themes/light.js";
import {girth as gTheme} from "./themes/girth.js";

const App: FC = () => {
    const [theme, toggleTheme] = useTheme();
    let themeMode = theme === "light" ? lightTheme : darkTheme;

    useEffect(() => {
        themeMode = theme === "light" ? lightTheme : darkTheme;
    }, [theme]);

    const {
        connect,
        hasCachedProvider,
        connected,
        networkId,
        providerInitialized,
    } = useWeb3Context();
    const [walletChecked, setWalletChecked] = useState(false);

    useEffect(() => {
        if (hasCachedProvider()) {
            // then user DOES have a wallet
            connect().then(() => {
                setWalletChecked(true);
            }).catch((error) => {
                // rejection
                console.error(error);
            });
        } else {
            // then user DOES NOT have a wallet
            setWalletChecked(true);
        }
    }, []);

    useEffect(() => {
        if (walletChecked) {
            if (networkId !== -1) {
                // future placeholder for loading data
                connect().then(() => {
                    setWalletChecked(true);
                }).catch((error) => {
                    // rejection
                    console.error(error);
                });
            }
        }
    }, [walletChecked, networkId]);

    useEffect(() => {
        if (connected && providerInitialized) {
            // future placeholder for loading account data
        }
    }, [connected, networkId, providerInitialized]);
    return (
        <BrowserRouter basename={"/"}>
            <Dashboard/>
        </BrowserRouter>
    );
};

const Wallet = () => {
    const {connect, connected, disconnect} = useWeb3Context();
    return (
        <>
            <Button className="rounded connectWallet"
                    onClick={connected ? disconnect : connect}>
                <span>{connected ? "Disconnect" : "Connect"}</span>
            </Button>
        </>
    );
};

export default App;