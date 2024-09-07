import Sidebar from '@/components/Sidebar';
import { ContractProvider } from '@/contexts/ContractContext';

const Layout = ({ children }) => {
  return (
      <ContractProvider>
          <div className="">
              {/* <Sidebar /> */}
              <div className="h-full flex w-full justify-center items-center text-5xl font-bold py-24">
                  Coming soon !
              </div>
          </div>
      </ContractProvider>
  );
};

export default Layout;