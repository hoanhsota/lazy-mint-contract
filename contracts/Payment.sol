// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';

contract Payment is Ownable {
    using SafeERC20 for IERC20;

    address public adminAddress;
    mapping(address => Purchase[]) public purchaseHistory;

    struct Purchase {
        string orderID;
        uint256 amount;
        address token;
        uint256 purchaseTime;
    }

    event PurchaseByToken(string orderID, uint256 amount, address token, uint256 purchaseTime);
    event WithdrawContractToken(address token, address receiver);

    constructor() {
        adminAddress = msg.sender;
    }

    function purchase(string memory _orderID, address _token, uint256 _amount) external {
        require(_amount > 0, "Transfer amount invalid");

        require(IERC20(_token).balanceOf(msg.sender) >= _amount, "Insufficient token balance");

        IERC20(_token).safeTransferFrom(msg.sender, adminAddress, _amount);

        Purchase memory purchase = Purchase({
        orderID : _orderID,
        amount : _amount,
        token : _token,
        purchaseTime : block.timestamp
        });

        purchaseHistory[msg.sender].push(purchase);

        emit PurchaseByToken(
            _orderID,
            _amount,
            _token,
            block.timestamp
        );
    }

    function withdrawContractToken(address token) external onlyOwner {
        uint256 balance = IERC20(token).balanceOf(address(this));
        require(balance > 0, "Insufficient token balance");
        IERC20(token).safeTransfer(adminAddress, balance);

        emit WithdrawContractToken(token, address(this));
    }
}