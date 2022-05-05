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
    canUnStake: boolean;
    generation: number;
    lastClaimTimestamp: number;
}

export interface ILevelData {
    readonly klayePerDay: BigNumber;
}

export interface IStakedMnAs {
    readonly klayeStakes: IStakedMnA[];
}

export class MarineRecord {
    id: number;
    img: string;
    record: IStakedMnA;
    constructor(id: number, img: string, record: IStakedMnA) {
        this.id = id;
        this.img = img;
        this.record = record;
    }
}