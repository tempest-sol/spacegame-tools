import {BigNumber} from "ethers";

export interface IStakedMnA {
    readonly id: number;
    readonly account: string;
    readonly tokenId: number;
    readonly type: string;
    readonly timestamp: number;
    level: number;
    rank: number;
    rewards: string;
    endDate: Date;
    lastClaim: string;
    unStakeTime: string;
    daily: string;
    image: string;
    isAccruing: boolean;
}

export interface ILevelData {
    readonly klayePerDay: BigNumber;
}

export interface IStakedMnAs {
    readonly klayeStakes: IStakedMnA[];
}