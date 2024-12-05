const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("MemoraCompetition", (m) => {
  const memoraCompetition = m.contract("MemoraCompetition");

  return { memoraCompetition };
}); 