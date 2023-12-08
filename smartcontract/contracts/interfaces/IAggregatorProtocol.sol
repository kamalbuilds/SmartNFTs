// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity 0.7.5;

interface IAggregatorProtocol {
    function uniswapV3Swap(
        uint256 amount,
        uint256 minReturn,
        uint256[] calldata pools
    ) external payable returns(uint256 returnAmount);
}