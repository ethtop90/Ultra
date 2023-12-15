import React, { useEffect, useState } from 'react';
import styled, { css } from 'styled-components/macro'
import { Mail } from 'react-feather'

import { ThemedText } from '../../theme/text';
import { Button } from '../Button';
import { AccessoryButton } from '@components/common/AccessoryButton';
import { TextButton } from '@components/common/TextButton';
import googleButtonSvg from '../../assets/images/google_dark_button.svg';
import {
  fetchEmailsRaw,
  fetchEmailList,
  RawEmailResponse
} from '@hooks/useGmailClient';
import useGoogleAuth from '@hooks/useGoogleAuth';
import useProofGenSettings from '@hooks/useProofGenSettings';
import { MailRow } from './MailRow';
import { EmailInputStatus } from  "../ProofGen/types";
import { PaymentPlatformType, PaymentPlatform } from '../../contexts/common/PlatformSettings/types';
import { platformStrings } from "@helpers/strings";
import { VENMO_EMAIL_FILTER, HDFC_EMAIL_FULTER } from '@helpers/constants';
import Link from '@mui/material/Link';
import { Inbox } from 'react-feather';


interface MailTableProps {
  paymentPlatform: PaymentPlatformType;
  setEmailFull: (emailFull: string) => void;
  handleVerifyEmailClicked: () => void;
  emailInputStatus: string;
  isProofModalOpen: boolean;
}

export const MailTable: React.FC<MailTableProps> = ({
  paymentPlatform,
  setEmailFull,
  handleVerifyEmailClicked,
  emailInputStatus,
  isProofModalOpen
}) => {
  /*
   * Context
   */

  const {
    googleAuthToken,
    isGoogleAuthed,
    loggedInGmail,
    scopesApproved,
    googleLogIn,
    googleLogOut,
  } = useGoogleAuth();

  const { setIsEmailModeAuth } = useProofGenSettings();

  /*
   * State
   */

  const [fetchedEmails, setFetchedEmails] = useState<RawEmailResponse[]>([]);

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const [ctaButtonTitle, setCtaButtonTitle] = useState<string>("");

  /*
   * Handlers
   */

  const handleRowClick = (index: number) => {
    setSelectedIndex(index);

    const email = fetchedEmails[index];

    setEmailFull(email.decodedContents);
  };

  const handleEmailModeChanged = (checked: boolean) => {
    if (setIsEmailModeAuth) {
      setIsEmailModeAuth(checked);
    }
  };

  /*
   * Helpers
   */

  function formatDateTime(unixTimestamp: string): string {
    const date = new Date(Number(unixTimestamp));
    const now = new Date();

    const isToday = date.getDate() === now.getDate() &&
                    date.getMonth() === now.getMonth() &&
                    date.getFullYear() === now.getFullYear();

    if (isToday) {
      return date.toLocaleTimeString(undefined, {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    } else {
      return date.toLocaleDateString(undefined, {
        month: 'numeric',
        day: 'numeric'
      });
    }
  }

  const rowPlatformText = () => {
   switch (paymentPlatform) {
      case PaymentPlatform.VENMO:
        return 'Venmo';

      case PaymentPlatform.HDFC:
        return 'HDFC';

      default:
        return '';
    } 
  }

  const rowSubjectText = (rawEmail: RawEmailResponse) => {
    switch (paymentPlatform) {
      case PaymentPlatform.VENMO:
        return rawEmail.subject;

      case PaymentPlatform.HDFC:
        const parsedAmountRegex = /Rs\.(\d+\.\d+)/;
        const parsedRecipientRegex = /to VPA (\S+?@\S+?) /;

        const parsedAmountMatch = rawEmail.decodedContents.match(parsedAmountRegex);
        const parsedRecipientMatch = rawEmail.decodedContents.match(parsedRecipientRegex);

        const parsedAmount = parsedAmountMatch ? parsedAmountMatch[1] : "Amount not found";
        const parsedRecipient = parsedRecipientMatch ? parsedRecipientMatch[1] : "Recipient not found";

        return `You have done a UPI txn (${parsedRecipient}: ₹${parsedAmount})`;

      default:
        return '';
    }
  }

  async function fetchData() {
    const filter = paymentPlatform === PaymentPlatform.VENMO ? VENMO_EMAIL_FILTER : HDFC_EMAIL_FULTER;

    try {
      const emailListResponse = await fetchEmailList(googleAuthToken.access_token, {
        'q': filter
      });

      const emailResponseMessages = emailListResponse.messages;
      if (emailResponseMessages?.length > 0) {
        const emailIds = emailResponseMessages.map(message => message.id);
        const emails = await fetchEmailsRaw(googleAuthToken.access_token, emailIds);

        setFetchedEmails(emails);
      } else {
        setFetchedEmails([]);
      }
    } catch (error) {
      console.error('Error in fetching data:', error);
    }
  };

  /*
   * Hooks
   */

  useEffect(() => {
    if (googleAuthToken && scopesApproved) {
      fetchData();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scopesApproved]);

  useEffect(() => {
    setSelectedIndex(null);
    setEmailFull('');

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchedEmails]);

  useEffect(() => {
    switch (emailInputStatus) {
      case EmailInputStatus.DEFAULT:
        setCtaButtonTitle("Select Email");
        break;
      
      case EmailInputStatus.INVALID_SIGNATURE:
      setCtaButtonTitle("Invalid email: must be from Venmo");
      break;

    case EmailInputStatus.INVALID_SUBJECT:
      setCtaButtonTitle("Invalid email: must contain 'You Paid'");
      break;

    case EmailInputStatus.INVALID_DOMAIN_KEY:
      setCtaButtonTitle("Invalid email: must be from 2023");
      break;

    case EmailInputStatus.VALID:
      default:
        setCtaButtonTitle("Validate Email");
        break;
    }

  }, [emailInputStatus]);

  /*
   * Component
   */

  return (
    <Container>
      {!isGoogleAuthed ? (
        <ErrorContainer>
          <ThemedText.DeprecatedBody textAlign="center">
            <MailIcon strokeWidth={1} style={{ marginTop: '2em' }} />

            <div>
             { platformStrings.getForPlatform(paymentPlatform, 'SIGN_IN_WITH_GOOGLE_INSTRUCTIONS') }
              <Link
                href="https://docs.zkp2p.xyz/zkp2p/user-guides/on-ramping/privacy-and-safety"
                target="_blank"
              >
                Privacy and Safety ↗
              </Link>
            </div>
          </ThemedText.DeprecatedBody>

          <LoginOrUploadButtonContainer>
            <Button
              onClick={googleLogIn}
              height={48}
              svg={googleButtonSvg}
            >
              Sign in with Google
            </Button>

            <TextButton
              onClick={() => handleEmailModeChanged(false)}
              height={24}
              title={'Or Upload'}
            />
          </LoginOrUploadButtonContainer>
        </ErrorContainer>
      ) : (
        <LoggedInContainer>
          <TitleContainer>
            <ThemedText.SubHeader textAlign="left">
              Google Mail
            </ThemedText.SubHeader>

            <AccessoryButton
              onClick={googleLogOut}
              height={36}
              title={'Logout'}
              icon={'logout'}
            />
          </TitleContainer>

          <TitleAndTableContainer>
            <TitleAndOAuthContainer>
              <EmailAddressTitle>
                <EmailLabel>
                  <EmailLabelTitle>Logged in as:&nbsp;</EmailLabelTitle>
                  <EmailLabelValue>{loggedInGmail}</EmailLabelValue>
                </EmailLabel>
              </EmailAddressTitle>


              <AccessoryButton
                onClick={fetchData}
                height={36}
                title={'Refresh'}
                icon={'refresh'}
              />
            </TitleAndOAuthContainer>

            {fetchedEmails.length === 0 ? (
              <EmptyMailContainer>
                <StyledInbox />
                <ThemedText.LabelSmall textAlign="center" lineHeight={1.3}>
                  { platformStrings.getForPlatform(paymentPlatform, 'NO_EMAILS_ERROR') }
                </ThemedText.LabelSmall>
              </EmptyMailContainer>
            ) : (
              <Table>
                {fetchedEmails.map((email, index) => (
                  <MailRow
                    key={index}
                    platformText={rowPlatformText()}
                    subjectText={rowSubjectText(email)}
                    dateText={formatDateTime(email.internalDate)}
                    isSelected={index === selectedIndex}
                    isLastRow={index === fetchedEmails.length - 1}
                    onRowClick={() => handleRowClick(index)}
                  />
                ))}
              </Table>
            )}
          </TitleAndTableContainer>

          <ButtonContainer>
            <Button
              disabled={emailInputStatus !== EmailInputStatus.VALID}
              loading={isProofModalOpen}
              onClick={handleVerifyEmailClicked}
            >
              {ctaButtonTitle}
            </Button>
          </ButtonContainer>
        </LoggedInContainer>
      )}
    </Container>
  )
}

const EmptyMailContainer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 4rem 0rem;
  max-width: 75%;
  margin: auto;
  gap: 1rem;
`;

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-self: flex-start;
  justify-content: center;

  background-color: #0D111C;
  border: 1px solid #98a1c03d;
  border-radius: 16px;
  overflow: hidden;
`;

const ErrorContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  margin: auto;
  padding: 36px;
  max-width: 50vh;
  min-height: 25vh;
  line-height: 1.3;
  gap: 36px;
`;

const IconStyle = css`
  width: 48px;
  height: 48px;
  margin-bottom: 0.5rem;
`;

const MailIcon = styled(Mail)`
  ${IconStyle}
`;

const LoggedInContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem;
`;

const TitleContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;
  padding: 0px 1rem;
`;

const TitleAndTableContainer = styled.div`
  border: 1px solid #98a1c03d;
  border-radius: 8px;
  background-color: #090D14;
`;

const TitleAndOAuthContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #98a1c03d;
  padding: 1rem 1.5rem;
`;

const EmailAddressTitle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const EmailLabel = styled.label`
  display: flex;
  font-size: 14px;
  color: #FFFFFF;
  align-items: center;
`;

const EmailLabelTitle = styled.span`
  font-size: 14px;
  color: #6C757D;
`;

const EmailLabelValue = styled.span`
  font-size: 14px;
  color: #FFFFFF;
`;

const Table = styled.div`
  width: 100%;
  box-shadow: 0px 2px 12px 0px rgba(0, 0, 0, 0.25);
  color: #616161;
`;

const ButtonContainer = styled.div`
  display: grid;
  padding-top: 1rem;
`;

const LoginOrUploadButtonContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  margin: auto;
  gap: 1rem;
`;

const StyledInbox = styled(Inbox)`
  color: #FFF;
`
