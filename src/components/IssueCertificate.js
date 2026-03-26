import { useState } from "react";
import { ethers } from "ethers";
import axios from "axios";

const initialState = { name: "", course: "", id: "" };

export default function IssueCertificate({ contractAddress, abi }) {
  const [formData, setFormData] = useState(initialState);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const PINATA_JWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI0YmViMDNkMC0xMjllLTQzYWYtODdjNy1kM2RiMWRkYThkOGEiLCJlbWFpbCI6ImFiaGluYXZzaW5naDI0MzE5MDZAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiRlJBMSJ9LHsiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiTllDMSJ9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6ImI5Nzc4NjM4ODFjMWUwYjJkYzU5Iiwic2NvcGVkS2V5U2VjcmV0IjoiZWM0NGMxYmI1ZTc2MmNjYTE4ZmQwNmMzNDQ3NzQzZDQwOTc3NjgyMGU5YmU2NmQzNmIwMWVlNTExOTc1YTQ5MCIsImV4cCI6MTc5ODk0ODc0Nn0.w3xJwiAarQT4R0JFbeE4V9RA4EEO-u7zAJtZj2mSze8"; 

  const handleFileChange = (e) => { 
    setFile(e.target.files[0]); 
  };

  async function handleIssue() {
    if (!file) return alert("Please upload a file!");
    if (!window.ethereum) return alert("Please install MetaMask");

    try {
      setUploading(true);

      const formDataFile = new FormData();
      formDataFile.append("file", file);
      const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formDataFile, {
        headers: { 'Authorization': `Bearer ${PINATA_JWT}`, 'Content-Type': 'multipart/form-data' }
      });
      
      const ipfsHash = res.data.IpfsHash;
      
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, abi, signer);

      const certIdBytes = ethers.utils.formatBytes32String(formData.id);
      
      const tx = await contract.issueCertificate(
        formData.name, 
        formData.course, 
        ipfsHash, 
        certIdBytes
      );

      await tx.wait();

alert("Success! Certificate issued with ID: " + formData.id);
      setFormData({ name: "", course: "", id: "" }); 
      setFile(null); 
      
      const fileInput = document.getElementById("fileInput");
      if (fileInput) fileInput.value = "";

    } catch (error) {
      console.error(error);
      alert("Error: " + error.message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="card">
      <h3>Issue Certificate</h3>
      
      {/* CRITICAL: value={formData.xxx} links the box to the state.
         Without this, the box won't clear even if the state changes!
      */}
      <input 
        placeholder="Student Name" 
        value={formData.name} 
        onChange={e => setFormData({...formData, name: e.target.value})} 
      />
      
      <input 
        placeholder="Course" 
        value={formData.course} 
        onChange={e => setFormData({...formData, course: e.target.value})} 
      />
      
      <input 
        placeholder="Unique ID" 
        value={formData.id} 
        onChange={e => setFormData({...formData, id: e.target.value})} 
      />
      
      <input 
        type="file" 
        id="fileInput" 
        onChange={handleFileChange} 
      />

      <button onClick={handleIssue} disabled={uploading}>
        {uploading ? "Processing..." : "Issue on Blockchain"}
      </button>
    </div>
  );
}