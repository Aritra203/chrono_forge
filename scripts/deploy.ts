import { ethers } from "hardhat";

async function main() {
  console.log("Deploying ChronoForge contract...");

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  // Get account balance
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "ETH");

  // Deploy the contract
  const ChronoForge = await ethers.getContractFactory("ChronoForge");
  const chronoForge = await ChronoForge.deploy();

  await chronoForge.waitForDeployment();

  const contractAddress = await chronoForge.getAddress();
  console.log("ChronoForge deployed to:", contractAddress);

  // Verify deployment
  console.log("Verifying contract properties...");
  const name = await chronoForge.name();
  const symbol = await chronoForge.symbol();
  const owner = await chronoForge.owner();
  const mintPrice = await chronoForge.MINT_PRICE();
  const maxSupply = await chronoForge.MAX_SUPPLY();

  console.log("Contract Name:", name);
  console.log("Contract Symbol:", symbol);
  console.log("Contract Owner:", owner);
  console.log("Mint Price:", ethers.formatEther(mintPrice), "ETH");
  console.log("Max Supply:", maxSupply.toString());

  // Save deployment info
  const deploymentInfo = {
    contractAddress,
    deployer: deployer.address,
    network: (await ethers.provider.getNetwork()).name,
    chainId: (await ethers.provider.getNetwork()).chainId.toString(),
    deploymentBlock: await ethers.provider.getBlockNumber(),
    timestamp: new Date().toISOString(),
    contractDetails: {
      name,
      symbol,
      owner,
      mintPrice: ethers.formatEther(mintPrice),
      maxSupply: maxSupply.toString(),
    }
  };

  console.log("\n=== Deployment Summary ===");
  console.log(JSON.stringify(deploymentInfo, null, 2));

  // Instructions for next steps
  console.log("\n=== Next Steps ===");
  console.log("1. Update your .env file with the contract address:");
  console.log(`   NEXT_PUBLIC_CONTRACT_ADDRESS=<parameter>${contractAddress}`);
  console.log("\n2. Verify the contract on Etherscan (if on mainnet/testnet):");
  console.log(`   npx hardhat verify --network <network> ${contractAddress}`);
  console.log("\n3. Test the contract:");
  console.log("   npx hardhat test");
  console.log("\n4. Start the frontend:");
  console.log("   npm run dev");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
