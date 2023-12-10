// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@thirdweb-dev/contracts/prebuilts/loyalty/LoyaltyCard.sol";
// import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import {CCIPReceiver} from "@chainlink/contracts-ccip/src/v0.8/ccip/applications/CCIPReceiver.sol";
import {Client} from "@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol";
import {LinkTokenInterface} from "@chainlink/contracts/src/v0.8/interfaces/LinkTokenInterface.sol";
import {IRouterClient} from "@chainlink/contracts-ccip/src/v0.8/ccip/interfaces/IRouterClient.sol";
// import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract CrossChainNFT is  LoyaltyCard, CCIPReceiver {
    enum PayFeesIn {
        Native,
        LINK
    }

    string constant TOKEN_URI = "https://ipfs.io/ipfs/QmYuKY45Aq87LeL1R5dhb1hqHLp6ZFbJaCP8jxqKM1MX6y/babe_ruth_1.json";
    uint256 internal tokenId = 1;
    mapping(uint64 => address) ccNft;
    PayFeesIn payFeesIn;

    address immutable i_link;


    constructor(
        address link,
        address router ,
        // loyaltynft value
        address _defaultAdmin,
        string memory _name,
        string memory _symbol,
        string memory _contractURI,
        address[] memory _trustedForwarders,
        address _saleRecipient,
        address _royaltyRecipient,
        uint128 _royaltyBps,
        uint128 _platformFeeBps,
        address _platformFeeRecipient 
        ) 
        CCIPReceiver(router) 
        LoyaltyCard() {
        
        i_link = link;

        // super.initialize(_defaultAdmin, _name, _symbol, _contractURI, _trustedForwarders, _saleRecipient, _royaltyRecipient, _royaltyBps, _platformFeeBps, _platformFeeRecipient);

        // _initializeLoyaltyCard(msg.sender, "CrossChainNFT", "CCNFT", "YourContractURI", new address[](0), address(0), address(0), 0, 0, address(0));
    }

        // Manually call initializer function for LoyaltyCard
    // function _initializeLoyaltyCard(
    //     address _defaultAdmin,
    //     string memory _name,
    //     string memory _symbol,
    //     string memory _contractURI,
    //     address[] memory _trustedForwarders,
    //     address _saleRecipient,
    //     address _royaltyRecipient,
    //     uint128 _royaltyBps,
    //     uint128 _platformFeeBps,
    //     address _platformFeeRecipient
    // ) internal onlyOwner {
    //     // Your LoyaltyCard contract's initialization logic
    //     initialize(
    //          _defaultAdmin,
    //         _name,
    //         _symbol,
    //         _contractURI,
    //         _trustedForwarders,
    //         _saleRecipient,
    //         _royaltyRecipient,
    //         _royaltyBps,
    //         _platformFeeBps,
    //         _platformFeeRecipient
    //     );
    // }

    function supportsInterface(bytes4 interfaceId) public view virtual override(CCIPReceiver, LoyaltyCard) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function mint(address to) public {
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, TOKEN_URI);
        unchecked {
            tokenId++;
        }
    }

    function _ccipReceive(
        Client.Any2EVMMessage memory message
    ) internal override {
        (bool success, ) = address(this).call(message.data);
        require(success);
    }

    function setNftAddress(uint64 _chain, address _nftAddress) external onlyOwner {
        ccNft[_chain] = _nftAddress;
    }

    function setPayFeesIn(PayFeesIn _payFeesIn) external onlyOwner {
        payFeesIn = _payFeesIn;
    }

    function transferNft(uint64 _destinationChainSelector, uint256 _tokenId) external {
        address receiver = ccNft[_destinationChainSelector];
        address owner = ownerOf(_tokenId);

        require(_tokenId < tokenId, "tokenId not minted yet");
        require(owner == msg.sender, "not the owner of nft");
        require(receiver != address(0), "ccNft on this chain is not supported");

        _burn(_tokenId);

        Client.EVM2AnyMessage memory message = Client.EVM2AnyMessage({
            receiver: abi.encode(receiver),
            data: abi.encodeWithSignature("mint(address)", msg.sender),
            tokenAmounts: new Client.EVMTokenAmount[](0),
            extraArgs: "",
            feeToken: payFeesIn == PayFeesIn.LINK ? i_link : address(0)
        });

        uint256 fee = IRouterClient(i_router).getFee(
            _destinationChainSelector,
            message
        );

        bytes32 messageId;

        if (payFeesIn == PayFeesIn.LINK) {
            LinkTokenInterface(i_link).approve(i_router, fee);
            messageId = IRouterClient(i_router).ccipSend(
                _destinationChainSelector,
                message
            );
        } else {
            messageId = IRouterClient(i_router).ccipSend{value: fee}(
                _destinationChainSelector,
                message
            );
        }
    }

    function withdraw(address beneficiary) public onlyOwner {
        uint256 amount = address(this).balance;
        (bool sent, ) = beneficiary.call{value: amount}("");
        require(sent, "failed to send eth");
    }

    function withdrawToken(
        address beneficiary,
        address token
    ) public onlyOwner {
        uint256 amount = IERC20(token).balanceOf(address(this));
        IERC20(token).transfer(beneficiary, amount);
    }

    receive() external payable {}
}
