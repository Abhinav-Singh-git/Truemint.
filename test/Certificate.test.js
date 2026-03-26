const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("AcademicVerifier Contract", function () {
  it("Should issue and verify a certificate", async function () {
    const [owner, student] = await ethers.getSigners();

    const Certificate = await ethers.getContractFactory("CertificateVerifier");
    const certificate = await Certificate.deploy();
    await certificate.deployed();

    console.log("Contract deployed to:", certificate.address);

    const certIdBytes = ethers.utils.formatBytes32String("CERT-123");
    const studentName = "John Doe";
    const courseName = "Blockchain Basics";
    const ipfsHash = "QmXoyp...IPFS_HASH";

    const tx = await certificate.issueCertificate(
      studentName, 
      courseName, 
      ipfsHash, 
      certIdBytes
    );
    await tx.wait();

    const result = await certificate.verify(certIdBytes);
    
    expect(result[0]).to.equal(studentName);
    expect(result[1]).to.equal(courseName);
    expect(result[2]).to.equal(ipfsHash);
    expect(result[3]).to.be.true; // isValid

    console.log("Test Passed: Certificate found and verified!");
  });
});