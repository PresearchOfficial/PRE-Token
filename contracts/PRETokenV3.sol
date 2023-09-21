pragma solidity 0.6.2;

import "./PRETokenV2.sol";
import "./TransferAuthorizableERC20.sol";

/**
 * @dev Presearch ERC20 Token
 *
 * Supply capped at 1B.
 */
contract PRETokenV3 is PRETokenV2 {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    
    bool private _initializedV3;

    function initialize() public override {
      require (!_initializedV3, "PRETokenV3: Contract is already initialized");
      require(hasRole(DEFAULT_ADMIN_ROLE, _msgSender()), "PRETokenV3: Only Admin role can run this method");
      _setupRole(MINTER_ROLE, _msgSender());
      _maxSupply = 1000000000e18;
      _initializedV3 = true;   
    }

    /**
     * @dev Mints new tokens.
     *
     * Requirements:
     *
     * - the caller must have the `MINTER_ROLE`.
     * - the `totalSupply` + `amount` must not exceed max supply of 1B.
     */
    function mint(address to, uint256 amount) public virtual{
      require(hasRole(MINTER_ROLE, _msgSender()), "PRETokenV3: Only Minter role can run this method");
      _mint(to, amount);
    }

    /**
     * @dev Burns `amount` tokens from the caller's address
     *
     * Requirements:
     *
     * - `amount` cannot be greater than the caller's token balance.
     */
    function burn(uint256 amount) public virtual {
      _burn(_msgSender(), amount);
    }

    function recover() public virtual{
      require(hasRole(MINTER_ROLE, _msgSender()), "PRETokenV3: Only Minter role can run this method");
      // Burn lost tokens sent to the token contract so they are not locked there forever
      // This is a safety measure which enables tokens to be re-minted later
      if(balanceOf(address(this)) > 0) {
        _burn(address(this), balanceOf(address(this)));
      }
    }

}
