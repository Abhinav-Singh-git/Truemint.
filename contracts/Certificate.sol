// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract CertificateVerifier {
    struct Certificate {
        string studentName;
        string course;
        string ipfsHash;
        uint256 timestamp;
        bool isValid; // We use this to check for existence
    }

    mapping(bytes32 => Certificate) public certificates;
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    function issueCertificate(string memory _name, string memory _course, string memory _ipfs, bytes32 _certId) public {
        require(msg.sender == owner, "Only college admin can issue");
        
        // THE FIX: If isValid is already true, this ID is taken
        require(!certificates[_certId].isValid, "Error: Certificate ID already exists!");

        certificates[_certId] = Certificate(_name, _course, _ipfs, block.timestamp, true);
    }

    function verify(bytes32 _certId) public view returns (string memory, string memory, string memory, bool) {
        Certificate memory cert = certificates[_certId];
        return (cert.studentName, cert.course, cert.ipfsHash, cert.isValid);
    }
}