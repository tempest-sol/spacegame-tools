import React, {
    ReactElement,
    useCallback,
    useContext,
    useMemo,
    useState,
} from "react";
import {BigNumber, BigNumberish} from "ethers";
import {formatUnits} from "ethers/lib/utils";

/**
 * Converts a BigNumber to a number
 */
export const parseBigNumber = (value: BigNumber, units: BigNumberish = 9) => {
    return parseFloat(formatUnits(value, units));
};

/**
 * Formats a number to a specified amount of decimals
 */
export const formatNumber = (number: number, precision = 0) => {
    return new Intl.NumberFormat("en-US", {
        minimumFractionDigits: precision,
        maximumFractionDigits: precision,
    }).format(number);
};

export function isIframe() {
    return window.location !== window.parent.location;
}