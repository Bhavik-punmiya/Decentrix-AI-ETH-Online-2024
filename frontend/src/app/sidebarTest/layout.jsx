
import Sidebar from '@/components/Sidebar';

const Layout = ({ children }) => {
  return (
    <div className="">
      <Sidebar />
      <main className="flex-1 p-4">{children}</main>
    </div>
  );
};

export default Layout;