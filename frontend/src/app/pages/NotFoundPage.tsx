import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="panel-surface w-full max-w-xl rounded-2xl p-6 lg:p-10">
        <Result
          status="404"
          title="Page not found"
          subTitle="The page you requested does not exist."
          extra={
            <Button type="primary" onClick={() => navigate('/items')}>
              Go to Inventory
            </Button>
          }
        />
      </div>
    </div>
  );
}
