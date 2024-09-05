import Sidebar from '@/components/Sidebar';
import { ContractProvider } from '@/contexts/ContractContext';

const Layout = ({ children }) => {
  return (
    <ContractProvider>
      <div className="flex">
        <Sidebar />
        <main className="flex-1 ml-16 p-4">
          {children}
        </main>
      </div>
    </ContractProvider>
  );
};

export default Layout;