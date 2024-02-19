import "module-alias/register";

import { ethers } from "hardhat";
import { BigNumber } from "ethers";

import { Account } from "@utils/test/types";
import { ManagedKeyHashAdapterV2, NullifierRegistry, GarantiBodyHashVerifier, GarantiSendProcessor } from "@utils/contracts";
import DeployHelper from "@utils/deploys";
import { GrothProof } from "@utils/types";
import { calculateIbanHash, createTypedGarantiBodyHashProof, createTypedSendProof, unpackPackedGarantiId } from "@utils/protocolUtils";

import {
  getWaffleExpect,
  getAccounts
} from "@utils/test/index";
import { usdc } from "@utils/common";

const expect = getWaffleExpect();

const rawSignals = ["0x03a9c8babd6b4ad94d711f3ffbee84b7aa69f4cb0dd08d491c5a5c32eca15f60","0x000000000000000000000000000000000de437f1a84c19f842cf57e8050277ee","0x0000000000000000000000000000000085fb4e44aa54c94873414ecbf4487122","0x00000000000000000000000000000000ec2c7e8ebdd0cf3ecdbd2a47c25f6882","0x000000000000000000000000000000007d1c9c7f962023b3b2ce05fc22905b9b","0x0000000000000000000000000000000000000000000000000069746e61726167","0x00000000000000000000000000000000000000000000000000672e6f666e6940","0x000000000000000000000000000000000000000000000000006269746e617261","0x000000000000000000000000000000000000000000000000006d6f632e617662","0x000000000000000000000000000000000000000000000000000000000072742e","0x0000000000000000000000000000000000000000000000000036313433303731","0x0000000000000000000000000000000000000000000000000000000000313638","0x0000000000000000000000000000000000000000000000000030302031345254","0x0000000000000000000000000000000000000000000000000031313030203130","0x0000000000000000000000000000000000000000000000000030203437353620","0x0000000000000000000000000000000000000000000000000035333720373437","0x0000000000000000000000000000000000000000000000000000000035302030","0x000000000000000000000000000000000000000000000000000030302c303038","0x0000000000000000000000000000000000000000000000000000000000000000","0x071caee57e1bb6d2542fffa8b70fdd31f73ce937e8aa12735701d2481b7b0228","0x1234815a8ff6956b9b13bbc40073354659eb0ed3e1c1c271be7315d25a3e9105","0x0000000000000000000000000000000000000000000000000000000000003039"];

describe("GarantiSendProcessor", () => {
  let owner: Account;
  let attacker: Account;
  let ramp: Account;

  let keyHashAdapter: ManagedKeyHashAdapterV2;
  let nullifierRegistry: NullifierRegistry;
  let bodyHashVerifier: GarantiBodyHashVerifier;
  let sendProcessor: GarantiSendProcessor;

  let deployer: DeployHelper;

  beforeEach(async () => {
    [
      owner,
      attacker,
      ramp
    ] = await getAccounts();

    deployer = new DeployHelper(owner.wallet);

    keyHashAdapter = await deployer.deployManagedKeyHashAdapterV2([rawSignals[0]]);
    nullifierRegistry = await deployer.deployNullifierRegistry();
    bodyHashVerifier = await deployer.deployGarantiBodyHashVerifier();
    sendProcessor = await deployer.deployGarantiSendProcessor(
      ramp.address,
      keyHashAdapter.address,
      nullifierRegistry.address,
      bodyHashVerifier.address,
      "garanti@info.garantibbva.com.tr"
    );

    await nullifierRegistry.connect(owner.wallet).addWritePermission(sendProcessor.address);
  });

  describe("#constructor", async () => {
    it("should set the correct state", async () => {
      const rampAddress = await sendProcessor.ramp();
      const venmoKeyHashAdapter = await sendProcessor.mailServerKeyHashAdapter();
      const emailFromAddress = await sendProcessor.getEmailFromAddress();

      expect(rampAddress).to.eq(ramp.address);
      expect(venmoKeyHashAdapter).to.deep.equal(keyHashAdapter.address);
      expect(ethers.utils.toUtf8Bytes("garanti@info.garantibbva.com.tr")).to.deep.equal(ethers.utils.arrayify(emailFromAddress));
    });
  });

  describe("#processProof", async () => {
    let subjectProof: GrothProof;
    let subjectBodyHashProof: any;
    let subjectCaller: Account;

    beforeEach(async () => {
      subjectProof = createTypedSendProof(
        ["0x04f6ddde28925698d41cfde42d0e00eb06905dd1257e28fe5195f4c3f0355733", "0x2752af82c2f832b0a5cdc8b7857e02114571c3c0d565f3765cfb670488da36b6"],
        [["0x1e70fd410c856773df5b965afff61c9ec2be5b7c74444e7fc1dea40853f69a95", "0x15a70edfcf5c6151b02dc4c3e4dc52a048c60468f80ecc7239f262cc11d5eedc"],["0x14a7be578c3a020b05dfaebb4dd5477c9b02768d430095ba71e88c7fab217ff2", "0x25d909fe88b0c968b4b979a7e712ec9572e67228f5f223c338d5621776b01431"]],
        ["0x223aff55f9dd2e69448d797282d7b92546005bdd47b4628eb9e514a6b56485e3", "0x1056823edb376274bdbbf8b3a3b166926c285f7efc2762a45d1bcb26323da89a"],
        rawSignals
      );

      subjectBodyHashProof = createTypedGarantiBodyHashProof(
        ["0x11566f8ca68f705537ecec01c21ad24bab467765b3e12d69142ea758ce0d606d", "0x038d39f5ad84b3eef40687c5d14ee5bc92ce8160f7b159a8101b70e02559f84f"],
        [["0x04558f57932594fd8e1c9f50458f489bea91a5d8fb629cce53cf4f90b63ebdc5", "0x149438fb97fea75f051181a1435947af6f5bae3f091a8a5b4f7cd32ad64c34a0"],["0x0c52241b9eeaf9ce9edd43896f71455b6a15000cbbfd0cfe66a43fbda4e44e48", "0x0972f3b79538f8d6e4e78ba6b8a49d0899224f5d10847237108de1d0f135e1af"]],
        ["0x012f50c44b142d842396b74050594b02340ec75c0a25aa87e47966378024e89a", "0x1ca46971ba4bf4ce4435fda60062bef97b2d911906d1e673f5cc65682fd9e6d7"],
        ["0x000000000000000000000000000000000de437f1a84c19f842cf57e8050277ee","0x0000000000000000000000000000000085fb4e44aa54c94873414ecbf4487122","0x00000000000000000000000000000000ec2c7e8ebdd0cf3ecdbd2a47c25f6882","0x000000000000000000000000000000007d1c9c7f962023b3b2ce05fc22905b9b"]
      );

      subjectCaller = ramp;
    });

    async function subject(): Promise<any> {
      return await sendProcessor.connect(subjectCaller.wallet).processProof(subjectProof, subjectBodyHashProof);
    }

    async function subjectCallStatic(): Promise<any> {
      return await sendProcessor.connect(subjectCaller.wallet).callStatic.processProof(subjectProof, subjectBodyHashProof);
    }

    it("should process the proof", async () => {
      const {
        amount,
        timestamp,
        offRamperIdHash,
        onRamperIdHash,
        intentHash
      } = await subjectCallStatic();

      const unpackedGarantiId = unpackPackedGarantiId(rawSignals.slice(12,17).map(x => BigNumber.from(x)));

      expect(amount).to.eq(usdc(800));
      expect(timestamp).to.eq(BigNumber.from(1703416861).add(30));  // 30s is default timestamp buffer);
      expect(offRamperIdHash).to.eq(calculateIbanHash(unpackedGarantiId));
      expect(onRamperIdHash).to.eq(rawSignals[19]);
      expect(intentHash).to.eq(rawSignals[21]);
    });

    it("should add the email to the nullifier mapping", async () => {
      await subject();

      const isNullified = await nullifierRegistry.isNullified(subjectProof.signals[20].toHexString());

      expect(isNullified).to.be.true;
    });

    describe("when the proof is invalid", async () => {
      beforeEach(async () => {
        subjectProof.signals[0] = BigNumber.from("0x0000000000000000000000000000000000000000000000000076406f6d6e6476");
      });

      it("should revert", async () => {
        await expect(subject()).to.be.revertedWith("Invalid Proof");
      });
    });

    describe("when the body hash proof is invalid", async () => {
      beforeEach(async () => {
        subjectBodyHashProof.signals[0] = BigNumber.from("0x0000000000000000000000000000000000000000000000000076406f6d6e6476");
      });

      it("should revert", async () => {
        await expect(subject()).to.be.revertedWith("Invalid body hash proof");
      });
    });

    describe("when the intermediate hash inputs or body hash outputs do not match send proof", async () => {
      beforeEach(async () => {
        subjectBodyHashProof = createTypedGarantiBodyHashProof(
          ["0x0e66547750bf9cb8b1bac8aaff2a03abef9cf45c41dd854f23298122070e975c", "0x2a2b72d169e4e4d68a8b88992722e28e35ba9e4472c03f09c92e36dde7e3e22d"],
          [["0x1b97359e1fb6f0fae93b63206f27dcb6d6ffc0b877112243463de0b6d39c34ec", "0x23e07c78b5bc6a5f7527b70d1af6598f1c194b8bdb2e20c7968921704666832f"],["0x29cfa6511c7abc33d469ecf639ba9c636d25f04f7b9a525606c5c5f86f1436a6", "0x003abf5ae8e461dbb08146232029102155e586a300bbc764a1b2f77cd57fddc0"]],
          ["0x2a9929438e9855e63499be2def743cebcc02cebdf5e5e7332a63a75c7ff9b14d", "0x1103162cc9be5c964dd4f9f0e4fbcd7c4168d6d7eadabdca80062b1d511b395d"],
          ["0x00000000000000000000000000000000956aea87342330c30659a03d50e9d366","0x000000000000000000000000000000002893a7e72bb6e18dad7d41195d3d0b1b","0x00000000000000000000000000000000a884191ca5f59e979b8b748037b64f28","0x000000000000000000000000000000009d8a7867dc7f86cc32ca8dad25bad3ef"]
        );
      });

      it("should revert", async () => {
        await expect(subject()).to.be.revertedWith("Invalid intermediate or output hash");
      });
    });

    describe("when the email is from an invalid venmo address", async () => {
      beforeEach(async () => {
        await sendProcessor.setEmailFromAddress("bad-garanti@info.garantibbva.com.tr".padEnd(21, "\0"));
      });

      it("should revert", async () => {
        await expect(subject()).to.be.revertedWith("Invalid email from address");
      });
    });

    describe("when the rsa modulus doesn't match", async () => {
      beforeEach(async () => {
        await keyHashAdapter.removeMailServerKeyHash(rawSignals[0]);
      });

      it("should revert", async () => {
        await expect(subject()).to.be.revertedWith("Invalid mailserver key hash");
      });
    });

    describe("when the e-mail was used previously", async () => {
      beforeEach(async () => {
        await subject();
      });

      it("should revert", async () => {
        await expect(subject()).to.be.revertedWith("Nullifier has already been used");
      });
    });

    describe("when the caller is not the Ramp", async () => {
      beforeEach(async () => {
        subjectCaller = owner;
      });

      it("should revert", async () => {
        await expect(subject()).to.be.revertedWith("Only Ramp can call this function");
      });
    });
  });

  describe("#setMailserverKeyHashAdapter", async () => {
    let subjectVenmoMailserverKeyHashAdapter: string;
    let subjectCaller: Account;

    beforeEach(async () => {
      subjectCaller = owner;

      subjectVenmoMailserverKeyHashAdapter = attacker.address;
    });

    async function subject(): Promise<any> {
      return await sendProcessor.connect(subjectCaller.wallet).setMailserverKeyHashAdapter(subjectVenmoMailserverKeyHashAdapter);
    }

    it("should set the correct venmo keys", async () => {
      await subject();

      const venmoKeyHashAdapter = await sendProcessor.mailServerKeyHashAdapter();
      expect(venmoKeyHashAdapter).to.equal(subjectVenmoMailserverKeyHashAdapter);
    });

    describe("when the caller is not the owner", async () => {
      beforeEach(async () => {
        subjectCaller = attacker;
      });

      it("should revert", async () => {
        await expect(subject()).to.be.revertedWith("Ownable: caller is not the owner");
      });
    });
  });

  describe("#setEmailFromAddress", async () => {
    let subjectEmailFromAddress: string;
    let subjectCaller: Account;

    beforeEach(async () => {
      subjectCaller = owner;

      subjectEmailFromAddress = "new-garanti@info.garantibbva.com.tr".padEnd(21, "\0");
    });

    async function subject(): Promise<any> {
      return await sendProcessor.connect(subjectCaller.wallet).setEmailFromAddress(subjectEmailFromAddress);
    }

    it("should set the correct venmo address", async () => {
      await subject();

      const emailFromAddress = await sendProcessor.getEmailFromAddress();

      expect(ethers.utils.toUtf8Bytes("new-garanti@info.garantibbva.com.tr".padEnd(21, "\0"))).to.deep.equal(ethers.utils.arrayify(emailFromAddress));
    });

    describe("when the caller is not the owner", async () => {
      beforeEach(async () => {
        subjectCaller = attacker;
      });

      it("should revert", async () => {
        await expect(subject()).to.be.revertedWith("Ownable: caller is not the owner");
      });
    });
  });

  describe("#setTimestampBuffer", async () => {
    let subjectTimestampBuffer: BigNumber;
    let subjectCaller: Account;

    beforeEach(async () => {
      subjectCaller = owner;

      subjectTimestampBuffer = BigNumber.from(60);
    });

    async function subject(): Promise<any> {
      return await sendProcessor.connect(subjectCaller.wallet).setTimestampBuffer(subjectTimestampBuffer);
    }

    it("should set the timestamp buffer", async () => {
      await subject();

      const timestampBuffer = await sendProcessor.timestampBuffer();

      expect(subjectTimestampBuffer).to.deep.equal(timestampBuffer);
    });

    describe("when the caller is not the owner", async () => {
      beforeEach(async () => {
        subjectCaller = attacker;
      });

      it("should revert", async () => {
        await expect(subject()).to.be.revertedWith("Ownable: caller is not the owner");
      });
    });
  });
});
