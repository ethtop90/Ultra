import "module-alias/register";

import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { ethers } from "hardhat";

const circom = require("circomlibjs");
import {
  MULTI_SIG,
  USDC
} from "../deployments/parameters";
import { getDeployedContractAddress, setNewOwner } from "../deployments/helpers";
import { PaymentProviders } from "../utils/types";

// Deployment Scripts
const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deploy } = await hre.deployments
  const network = hre.deployments.getNetworkName();

  const [deployer] = await hre.getUnnamedAccounts();
  const multiSig = MULTI_SIG[network] ? MULTI_SIG[network] : deployer;

  console.log(
    `
    Deploment summary for ${network}:
    deployer:                   ${deployer}
    deployer nonce:             ${await hre.ethers.provider.getTransactionCount(deployer)}
    multiSig:                   ${multiSig}
    multiSig nonce:             ${await hre.ethers.provider.getTransactionCount(multiSig)}
    ----------------------------------------------------------------------
    Ramp:                               ${getDeployedContractAddress(network, "Ramp")}
    HDFCRamp:                           ${getDeployedContractAddress(network, "HDFCRamp")}
    VenmoRampV2:                        ${getDeployedContractAddress(network, "VenmoRampV2")}
    GarantiRamp:                        ${getDeployedContractAddress(network, "GarantiRamp")}
    WiseRamp:                           ${getDeployedContractAddress(network, "WiseRamp")}
    VenmoRegistrationProcessor:         ${getDeployedContractAddress(network, "VenmoRegistrationProcessor")}
    VenmoSendProcessor:                 ${getDeployedContractAddress(network, "VenmoSendProcessor")}
    VenmoRegistrationProcessorV2:       ${getDeployedContractAddress(network, "VenmoRegistrationProcessorV2")}
    VenmoSendProcessorV2:               ${getDeployedContractAddress(network, "VenmoSendProcessorV2")}
    VenmoKeyHashAdapter:                ${getDeployedContractAddress(network, "VenmoManagedKeyHashAdapter")}
    VenmoKeyHashAdapterV2:              ${getDeployedContractAddress(network, "VenmoManagedKeyHashAdapterV2")}
    HDFCRegistrationProcessor:          ${getDeployedContractAddress(network, "HDFCRegistrationProcessor")}
    HDFCSendProcessor:                  ${getDeployedContractAddress(network, "HDFCSendProcessor")}
    HDFCKeyHashAdapter:                 ${getDeployedContractAddress(network, "HDFCManagedKeyHashAdapter")}
    GarantiRegistrationProcessor:       ${getDeployedContractAddress(network, "GarantiRegistrationProcessor")}
    GarantiSendProcessor:               ${getDeployedContractAddress(network, "GarantiSendProcessor")}
    GarantiKeyHashAdapter:              ${getDeployedContractAddress(network, "GarantiManagedKeyHashAdapter")}
    WiseAccountRegistry:                ${getDeployedContractAddress(network, "WiseAccountRegistry")}
    WiseAccountRegistrationProcessor:   ${getDeployedContractAddress(network, "WiseAccountRegistrationProcessor")}
    WiseOffRamperRegistrationProcessor: ${getDeployedContractAddress(network, "WiseOffRamperRegistrationProcessor")}
    WiseSendProcessor:                  ${getDeployedContractAddress(network, "WiseSendProcessor")}
    NullifierRegistry:                  ${getDeployedContractAddress(network, "NullifierRegistry")}
    USDC:                               ${USDC[network] ? USDC[network] : getDeployedContractAddress(network, "USDCMock")}
    Poseidon3:                          ${getDeployedContractAddress(network, "Poseidon3")}
    Poseidon6:                          ${getDeployedContractAddress(network, "Poseidon6")}
    `
  );
};

func.runAtTheEnd = true;

export default func;
