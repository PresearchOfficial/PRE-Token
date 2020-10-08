pragma solidity ^0.6.2;


import "@openzeppelin/contracts-ethereum-package/contracts/Initializable.sol";
import "@openzeppelin/contracts-ethereum-package/contracts/math/SafeMath.sol";
import "./ManagedEnhancedERC20.sol";


/**
 * @dev Presearch ERC20 Token
 *
 * Supply capped at 500M.
 */
contract PREToken is Initializable, ManagedEnhancedERC20  {
    using SafeMath for uint256;

    uint256 private _maxSupply;

    function initialize(string memory name, string memory symbol) public initializer {
        __Context_init_unchained();
        __AccessControl_init_unchained();
        __ERC20_init_unchained(name, symbol);
        __Pausable_init_unchained();
        __ManagedEnhancedERC20_init_unchained();
        __PREToken_init_unchained(); 
    }

    function __PREToken_init_unchained() internal initializer {
        _maxSupply = 500000000e18;
        _mint(_msgSender(), _maxSupply); 
    }

    function _beforeMint(address from, address to, uint256 amount) internal virtual override {
        require(totalSupply().add(amount) <= _maxSupply);
        super._beforeMint(from, to, amount);
    }
    
    //TODO: Add the following line before we introduce any additional inheritance
    //uint256[50] private __gap;

}
