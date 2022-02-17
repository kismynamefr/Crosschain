//SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.0;
import "./IERC20.sol";

contract MyContract{
    constructor(){
        
    }

    event Approval(address owner, address spender, uint256 value);
    event Allowance(address owner, address spender);
    event Transfer(address owner, address spender, uint256 value);

    function deposit(uint256 amount, IERC20 _token) external payable returns(bool) {
        require(_token.balanceOf(msg.sender) >= amount, "Not enough money");
        _token.transferFrom(msg.sender, address(this), amount);
        emit Transfer(msg.sender, address(this), amount);
        return true;
    }
    function getBalance(IERC20 _token) external view returns(uint){
        return _token.balanceOf(address(this));
    }
    function withDraw(uint256 _amount, IERC20 _token) external payable returns(bool){
        require(_token.balanceOf(address(this)) >= _amount, "Not enough money");
        _token.transfer(msg.sender, _amount);
        emit Transfer(address(this), msg.sender, _amount);
        return true;
    }
}