import { expect } from "chai";
import hre from "hardhat";
import { ChronoForge } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

const { ethers } = hre;

describe("ChronoForge", function () {
  let chronoForge: ChronoForge;
  let owner: SignerWithAddress;
  let user1: SignerWithAddress;

  beforeEach(async function () {
    // Get signers
    [owner, user1] = await ethers.getSigners();

    // Deploy contract
    const ChronoForgeFactory = await ethers.getContractFactory("ChronoForge");
    chronoForge = await ChronoForgeFactory.deploy();
    await chronoForge.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await chronoForge.owner()).to.equal(owner.address);
    });

    it("Should have correct name and symbol", async function () {
      expect(await chronoForge.name()).to.equal("Chrono-Forge Aetherium");
      expect(await chronoForge.symbol()).to.equal("CFA");
    });
  });

  describe("Minting", function () {
    it("Should mint a new Aetherium Shard with payment", async function () {
      const mintPrice = await chronoForge.MINT_PRICE();
      
      const tx = await chronoForge.connect(user1).mint({ value: mintPrice });
      
      // Check that the event was emitted
      await expect(tx).to.emit(chronoForge, "AetheriumMinted");

      expect(await chronoForge.ownerOf(0)).to.equal(user1.address);
      expect(await chronoForge.balanceOf(user1.address)).to.equal(1);
    });

    it("Should fail to mint without sufficient payment", async function () {
      const insufficientPayment = ethers.parseEther("0.0005");
      
      await expect(chronoForge.connect(user1).mint({ value: insufficientPayment }))
        .to.be.revertedWith("Insufficient payment");
    });

    it("Should initialize token attributes correctly", async function () {
      const mintPrice = await chronoForge.MINT_PRICE();
      
      await chronoForge.connect(user1).mint({ value: mintPrice });
      
      const attributes = await chronoForge.tokenAttributes(0);
      expect(attributes.energyLevel).to.equal(100);
      expect(attributes.purity).to.equal(100);
      expect(attributes.generation).to.equal(0); // Gen1
      expect(attributes.evolved).to.equal(false);
    });
  });

  describe("Energizing", function () {
    beforeEach(async function () {
      const mintPrice = await chronoForge.MINT_PRICE();
      await chronoForge.connect(user1).mint({ value: mintPrice });
    });

    it("Should increase energy level when energizing", async function () {
      // Fast forward time by 1 day
      await ethers.provider.send("evm_increaseTime", [86400]);
      await ethers.provider.send("evm_mine", []);

      const dailyGain = await chronoForge.DAILY_ENERGY_GAIN();
      
      await expect(chronoForge.connect(user1).energize(0))
        .to.emit(chronoForge, "Energized")
        .withArgs(0, dailyGain, 1);

      const attributes = await chronoForge.tokenAttributes(0);
      expect(attributes.energyLevel).to.equal(100 + Number(dailyGain));
      expect(attributes.currentStreak).to.equal(1);
    });

    it("Should fail to energize before 24 hours", async function () {
      await expect(chronoForge.connect(user1).energize(0))
        .to.be.revertedWith("Cannot energize yet");
    });

    it("Should give streak bonus after 7 consecutive days", async function () {
      const dailyGain = await chronoForge.DAILY_ENERGY_GAIN();
      const streakMultiplier = await chronoForge.STREAK_BONUS_MULTIPLIER();
      
      // Energize for 7 consecutive days
      for (let i = 0; i < 7; i++) {
        await ethers.provider.send("evm_increaseTime", [86400]);
        await ethers.provider.send("evm_mine", []);
        await chronoForge.connect(user1).energize(0);
      }

      // 8th day should have bonus
      await ethers.provider.send("evm_increaseTime", [86400]);
      await ethers.provider.send("evm_mine", []);
      
      const bonusGain = Number(dailyGain) * Number(streakMultiplier);
      await expect(chronoForge.connect(user1).energize(0))
        .to.emit(chronoForge, "Energized")
        .withArgs(0, bonusGain, 8);
    });
  });

  describe("Evolution", function () {
    beforeEach(async function () {
      const mintPrice = await chronoForge.MINT_PRICE();
      await chronoForge.connect(user1).mint({ value: mintPrice });
    });

    it("Should evolve when conditions are met", async function () {
      // Manually set energy level to evolution threshold for testing
      // In a real scenario, this would be achieved through energizing
      const evolutionThreshold = await chronoForge.EVOLUTION_THRESHOLD();
      
      // We need to energize enough times to reach the threshold
      // For testing, let's simulate this by fast-forwarding time and energizing
      const dailyGain = await chronoForge.DAILY_ENERGY_GAIN();
      const daysNeeded = Math.ceil(Number(evolutionThreshold - BigInt(100)) / Number(dailyGain));
      
      for (let i = 0; i < daysNeeded; i++) {
        await ethers.provider.send("evm_increaseTime", [86400]);
        await ethers.provider.send("evm_mine", []);
        await chronoForge.connect(user1).energize(0);
      }

      await expect(chronoForge.connect(user1).evolve(0))
        .to.emit(chronoForge, "Evolution")
        .withArgs(0, 1); // Gen2

      const attributes = await chronoForge.tokenAttributes(0);
      expect(attributes.evolved).to.equal(true);
      expect(attributes.generation).to.equal(1); // Gen2
    });

    it("Should fail to evolve without sufficient energy", async function () {
      await expect(chronoForge.connect(user1).evolve(0))
        .to.be.revertedWith("Insufficient energy");
    });
  });

  describe("Forging", function () {
    beforeEach(async function () {
      const mintPrice = await chronoForge.MINT_PRICE();
      
      // Mint two NFTs for user1
      await chronoForge.connect(user1).mint({ value: mintPrice });
      await chronoForge.connect(user1).mint({ value: mintPrice });
      
      // Evolve both NFTs (simplified for testing)
      // In reality, would need to energize to threshold first
      const evolutionThreshold = await chronoForge.EVOLUTION_THRESHOLD();
      const dailyGain = await chronoForge.DAILY_ENERGY_GAIN();
      const daysNeeded = Math.ceil(Number(evolutionThreshold - BigInt(100)) / Number(dailyGain));
      
      for (let tokenId = 0; tokenId < 2; tokenId++) {
        for (let i = 0; i < daysNeeded; i++) {
          await ethers.provider.send("evm_increaseTime", [86400]);
          await ethers.provider.send("evm_mine", []);
          await chronoForge.connect(user1).energize(tokenId);
        }
        await chronoForge.connect(user1).evolve(tokenId);
      }
    });

    it("Should forge two evolved NFTs into a new one", async function () {
      await expect(chronoForge.connect(user1).forge(0, 1))
        .to.emit(chronoForge, "Forged")
        .withArgs(0, 1, 2);

      // Original tokens should be burned - check with custom error handling
      await expect(chronoForge.ownerOf(0)).to.be.reverted;
      await expect(chronoForge.ownerOf(1)).to.be.reverted;
      
      // New token should exist
      expect(await chronoForge.ownerOf(2)).to.equal(user1.address);
    });

    it("Should fail to forge unevolved NFTs", async function () {
      // Mint a new unevolved NFT
      const mintPrice = await chronoForge.MINT_PRICE();
      await chronoForge.connect(user1).mint({ value: mintPrice });
      
      await expect(chronoForge.connect(user1).forge(0, 2))
        .to.be.revertedWith("Both tokens must be evolved");
    });
  });

  describe("Cleansing", function () {
    beforeEach(async function () {
      const mintPrice = await chronoForge.MINT_PRICE();
      await chronoForge.connect(user1).mint({ value: mintPrice });
      
      // Add a whitelisted partner token (mock address)
      const mockPartnerToken = "0x1234567890123456789012345678901234567890";
      await chronoForge.connect(owner).whitelistPartnerToken(mockPartnerToken, true);
      
      // Infuse a trait
      await chronoForge.connect(user1).infuse(0, mockPartnerToken, "Fire Boost");
    });

    it("Should cleanse a trait and improve purity", async function () {
      const cleanseCost = await chronoForge.CLEANSE_COST();
      
      await expect(chronoForge.connect(user1).cleanse(0, 0, { value: cleanseCost }))
        .to.emit(chronoForge, "Cleansed")
        .withArgs(0, "Fire Boost", 100);

      const attributes = await chronoForge.tokenAttributes(0);
      expect(attributes.purity).to.equal(100);
    });

    it("Should fail to cleanse without sufficient payment", async function () {
      const insufficientPayment = ethers.parseEther("0.005");
      
      await expect(chronoForge.connect(user1).cleanse(0, 0, { value: insufficientPayment }))
        .to.be.revertedWith("Insufficient payment");
    });
  });

  describe("Admin Functions", function () {
    it("Should allow owner to whitelist partner tokens", async function () {
      const mockPartnerToken = "0x1234567890123456789012345678901234567890";
      
      await chronoForge.connect(owner).whitelistPartnerToken(mockPartnerToken, true);
      expect(await chronoForge.whitelistedPartnerTokens(mockPartnerToken)).to.equal(true);
      
      await chronoForge.connect(owner).whitelistPartnerToken(mockPartnerToken, false);
      expect(await chronoForge.whitelistedPartnerTokens(mockPartnerToken)).to.equal(false);
    });

    it("Should allow owner to withdraw funds", async function () {
      const mintPrice = await chronoForge.MINT_PRICE();
      await chronoForge.connect(user1).mint({ value: mintPrice });
      
      const initialBalance = await ethers.provider.getBalance(owner.address);
      
      await chronoForge.connect(owner).withdraw();
      
      const finalBalance = await ethers.provider.getBalance(owner.address);
      expect(finalBalance).to.be.gt(initialBalance);
    });
  });
});
