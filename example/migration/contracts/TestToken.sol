pragma solidity ^0.5.0;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Detailed.sol";

/**
 * @title TestToken
 * @dev Very simple ERC20 Token example, where all 10000 tokens are pre-assigned to the creator.
 */
contract TestToken is ERC20, ERC20Detailed {
    // modify token name
    string public constant NAME = "ERC20";
    // modify token symbol
    string public constant SYMBOL = "ERC";
    // modify token decimals
    uint8 public constant DECIMALS = 18;
    // modify initial token supply
    uint256 public constant INITIAL_SUPPLY = 1000000 * (10 ** uint256(DECIMALS));

    /**
     * @dev Constructor that gives msg.sender all of existing tokens.
     */
    constructor () public ERC20Detailed(NAME, SYMBOL, DECIMALS) {
        _mint(msg.sender, INITIAL_SUPPLY);
    }
}
