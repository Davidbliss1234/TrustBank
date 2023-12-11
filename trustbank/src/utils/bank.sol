// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract bank {


    mapping(address => uint) public accountBalances;


    function deposit() public payable {
        
        if (msg.value % 0.001 ether != 0) {

            //revert
            revert("it's recommended to only deposit multiples of 0.001 ether (finney)");
        }

        accountBalances[msg.sender] += msg.value/ 0.001 ether;
    }

    function withdraw(uint amount) public payable {

        //require
        require( accountBalances[msg.sender] >= amount, "You don't have enough balance");

        accountBalances[msg.sender] -= amount;
        bool sent = payable(msg.sender).send(amount * 0.001 ether);

        //assert
        assert(sent);
    }

}