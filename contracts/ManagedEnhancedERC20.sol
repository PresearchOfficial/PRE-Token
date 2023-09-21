pragma solidity 0.6.2;

import "@openzeppelin/contracts-ethereum-package/contracts/Initializable.sol";
import "@openzeppelin/contracts-ethereum-package/contracts/access/AccessControl.sol";
import "./EnhancedERC20.sol";
import "@openzeppelin/contracts-ethereum-package/contracts/utils/Pausable.sol";

/**
 * @dev ERC20 token with pausable token transfers.
 *
 * Useful as an emergency switch for freezing all token transfers in the
 * event of a large bug or major project-impacting event.
 */
abstract contract ManagedEnhancedERC20 is Initializable, ContextUpgradeSafe, AccessControlUpgradeSafe, EnhancedERC20, PausableUpgradeSafe {
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
   
    function __ManagedEnhancedERC20_init(string memory name, string memory symbol) internal initializer {
        __Context_init_unchained();
        __AccessControl_init_unchained();
        __ERC20_init_unchained(name, symbol);
        __Pausable_init_unchained();
        __ManagedEnhancedERC20_init_unchained();
    }
    
    function __ManagedEnhancedERC20_init_unchained() internal initializer {
        _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
        _setupRole(PAUSER_ROLE, _msgSender());
    }

        /**
     * @dev Pauses all token transfers.
     *
     * See {ERC20Pausable} and {Pausable-_pause}.
     *
     * Requirements:
     *
     * - the caller must have the `PAUSER_ROLE`.
     */
    function pause() public {
        require(hasRole(PAUSER_ROLE, _msgSender()), "ManagedEnhancedERC20: must have pauser role to pause");
        _pause();
    }

    /**
     * @dev Unpauses all token transfers.
     *
     * See {ERC20Pausable} and {Pausable-_unpause}.
     *
     * Requirements:
     *
     * - the caller must have the `PAUSER_ROLE`.
     */
    function unpause() public {
        require(hasRole(PAUSER_ROLE, _msgSender()), "ManagedEnhancedERC20: must have pauser role to unpause");
        _unpause();
    }

        /**
     * @dev See {EnhancedERC20-_beforeTokenTransferBatch}.
     *
     * Requirements:
     *
     * - the contract must not be paused.
     */
    
    function _beforeTokenTransferBatch() internal virtual override {
        super._beforeTokenTransferBatch();
        require(!paused(), "ManagedEnhancedERC20: token transfer while paused");
    }

    uint256[50] private __gap;
}
