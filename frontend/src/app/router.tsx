import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppShell } from './layout/AppShell';
import { NotFoundPage } from './pages/NotFoundPage';
import { ItemsPage } from '../features/items/pages/ItemsPage';
import { NewInvoicePage } from '../features/invoices/pages/NewInvoicePage';
import { InvoiceHistoryPage } from '../features/invoices/pages/InvoiceHistoryPage';

export const appRouter = createBrowserRouter([
	{
		path: "/",
		element: <AppShell />,
		children: [
			{
				index: true,
				element: <Navigate to="/items" replace />,
			},
			{
				path: "items",
				element: <ItemsPage />,
			},
			{
				path: "invoices/new",
				element: <NewInvoicePage />,
			},
			{
				path: "invoices/history",
				element: <InvoiceHistoryPage />,
			},
		],
	},
	{
		path: "*",
		element: <NotFoundPage />,
	},
]);
