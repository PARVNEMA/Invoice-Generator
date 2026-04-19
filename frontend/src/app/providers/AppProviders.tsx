import { ConfigProvider, theme } from 'antd';
import type { PropsWithChildren } from 'react';

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: '#1f6feb',
          colorInfo: '#1f6feb',
          colorSuccess: '#1b9c6a',
          colorWarning: '#d67b00',
          colorError: '#cf2c3a',
          borderRadius: 12,
          borderRadiusLG: 16,
          fontFamily:
            '"Manrope", "Avenir Next", "Segoe UI Variable", "Segoe UI", sans-serif',
        },
        components: {
          Layout: {
            bodyBg: 'transparent',
            headerBg: 'transparent',
            siderBg: 'transparent',
          },
          Table: {
            headerBg: '#f7f9fc',
          },
          Card: {
            headerBg: '#ffffff',
          },
          Drawer: {
            colorBgElevated: '#ffffff',
          },
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
}
