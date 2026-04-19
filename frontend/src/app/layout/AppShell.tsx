import { Layout, Typography } from 'antd';
import { NavLink, Outlet } from 'react-router-dom';

const { Sider, Content } = Layout;
const { Title, Text } = Typography;

export function AppShell() {
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `block rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
      isActive
        ? 'bg-slate-900 text-white shadow-[0_8px_24px_rgba(15,23,42,0.22)]'
        : 'text-slate-600 hover:bg-white hover:text-slate-900'
    }`;

  return (
		<Layout className="min-h-screen bg-transparent">
			<Sider
				breakpoint="lg"
				collapsedWidth={0}
				width={260}
				className="bg-transparent! p-4! lg:p-6!"
			>
				<div className="panel-surface h-full rounded-2xl p-5 lg:p-6">
					<div className="mb-8">
						<Text className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500!">
							Invoice Generator
						</Text>
						<Title
							level={3}
							className="mb-0! mt-2! text-slate-900!"
						>
							Workspace
						</Title>
					</div>

					<nav className="space-y-2">
						<NavLink to="/items" className={navLinkClass}>
							Item & Inventory
						</NavLink>
						<NavLink
							to="/invoices/new"
							className={navLinkClass}
						>
							New Invoice
						</NavLink>
						<NavLink
							to="/invoices/history"
							className={navLinkClass}
						>
							Invoice History
						</NavLink>
					</nav>
				</div>
			</Sider>

			<Content className="p-4 lg:p-8">
				<div className="mx-auto w-full max-w-7xl">
					<Outlet />
				</div>
			</Content>
		</Layout>
	);
}
