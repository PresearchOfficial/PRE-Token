pragma solidity 0.6.2;

import "./PREToken.sol";
import "./TransferAuthorizableERC20.sol";

/**
 * @dev Presearch ERC20 Token
 *
 * Supply capped at 500M.
 */
contract PRETokenV2 is PREToken, TransferAuthorizableERC20 {

    bool private _initializedV2;

    function initialize() virtual public {
      require (!_initializedV2, "PRETokenV2: Contract is already initialized");
      require(hasRole(DEFAULT_ADMIN_ROLE, _msgSender()), "TransferAuthorizableERC20: Only Admin role can run this method");
      _setupTransferAuthorizable();
      _initializedV2 = true;   
    }

    function _beforeMint(address from, address to, uint256 amount) internal virtual override(EnhancedERC20, PREToken) {
        super._beforeMint(from, to, amount);
    }

    uint256[50] private __gap;

}
