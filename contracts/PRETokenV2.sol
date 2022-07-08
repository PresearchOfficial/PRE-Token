pragma solidity 0.6.2;

import "@openzeppelin/contracts-ethereum-package/contracts/Initializable.sol";
import "@openzeppelin/contracts-ethereum-package/contracts/math/SafeMath.sol";
import "./ManagedEnhancedERC20.sol";
import "./PREToken.sol";
import "./TransferAuthorizableERC20.sol";

/**
 * @dev Presearch ERC20 Token
 *
 * Supply capped at 500M.
 */
contract PRETokenV2 is PREToken, TransferAuthorizableERC20 {

    function initialize() public {
      require(hasRole(DEFAULT_ADMIN_ROLE, _msgSender()), "TransferAuthorizableERC20: Only Admin role can run this method.");
      _setupTransferAuthorizable();   
    }

    function _beforeMint(address from, address to, uint256 amount) internal virtual override(EnhancedERC20, PREToken) {
        super._beforeMint(from, to, amount);
    }

}
