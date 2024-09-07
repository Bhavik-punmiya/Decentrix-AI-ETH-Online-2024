import Sidebar from '@/components/Sidebar';
import { ContractProvider } from '@/contexts/ContractContext';

const Layout = ({ children }) => {
  return (
    <ContractProvider>
      <div className="">
        <Sidebar />
        <main className=" pl-16">
          {children}
        </main>
      </div>
    </ContractProvider>
  );
};

export default Layout;