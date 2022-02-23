pragma solidity >=0.8.0;
//SPDX-License-Identifier: Unlicense

contract Crosschain {
    address public owner;

    constructor(){
        owner = msg.sender;
    }
    event Transfer(address owner, address spender, uint256 value);

    function deposit() external payable {
        emit Transfer(msg.sender, address(this), msg.value);
    }
    function withdraw(uint amount) external payable returns(bool) {
        require(owner == msg.sender, "Only owner can be withdraw");
        require(amount <= address(this).balance, "Not enough money");
        payable(msg.sender).transfer(amount);
        emit Transfer(address(this), msg.sender, amount);
        return true;
    }
    
    function getBalance() public view returns(uint){
        require(owner == msg.sender, "Only owner can see balance");
        return address(this).balance;
    }
}