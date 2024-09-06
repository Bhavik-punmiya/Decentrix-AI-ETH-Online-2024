import Sidebar from '@/components/Sidebar';
import { ContractProvider } from '@/contexts/ContractContext';

const Layout = ({ children }) => {
  return (
    <ContractProvider>
      <div className="flex">
        <Sidebar />
        <main className="flex-1 ml-16 p-4">
            <div className="h-full flex justify-center items-center text-5xl font-bold py-24">
                Coming soon !
            </div>        </main>
      </div>
    </ContractProvider>
  );
};

export default Layout;