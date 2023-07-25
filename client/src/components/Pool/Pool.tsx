
import { Inbox } from 'react-feather'
import styled, { css, useTheme } from 'styled-components/macro'

import { Button } from '../Button/Button'
import { AutoColumn } from '../Column'
import { RowBetween } from '../Row'
import { ThemedText } from '../../theme/text'


export default function Pool() {
  return (
      <PageWrapper>
        <Column>
          <TitleRow padding="0">
            <ThemedText.HeadlineMedium>
              Pool
            </ThemedText.HeadlineMedium>
            <Button>
              + New Position
            </Button>
          </TitleRow>

          <MainContentWrapper>
            <ErrorContainer>
              <ThemedText.DeprecatedBody textAlign="center">
              <InboxIcon strokeWidth={1} style={{ marginTop: '2em' }} />
              <div>
                Your active pool positions will appear here.
              </div>
              </ThemedText.DeprecatedBody>
              <Button>
                Connect a wallet
              </Button>
            </ErrorContainer>
          </MainContentWrapper>
        </Column>
      </PageWrapper>
  )
}

const PageWrapper = styled(AutoColumn)`
  padding-top: 8px;
  max-width: 800px;
  width: 100%;
`

const Column = styled.div`
  gap: 1rem;
  align-self: flex-start;
  padding: 1.5rem;
  border-radius: 4px;
  justify-content: center;
`;

const TitleRow = styled(RowBetween)`
  margin-bottom: 20px;

  color: #FFF;

  @media (max-width: 600px) {
    flex-wrap: wrap;
    gap: 12px;
    width: 100%;
  };
`;

const MainContentWrapper = styled.main`
  display: flex;
  background-color: #0D111C;
  border: 1px solid #98a1c03d;
  padding: 0; 
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
  max-width: 340px;
  min-height: 25vh;
  gap: 36px;
`

const IconStyle = css`
  width: 48px;
  height: 48px;
  margin-bottom: 0.5rem;
`

const InboxIcon = styled(Inbox)`
  ${IconStyle}
`
