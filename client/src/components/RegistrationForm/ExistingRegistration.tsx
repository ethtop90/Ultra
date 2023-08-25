import React, { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import { CheckCircle } from 'react-feather'

import { Button } from "../Button";
import { Col } from "../legacy/Layout";
import { CustomConnectButton } from "../common/ConnectButton"
import { encryptMessage } from "../../helpers/messagEncryption";
import { generateVenmoIdHash } from "../../helpers/venmoHash";
import { NumberedStep } from "../common/NumberedStep";
import { ReadOnlyInput } from "../common/ReadOnlyInput";
import { RowBetween } from '../layouts/Row'
import { SingleLineInput } from "../common/SingleLineInput";
import { ThemedText } from '../../theme/text'
import useRampRegistration from '../../hooks/useRampRegistration'


interface ExistingRegistrationProps {
  loggedInWalletAddress: string;
  handleNewRegistrationClick: () => void;
}
 
export const ExistingRegistration: React.FC<ExistingRegistrationProps> = ({
  loggedInWalletAddress,
  handleNewRegistrationClick
}) => {
  /*
    Contexts
  */
  const { registrationHash } = useRampRegistration();

  /*
    State
  */
  const persistedVenmoIdKey = `persistedVenmoId_${loggedInWalletAddress}`;
  const [venmoIdInput, setVenmoIdInput] = useState<string>(localStorage.getItem(persistedVenmoIdKey) || "");
  
  const [hashedVenmoId, setHashedVenmoId] = useState<string>('');

  /*
    Hooks
  */

  useEffect(() => {
    setVenmoIdInput('');
  }, [loggedInWalletAddress]);

  useEffect(() => {
    // create an async function inside the effect
    const updateVenmoId = async () => {
      if(venmoIdInput && venmoIdInput.length > 15) {
  
        const hashedVenmoId = await generateVenmoIdHash(venmoIdInput);
        setHashedVenmoId(hashedVenmoId);
  
        // Persist venmo id input so user doesn't have to paste it again in the future
        localStorage.setItem(persistedVenmoIdKey, venmoIdInput);
      }
    }
  
    updateVenmoId();
  }, [venmoIdInput]);

  /*
    Component
  */
  return (
    <Container>
      <Column>
        <TitleRow>
          <ThemedText.HeadlineMedium>
            Registration
          </ThemedText.HeadlineMedium>
          {loggedInWalletAddress ? (
            <Button onClick={handleNewRegistrationClick} height={40}>
                + Update
            </Button>
          ) : null}
        </TitleRow>

        <Content>
          {!loggedInWalletAddress ? (
                <ErrorContainer>
                  <ThemedText.DeprecatedBody textAlign="center">
                    <CheckCircleIcon strokeWidth={1} style={{ marginTop: '2em' }} />
                    <div>
                      Your Venmo registration will appear here.
                    </div>
                  </ThemedText.DeprecatedBody>
                  <CustomConnectButton />
                </ErrorContainer>
          ) : (
            <Body>
              <NumberedInputContainer>
                <NumberedStep>
                  Your Venmo ID is hashed on chain to conceal your identity. Verify your existing registered ID by pasting your
                  Venmo ID below and tapping verify
                </NumberedStep>
              </NumberedInputContainer>
              <ReadOnlyInput
                label="Registration Status"
                value={ registrationHash ? "Registered" : "Not Registered" }
              />
              <SingleLineInput
                label="Verify Venmo ID"
                value="645716473020416186"
                placeholder={'1234567891011121314'}
                onChange={(e) => {
                  setVenmoIdInput(e.currentTarget.value);
                }}
              />
              <Button
                onClick={async () => {
                  // TODO: Poseidon hash venmoIDInput and give feedback if it matches the existing registration
                }}
                >
                Verify
              </Button>
            </Body>
          )}
        </Content>
      </Column>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  gap: 1rem;
`;

const Column = styled.div`
  gap: 1rem;
  align-self: flex-start;
  border-radius: 16px;
  justify-content: center;
`;

const TitleRow = styled(RowBetween)`
  margin-bottom: 20px;
  height: 50px;
  align-items: flex-end;
  color: #FFF;
  padding: 0 1rem;

  @media (max-width: 600px) {
    flex-wrap: wrap;
    gap: 12px;
    width: 100%;
  };
`;

const Content = styled.main`
  display: flex;
  background-color: #0D111C;
  border: 1px solid #98a1c03d;
  border-radius: 16px;
  flex-direction: column;
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04),
    0px 24px 32px rgba(0, 0, 0, 0.01);
  overflow: hidden;
`;

const ErrorContainer = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: auto;
  padding: 36px 0px;
  max-width: 340px;
  min-height: 25vh;
  gap: 36px;
`

const IconStyle = css`
  width: 48px;
  height: 48px;
  margin-bottom: 0.5rem;
`

const CheckCircleIcon = styled(CheckCircle)`
  ${IconStyle}
`

const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 1.5rem;
  background-color: #0D111C;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const NumberedInputContainer = styled(Col)`
  gap: 1rem;
`;
