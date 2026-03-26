A decentralized certificate issuance and verification system using Solidity, React, and IPFS to prevent document forgery.

Academic Certificate Verifier : A decentralized application (dApp) designed to issue and verify academic certificates using Ethereum (Hardhat) and IPFS (Pinata). This system ensures that certificates are tamper-proof, immutable, and easily verifiable by third parties without a central authority.

🚀 Features Blockchain Issuance: Store certificate metadata and unique IDs on a local Ethereum node. IPFS Integration: Securely upload and pin certificate documents (PDF/Images) using Pinata. Instant Verification: Search by Unique ID to retrieve certificate data directly from the blockchain. Gas-Optimized: Uses a 3-layer architecture (React -> Hardhat -> IPFS) to minimize on-chain data costs.

🛠 Tech Stack Frontend: React.js, Ethers.js, Axios Smart Contracts: Solidity (Ethereum) Development Environment: Hardhat (Local Node & Deployment) Storage: IPFS (via Pinata API) Wallet: MetaMask