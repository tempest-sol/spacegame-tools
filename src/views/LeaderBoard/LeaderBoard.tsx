import {
    Grid,
    makeStyles,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
    useMediaQuery
} from "@material-ui/core";
import React, {useEffect, useState} from "react";
import {gql, request} from "graphql-request";
import {abi as mna} from "../../assets/contracts/MnAv2.json";
import {abi as calc} from "../../assets/contracts/SpaceGameCalculator.json";
import {abi as staking} from "../../assets/contracts/StakingPoolv2.json";
import {BigNumber, Contract} from "ethers";
import {useWeb3Context} from "../../hooks/web3Context";
import {ILevelData, IStakedMnA, IStakedMnAs} from "../interfaces";
import moment from "moment";
import {formatNumber, parseBigNumber} from "../../helpers";

const drawerWidth = 280;
const transitionDuration = 969;

const useStyles = makeStyles(theme => ({
    drawer: {
        [theme.breakpoints.up("md")]: {
            width: drawerWidth,
            flexShrink: 0,
        },
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(1),
        transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.sharp,
            duration: transitionDuration,
        }),
        height: "100%",
        overflow: "auto",
        marginLeft: drawerWidth,
        marginRight: drawerWidth
    },
    contentShift: {
        transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.easeOut,
            duration: transitionDuration,
        }),
        marginLeft: 0,
    },
    // necessary for content to be below app bar
    toolbar: theme.mixins.toolbar,
    drawerPaper: {
        width: drawerWidth,
    },
}));

function LeaderBoard() {
    const classes = useStyles();
    const {
        connect,
        connected,
        provider,
        address
    } = useWeb3Context();
    const [stakedMarines, setStakedMarines] = useState(new Array<IStakedMnA>())
    const [stakedAliens, setStakedAliens] = useState(new Array<IStakedMnA>())
    const [claimableKlaye, setClaimableKlaye] = useState("0")

    const isSmallerScreen = useMediaQuery("(max-width: 980px)");
    const isSmallScreen = useMediaQuery("(max-width: 600px)");
    useEffect(() => {
        const load = async () => {

        }
        try {

        } catch (e) {
            console.error(e)
        }
    }, [connected])

    return (
        <div className={`${classes.content} ${isSmallerScreen && classes.contentShift}`}>
            <Paper>

            </Paper>
        </div>
    );
}

function range(size: number, startAt = 0) {
    return [...Array(size).keys()].map(i => i + startAt);
}

export default LeaderBoard;