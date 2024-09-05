import Sidebar from '@/components/Sidebar';
import { ContractProvider } from '@/contexts/ContractContext';

const Layout = ({ children }) => {
  return (
    <ContractProvider>
      <div className="">
        {/*<Sidebar />*/}
        <main className=" p-4">
          {children}
        </main>
      </div>
    </ContractProvider>
  );
};

export default Layout;