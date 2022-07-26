pragma solidity 0.6.2;

import "@openzeppelin/contracts-ethereum-package/contracts/Initializable.sol";
import "@openzeppelin/contracts-ethereum-package/contracts/access/AccessControl.sol";
import "./EnhancedERC20.sol";
import "@openzeppelin/contracts-ethereum-package/contracts/utils/Pausable.sol";
import "./ManagedEnhancedERC20.sol";
import "./EIP712.sol";
import { ECDSAUpgradeable } from "./lib/ECDSA.sol";

/**
 * @dev ERC20 token with pausable token transfers.
 *
 * Useful as an emergency switch for freezing all token transfers in the
 * event of a large bug or major project-impacting event.
 */
abstract contract TransferAuthorizableERC20 is Initializable, ManagedEnhancedERC20, EIP712Upgradeable {
    bytes32 public constant TRANSFER_AUTHORIZER_ROLE = keccak256("TRANSFER_AUTHORIZER_ROLE");
   
    function __TransferAuthorizableERC20_init(string memory name, string memory symbol) internal initializer {
        __Context_init_unchained();
        __AccessControl_init_unchained();
        __ERC20_init_unchained(name, symbol);
        __Pausable_init_unchained();
        __ManagedEnhancedERC20_init_unchained();
        __TransferAuthorizableERC20ERC20_init_unchained();
    }
    
    function __TransferAuthorizableERC20ERC20_init_unchained() internal initializer {
        _setupTransferAuthorizable();
    }

    function getDomainSeparator() external view returns(bytes32) {
        return _domainSeparatorV4();
    }

    function _setupTransferAuthorizable() internal
    {
        _initialize(name(), "1");
        _setupRole(TRANSFER_AUTHORIZER_ROLE, _msgSender());
    } 

/*********EIP3009 */

    // keccak256("TransferWithAuthorization(address from,address to,uint256 value,uint256 validAfter,uint256 validBefore,bytes32 nonce)")
    bytes32
        public constant TRANSFER_WITH_AUTHORIZATION_TYPEHASH = 0x7c7c6cdb67a18743f49ec6fa9b35f50d52ed05cbed4cc592e13b44501c1a2267;

    // keccak256("ReceiveWithAuthorization(address from,address to,uint256 value,uint256 validAfter,uint256 validBefore,bytes32 nonce)")
    bytes32
        public constant RECEIVE_WITH_AUTHORIZATION_TYPEHASH = 0xd099cc98ef71107a616c4f0f941f04c322d8e254fe26b3c6668db87aae413de8;

    // keccak256("CancelAuthorization(address authorizer,bytes32 nonce)")
    bytes32
        public constant CANCEL_AUTHORIZATION_TYPEHASH = 0x158b0a9edf7a828aad02f63cd515c68ef2f50ba807396f6d12842833a1597429;

    /**
     * @dev authorizer address => nonce => state (true = used / false = unused)
     */
    mapping(address => mapping(bytes32 => bool)) internal _authorizationStates;

    event AuthorizationUsed(address indexed authorizer, bytes32 indexed nonce);
    event AuthorizationCanceled(
        address indexed authorizer,
        bytes32 indexed nonce
    );

    string
        internal constant _INVALID_SIGNATURE_ERROR = "EIP3009: invalid signature";
    string
        internal constant _AUTHORIZATION_USED_ERROR = "EIP3009: authorization is used";

    /**
     * @notice Returns the state of an authorization
     * @dev Nonces are randomly generated 32-byte data unique to the authorizer's
     * address
     * @param authorizer    Authorizer's address
     * @param nonce         Nonce of the authorization
     * @return True if the nonce is used
     */
    function authorizationState(address authorizer, bytes32 nonce)
        external
        view
        returns (bool)
    {
        return _authorizationStates[authorizer][nonce];
    }

    /**
     * @notice Execute a transfer with a signed authorization
     * @param from          Payer's address (Authorizer)
     * @param to            Payee's address
     * @param value         Amount to be transferred
     * @param validAfter    The time after which this is valid (unix time)
     * @param validBefore   The time before which this is valid (unix time)
     * @param nonce         Unique nonce
     * @param v             v of the signature
     * @param r             r of the signature
     * @param s             s of the signature
     */
    function transferWithAuthorization(
        address from,
        address to,
        uint256 value,
        uint256 validAfter,
        uint256 validBefore,
        bytes32 nonce,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external {
        require(hasRole(TRANSFER_AUTHORIZER_ROLE, from), "TransferAuthorizableERC20: from address is not authorized for transferWithAuthorization");
        _transferWithAuthorization(
            TRANSFER_WITH_AUTHORIZATION_TYPEHASH,
            from,
            to,
            value,
            validAfter,
            validBefore,
            nonce,
            v,
            r,
            s
        );
    }

    /**
     * @notice Receive a transfer with a signed authorization from the payer
     * @dev This has an additional check to ensure that the payee's address matches
     * the caller of this function to prevent front-running attacks. (See security
     * considerations)
     * @param from          Payer's address (Authorizer)
     * @param to            Payee's address
     * @param value         Amount to be transferred
     * @param validAfter    The time after which this is valid (unix time)
     * @param validBefore   The time before which this is valid (unix time)
     * @param nonce         Unique nonce
     * @param v             v of the signature
     * @param r             r of the signature
     * @param s             s of the signature
     */
    function receiveWithAuthorization(
        address from,
        address to,
        uint256 value,
        uint256 validAfter,
        uint256 validBefore,
        bytes32 nonce,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external {
        require(to == _msgSender(), "EIP3009: caller must be the payee");
        require(hasRole(TRANSFER_AUTHORIZER_ROLE, from), "TransferAuthorizableERC20: from address is not authorized for transferWithAuthorization");

        _transferWithAuthorization(
            RECEIVE_WITH_AUTHORIZATION_TYPEHASH,
            from,
            to,
            value,
            validAfter,
            validBefore,
            nonce,
            v,
            r,
            s
        );
    }

    /**
     * @notice Attempt to cancel an authorization
     * @param authorizer    Authorizer's address
     * @param nonce         Nonce of the authorization
     * @param v             v of the signature
     * @param r             r of the signature
     * @param s             s of the signature
     */
    function cancelAuthorization(
        address authorizer,
        bytes32 nonce,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external {
        require(
            !_authorizationStates[authorizer][nonce],
            _AUTHORIZATION_USED_ERROR
        );

        bytes memory data = abi.encode(
            CANCEL_AUTHORIZATION_TYPEHASH,
            authorizer,
            nonce
        );        

        bytes32 typedDataHash = ECDSAUpgradeable.toTypedDataHash(_domainSeparatorV4(), keccak256(data));
        
        require(
            ECDSAUpgradeable.recover(typedDataHash, v, r, s) == authorizer,
            _INVALID_SIGNATURE_ERROR
        );

        _authorizationStates[authorizer][nonce] = true;
        emit AuthorizationCanceled(authorizer, nonce);
    }

    function _transferWithAuthorization(
        bytes32 typeHash,
        address from,
        address to,
        uint256 value,
        uint256 validAfter,
        uint256 validBefore,
        bytes32 nonce,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) internal {
        require(now > validAfter, "EIP3009: authorization is not yet valid");
        require(now < validBefore, "EIP3009: authorization is expired");
        require(!_authorizationStates[from][nonce], _AUTHORIZATION_USED_ERROR);

        bytes memory data = abi.encode(
            typeHash,
            from,
            to,
            value,
            validAfter,
            validBefore,
            nonce
        );
        
        bytes32 typedDataHash = ECDSAUpgradeable.toTypedDataHash(_domainSeparatorV4(), keccak256(data));
        
        require(
            ECDSAUpgradeable.recover(typedDataHash, v, r, s) == from,
            _INVALID_SIGNATURE_ERROR
        );

        _authorizationStates[from][nonce] = true;
        emit AuthorizationUsed(from, nonce);

        _transfer(from, to, value);
    }

    uint256[49] private __gap;
}
