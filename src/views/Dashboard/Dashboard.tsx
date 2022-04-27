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
import {BigNumber, Contract, ethers} from "ethers";
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

function Dashboard() {
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
        try {
            const load = async () => {
                let endpoint = "https://api.thegraph.com/subgraphs/name/cryptodev130/spacegame-runtime-matic-v2"
                let query = gql`{
                klayeStakes(
                    first: 500
                    where: {account: \"${address}\", status: Staked}
                ) {
                    id
                    account
                    tokenId
                    type
                    timestamp
                }
            }`

                const mnaContract = new Contract("0x017bd8887521444ff8Fbce992A37a2FE53057149", mna, provider);
                const calcContract = new Contract("0xfF10bD1baacCfbE0B797f5B6EfF20f28aD4faE62", calc, provider);
                const stakingContract = new Contract("0x74f120f659aDEBd48414f4CbB2d5BB294452F625", staking, provider);

                const data = await request<IStakedMnAs>(endpoint, query);
                const num = await provider.getBlockNumber()
                const block = await provider.getBlock(num)
                const currentDate = moment(Date.now())
                const marineIds = data.klayeStakes.filter((stake) => stake.type === 'Marine').map((marine) => marine.tokenId);
                if(marineIds.length === 0) return;
                const marineData = await calcContract.getMarinePoolData(marineIds);
                let dictionary = Object.assign({}, ...marineData.map((x: IStakedMnA) => ({[x.tokenId]: x})));
                let accumulatedKlaye = BigNumber.from(0);
                const marineLevelData = await calcContract.getTokenLevels(marineIds);
                const marineLevels = Object.assign({}, ...marineLevelData.map((x: BigNumber, i: number) => ({[marineIds[i]]: x})));

                const marines = await Promise.all(
                    data.klayeStakes.filter((stake) => stake.type === 'Marine')
                        .map(async (marine) => {
                            const endDate = moment(new Date((await calcContract.getLevelEndTimestamp(marine.tokenId)) * 1000))
                            let diff = moment.duration(endDate.diff(currentDate));
                            marine.endDate = `${diff.days()} days, ${diff.hours()} hours, ${diff.minutes()} minutes, ${diff.seconds()} seconds`;
                            const rewards = await stakingContract.calculateRewards(marine.tokenId);
                            marine.rewards = formatNumber(parseBigNumber(rewards, 18), 4).toString();
                            const lastClaimDate = moment(new Date(dictionary[marine.tokenId].lastClaimTime * 1000))
                            diff = moment.duration(currentDate.diff(lastClaimDate));
                            marine.lastClaim = `${diff.days()} days, ${diff.hours()} hours, ${diff.minutes()} minutes, ${diff.seconds()} seconds ago`;
                            marine.level = (marineLevels[marine.tokenId]).toNumber();

                            const levelData = (await calcContract.getLevelData([marine.level])).map((data: ILevelData) => data);
                            let daily = levelData[0].klayePerDay;
                            const totalDays = BigNumber.from(ethers.utils.parseEther("3")).div(daily)
                            //let days = moment.duration(marineData[marine.tokenId].startTime.add(levelData.maxRewardDuration))
                            marine.unStakeTime = `${totalDays} days`;
                            marine.daily = formatNumber(parseBigNumber(daily, 18), 2).toString();
                            accumulatedKlaye = accumulatedKlaye.add(rewards);
                            let json = (await mnaContract.tokenURI(marine.tokenId));
                            json = json.substring(json.lastIndexOf(","))
                            let decodedData = JSON.parse(Buffer.from(json, 'base64').toString());
                            marine.image = decodedData.image
                            return marine;
                        }))
                setStakedMarines(marines)

                setClaimableKlaye(formatNumber(parseBigNumber(accumulatedKlaye, 18), 10).toString())

                const aliens = await Promise.all(
                    data.klayeStakes.filter((stake) => stake.type === 'Alien')
                        .map(async (alien) => {
                                const endDate = moment(new Date((await calcContract.getLevelEndTimestamp(alien.tokenId)) * 1000))
                                let diff = moment.duration(endDate.diff(currentDate));
                                alien.rank = (await mnaContract.getTokenTraits(alien.tokenId)).rankIndex + 1;
                                alien.lastClaim = `${diff.days()} days, ${diff.hours()} hours, ${diff.minutes()} minutes, ${diff.seconds()} seconds ago`;
                                return alien;
                            }
                        )
                )
                setStakedAliens(aliens)
            }
            load()
        } catch (e) {
            console.error(e)
        }
    }, [connected])

    return (
        <div className={`${classes.content} ${isSmallerScreen && classes.contentShift}`}>
            <Paper>
                <Paper>
                    <Grid container item>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>
                                        Staked Marines
                                    </TableCell>
                                    <TableCell>
                                        Staked Aliens
                                    </TableCell>
                                    <TableCell>
                                        Claimable $KLAYE (Marines)
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow>
                                    <TableCell>
                                        <Typography>
                                            {stakedMarines.length}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography>
                                            {stakedAliens.length}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography>
                                            {claimableKlaye}
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </Grid>
                </Paper>
                <Paper>
                    <Grid container item>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>
                                        Type
                                    </TableCell>
                                    <TableCell>
                                        Token Id
                                    </TableCell>
                                    <TableCell>
                                        Current Level
                                    </TableCell>
                                    <TableCell>
                                        $KLAYE Rewards
                                    </TableCell>
                                    <TableCell>
                                        Remaining Time
                                    </TableCell>
                                    <TableCell>
                                        Last Claim
                                    </TableCell>
                                    <TableCell>
                                        Daily Accrual
                                    </TableCell>
                                    <TableCell>
                                        UnStake Date
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    (stakedMarines).map((stake, i) => {
                                        return (
                                            <TableRow key={i}>
                                                <TableCell>
                                                    <Typography>
                                                        <img src={`${stake.image}`}/>
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography>
                                                        {stake.id}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography>
                                                        {stake.level}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography>
                                                        {stake.rewards}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography>
                                                        {stake.endDate.toString()}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography>
                                                        {stake.lastClaim.toString()}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography>
                                                        {stake.daily}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography>
                                                        TBD
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })
                                }
                            </TableBody>
                        </Table>
                    </Grid>
                </Paper>
            </Paper>
        </div>
    );
}

function range(size: number, startAt = 0) {
    return [...Array(size).keys()].map(i => i + startAt);
}

export default Dashboard;