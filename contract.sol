
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ThumbnailVoting {

    struct Post {
        string postID;
        string[] imageUrls;
        mapping(string => string) imageDescriptions;
        string postDescription;
        address postCreator;
        mapping(string => address[]) postVotes;
        string resultImageID;
        uint256 rewardAmount;
    }
    struct User {
        string[] posts;
        uint256 balance;
    }

    mapping(address => User) public users;
    mapping(string => Post) public posts;
    mapping(string => string[]) private postImageUrlList;

    event Deposited(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);
    event PostCreated(address indexed creator, string postID);
    event ResultDeclared(string postID, string resultImageID);
    event Payout(address indexed recipient, uint256 amount);

    function deposit() public payable {
        users[msg.sender].balance += msg.value;
        emit Deposited(msg.sender, msg.value);
    }

    function withdraw(uint256 _amount) public {
        require(users[msg.sender].balance >= _amount, "Insufficient balance");
        users[msg.sender].balance -= _amount;
        payable(msg.sender).transfer(_amount);
        emit Withdrawn(msg.sender, _amount);
    }

    function createPost(
        string memory _postID, 
        string[] memory _imageUrls, 
        string[] memory _descriptions, 
        string memory _postDescription, 
        uint256 _rewardAmount
    ) public {
        require(_imageUrls.length == _descriptions.length, "Mismatch between image URLs and descriptions");

        Post storage newPost = posts[_postID];
        newPost.postID = _postID;
        newPost.postDescription = _postDescription;
        newPost.postCreator = msg.sender;
        newPost.rewardAmount = _rewardAmount;

        for (uint i = 0; i < _imageUrls.length; i++) {
            newPost.imageDescriptions[_imageUrls[i]] = _descriptions[i];
            postImageUrlList[_postID].push(_imageUrls[i]);
        }

        users[msg.sender].posts.push(_postID);
        emit PostCreated(msg.sender, _postID);
    }






 
    function declareResult(string memory _postID, string memory _resultImageID) public {
        Post storage post = posts[_postID];
        require(post.postCreator == msg.sender, "Only post creator can declare the result");
        post.resultImageID = _resultImageID;
        emit ResultDeclared(_postID, _resultImageID);
    }

    function castVote(string memory _postID, string memory _imageURL) public {
        // Voting logic handled externally
    }

    function fetchUserBalance() public view returns (uint256) {
        return users[msg.sender].balance;
    }


    function fetchPostDetails(string memory _postID) public view returns (
        string memory postID,
        string[] memory imageUrls,
        string memory postDescription,
        address postCreator,
        string memory resultImageID,
        uint256 rewardAmount
    ) {
        Post storage post = posts[_postID];
        postID = post.postID;
        postDescription = post.postDescription;
        postCreator = post.postCreator;
        resultImageID = post.resultImageID;
        rewardAmount = post.rewardAmount;

        imageUrls = postImageUrlList[_postID];
    }

    function getUserDetails() public view returns (string[] memory, uint256) {
        User storage user = users[msg.sender];
        return (user.posts, user.balance);
    }

    function getUserPosts() public view returns (string[] memory) {
        return users[msg.sender].posts;
    }

    receive() external payable {}
}
