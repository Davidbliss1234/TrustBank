import React, {useState, useEffect} from "react";
import {ethers} from "ethers";
import bankABI from "@/utils/bankABI.json";

export const Bank: React.FC = () => {

    const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
    const [account, setAccount] = useState< string| null>(null);
    const contractAddress = "0xE1f52E9ad9cD2DE6Dc4eD2AD412DA58c562777a5";

    const [contract, setcontract] = useState< any >(null);
    const [amount, setamount] = useState< number >(0);
    const [balance, setbalance] = useState< number | null>(null);

    useEffect(
        () => {
            if (typeof window.ethereum !== 'undefined') {
                setProvider(new ethers.providers.Web3Provider(window.ethereum));

            } else {
                console.warn ("Please install a browser wallet to use this website");
            }

            if (typeof window.ethereum !== 'undefined') {
                window.ethereum.on('accountsChanged' , handleAccountChange);
            }
            
        }

        ,[]
    );

    const handleAccountChange = (accounts: string []) => {
        setAccount(accounts[0]);
    }

    async function getUserBalance(account: string) {
        const userBalance = (await contract.accountBalances(account)).toNumber()
        setbalance(userBalance);
    }

    const accountConnector = async () => {
        if (!provider) throw new Error('you should have a wallet to use this website');

        try {
            handleAccountChange(await window.ethereum.request({method: 'eth_requestAccounts'}));
            setcontract(new ethers.Contract(contractAddress, bankABI, provider?.getSigner()))
        } catch (error) {
            alert('user denied access to their account')
        }
    }
    async function depositFinney() {

        const inETH = ethers.utils.parseEther((amount/1000).toString())

        const tx = await contract.deposit ({
            value: inETH 
        })

        const receipt =  await tx.wait();

        if (receipt.status == 1) {
            alert(`${amount}  finney deposited successfully`);
            getUserBalance(account);
        }else{
            alert("transaction failed,deposit unsuccessful");
        }
    }

    async function withdrawFinney() {

        const tx = await contract.withdraw(amount);

        const receipt = await tx.wait();

        if (receipt.status ==1){
            alert(`${amount} in finney deposited successfully`);
            getUserBalance(account);
        } else {
            alert("transaction failed, withdrawal unsucessful");
        }
    }


    return(
        <>
            {
                !account ? (<button onClick={accountConnector} className="connectWallet">Connect your account to the bank website</button>)
                :(<div id="accountName" >{account}</div>)
            }

            {
                balance == null && account ? (<button onClick={() => {getUserBalance(account)}} className="connectWallet">Update your balance</button>)
                : account ? (<div id="userBalance" >Your account has {balance} finney</div>) : <></>
            }

            <br />

            {
             !account ? <></>
             :<>
                 <div>Enter the amount of the finney we are dealing with today</div>
                 <input type = "number" value = {amount} onChange={(event) => { setamount(+event.target.value)}} />
                 <button onClick={depositFinney}>Deposit Finney </button>
                 <button onClick={withdrawFinney}>Withdraw Finney </button>
             </>
            }
           
        </>
    )
}