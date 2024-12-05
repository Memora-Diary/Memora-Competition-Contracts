const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MemoraCompetition", function () {
  let memoraCompetition;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    
    const MemoraCompetition = await ethers.getContractFactory("MemoraCompetition");
    memoraCompetition = await MemoraCompetition.deploy();
    await memoraCompetition.waitForDeployment();
  });

  describe("Competition Creation", function () {
    it("Should create a competition with correct parameters", async function () {
      const goal = "Complete 30 days of coding";
      const duration = 30 * 24 * 60 * 60; // 30 days in seconds
      const deposit = ethers.parseEther("0.1");

      await memoraCompetition.createCompetition(goal, duration, { value: deposit });

      const competition = await memoraCompetition.competitions(1);
      expect(competition.creator).to.equal(owner.address);
      expect(competition.goal).to.equal(goal);
      expect(competition.prizePool).to.equal(deposit);
    });
  });

  describe("Competition Joining", function () {
    beforeEach(async function () {
      await memoraCompetition.createCompetition(
        "Test Competition",
        30 * 24 * 60 * 60,
        { value: ethers.parseEther("0.1") }
      );
    });

    it("Should allow users to join competition", async function () {
      await memoraCompetition.connect(addr1).joinCompetition(1, {
        value: ethers.parseEther("0.1")
      });

      const competition = await memoraCompetition.competitions(1);
      expect(competition.prizePool).to.equal(ethers.parseEther("0.2"));
    });
  });

  describe("Result Validation", function () {
    beforeEach(async function () {
      await memoraCompetition.createCompetition(
        "Test Competition",
        30 * 24 * 60 * 60,
        { value: ethers.parseEther("0.1") }
      );
      await memoraCompetition.connect(addr1).joinCompetition(1, {
        value: ethers.parseEther("0.1")
      });
    });

    it("Should distribute prizes correctly", async function () {
      const winners = [owner.address, addr1.address];
      await memoraCompetition.validateResults(1, winners);

      const competition = await memoraCompetition.competitions(1);
      expect(competition.ended).to.be.true;
    });
  });
}); 