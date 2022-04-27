/* eslint-disable global-require */
import React, {useEffect, useState} from "react";
import {FC} from "react";
import {useWeb3Context, Web3ContextProvider} from "./hooks/web3Context";
import {Provider} from "react-redux";
import {BrowserRouter} from "react-router-dom";
import store from "./redux/store";
import Dashboard from "./views/Dashboard/Dashboard";
import {Button} from "@material-ui/core";

const App: FC = () => {
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