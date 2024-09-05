const ContractABI = [
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "creator",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "postID",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "bounty",
				"type": "uint256"
			}
		],
		"name": "PostCreated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "voter",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "postID",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "optionID",
				"type": "string"
			}
		],
		"name": "Voted",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "Withdrawn",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_postID",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "_bounty",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_numVoters",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "_userID",
				"type": "string"
			},
			{
				"internalType": "string[]",
				"name": "_optionIDs",
				"type": "string[]"
			}
		],
		"name": "createPost",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_userID",
				"type": "string"
			}
		],
		"name": "fetchUserBalance",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_postID",
				"type": "string"
			},
			{
				"internalType": "string[]",
				"name": "_optionIDs",
				"type": "string[]"
			}
		],
		"name": "getOptionVotes",
		"outputs": [
			{
				"internalType": "uint256[]",
				"name": "",
				"type": "uint256[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_postID",
				"type": "string"
			}
		],
		"name": "getPostDetails",
		"outputs": [
			{
				"internalType": "string",
				"name": "postID",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "creator",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "bounty",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "numVoters",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "totalVotesCast",
				"type": "uint256"
			},
			{
				"internalType": "string[]",
				"name": "peopleWhoVoted",
				"type": "string[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_userID",
				"type": "string"
			}
		],
		"name": "getUserDetails",
		"outputs": [
			{
				"internalType": "string[]",
				"name": "",
				"type": "string[]"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_userID",
				"type": "string"
			}
		],
		"name": "getUserPosts",
		"outputs": [
			{
				"internalType": "string[]",
				"name": "",
				"type": "string[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"name": "posts",
		"outputs": [
			{
				"internalType": "string",
				"name": "postID",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "creator",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "bounty",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "numVoters",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "totalVotesCast",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_userID",
				"type": "string"
			}
		],
		"name": "setUserID",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"name": "users",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "balance",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "userAddress",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_postID",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_userID",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_optionID",
				"type": "string"
			}
		],
		"name": "vote",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_userID",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "_amount",
				"type": "uint256"
			},
			{
				"internalType": "address payable",
				"name": "_to",
				"type": "address"
			}
		],
		"name": "withdraw",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"stateMutability": "payable",
		"type": "receive"
	}
]

module.exports = ContractABI;