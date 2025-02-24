import "module-alias/register";

import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { ethers } from "hardhat";

const circom = require("circomlibjs");
import {
  FROM_EMAIL,
  INTENT_EXPIRATION_PERIOD,
  MAX_ONRAMP_AMOUNT,
  MIN_DEPOSIT_AMOUNT,
  MULTI_SIG,
  ONRAMP_COOL_DOWN_PERIOD,
  SERVER_KEY_HASH,
  SUSTAINABILITY_FEE,
  SUSTAINABILITY_FEE_RECIPIENT,
  TIMESTAMP_BUFFER,
  USDC,
} from "../deployments/parameters";
import { addWritePermission, getDeployedContractAddress, setNewOwner } from "../deployments/helpers";
import { PaymentProviders } from "../utils/types";
import { ZERO } from "../utils/constants";

// Deployment Scripts
const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deploy } = await hre.deployments
  const network = hre.deployments.getNetworkName();

  const [ deployer ] = await hre.getUnnamedAccounts();
  const multiSig = MULTI_SIG[network] ? MULTI_SIG[network] : deployer;
  const paymentProvider = PaymentProviders.HDFC;

  let usdcAddress = USDC[network] ? USDC[network] : getDeployedContractAddress(network, "USDCMock");

  const poseidon6 = await deploy("Poseidon6", {
    from: deployer,
    contract: {
      abi: circom.poseidonContract.generateABI(6),
      bytecode: circom.poseidonContract.createCode(6),
    }
  });
  console.log("Poseidon6 deployed at ", poseidon6.address);

  const hdfcRamp = await deploy("HDFCRamp", {
    from: deployer,
    args: [
      deployer,
      usdcAddress,
      getDeployedContractAddress(network, "Poseidon3"),
      poseidon6.address,
      MIN_DEPOSIT_AMOUNT[paymentProvider][network],
      MAX_ONRAMP_AMOUNT[paymentProvider][network],
      INTENT_EXPIRATION_PERIOD[paymentProvider][network],
      ONRAMP_COOL_DOWN_PERIOD[paymentProvider][network],
      SUSTAINABILITY_FEE[paymentProvider][network],
      SUSTAINABILITY_FEE_RECIPIENT[paymentProvider][network] != ""
        ? SUSTAINABILITY_FEE_RECIPIENT[paymentProvider][network]
        : deployer,
    ],
  });
  console.log("HDFCRamp deployed at", hdfcRamp.address);

  const keyHashAdapter = await deploy("HDFCManagedKeyHashAdapter", {
    contract: "ManagedKeyHashAdapterV2",
    from: deployer,
    args: [SERVER_KEY_HASH[paymentProvider]],
  });
  console.log("KeyHashAdapter deployed at", keyHashAdapter.address);

  const nullifierRegistryContract = await ethers.getContractAt(
    "NullifierRegistry",
    getDeployedContractAddress(network, "NullifierRegistry")
  );

  const registrationProcessor = await deploy("HDFCRegistrationProcessor", {
    from: deployer,
    args: [
      hdfcRamp.address,
      keyHashAdapter.address,
      nullifierRegistryContract.address,
      FROM_EMAIL[paymentProvider],
      ZERO
    ],
  });
  console.log("RegistrationProcessor deployed at", registrationProcessor.address);

  const sendProcessor = await deploy("HDFCSendProcessor", {
    from: deployer,
    args: [
      getDeployedContractAddress(network, "HDFCRamp"),
      keyHashAdapter.address,
      nullifierRegistryContract.address,
      FROM_EMAIL[paymentProvider],
      TIMESTAMP_BUFFER[paymentProvider]
    ],
  });
  console.log("SendProcessor deployed at ", sendProcessor.address);
  console.log("Processors deployed...");

  const hdfcRampContract = await ethers.getContractAt("HDFCRamp", hdfcRamp.address);
  if (!(await hdfcRampContract.isInitialized())) {
    await hdfcRampContract.initialize(
      registrationProcessor.address,
      sendProcessor.address
    );
  
    console.log("HDFCRamp initialized...");
  }

  await addWritePermission(hre, nullifierRegistryContract, sendProcessor.address);
  await addWritePermission(hre, nullifierRegistryContract, registrationProcessor.address);
  console.log("NullifierRegistry permissions added...");

  console.log("Transferring ownership of contracts...");
  await setNewOwner(hre, hdfcRampContract, multiSig);
  await setNewOwner(
    hre,
    await ethers.getContractAt("HDFCRegistrationProcessor", registrationProcessor.address),
    multiSig
  );
  await setNewOwner(
    hre,
    await ethers.getContractAt("HDFCSendProcessor", sendProcessor.address),
    multiSig
  );
  await setNewOwner(
    hre,
    await ethers.getContractAt("ManagedKeyHashAdapterV2", keyHashAdapter.address),
    multiSig
  );

  console.log("Deploy finished...");
};

func.skip = async (hre: HardhatRuntimeEnvironment): Promise<boolean> => {
  const network = hre.network.name;
  if (network != "localhost") {
    try { getDeployedContractAddress(hre.network.name, "HDFCRamp") } catch (e) {return false;}
    return true;
  }
  return false;
};

export default func;
