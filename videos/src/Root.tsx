import React from 'react';
import { Composition } from 'remotion';
import { WhatsAppChat } from './WhatsAppChat';
import {
  housingScraperMessages,
  paymentReminderMessages,
  dataAssistantMessages,
} from './demos';

const FPS = 30;

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="HousingScraperDemo"
        component={WhatsAppChat}
        durationInFrames={480}
        fps={FPS}
        width={1080}
        height={1920}
        defaultProps={{
          contactName: 'Tumai Housing Bot',
          messages: housingScraperMessages,
          subtitle: 'AI Agent · online',
          bgColor: '#0f172a',
          label: 'Housing Scraper Agent',
        }}
      />

      <Composition
        id="PaymentReminderDemo"
        component={WhatsAppChat}
        durationInFrames={420}
        fps={FPS}
        width={1080}
        height={1920}
        defaultProps={{
          contactName: 'Tumai Payments',
          messages: paymentReminderMessages,
          subtitle: 'AI Agent · online',
          bgColor: '#0c1220',
          label: 'Payment Reminder Agent',
        }}
      />

      <Composition
        id="DataAssistantDemo"
        component={WhatsAppChat}
        durationInFrames={520}
        fps={FPS}
        width={1080}
        height={1920}
        defaultProps={{
          contactName: 'Tumai Assistant',
          messages: dataAssistantMessages,
          subtitle: 'AI Agent · online',
          bgColor: '#10121a',
          label: 'AI Data Assistant',
        }}
      />
    </>
  );
};
