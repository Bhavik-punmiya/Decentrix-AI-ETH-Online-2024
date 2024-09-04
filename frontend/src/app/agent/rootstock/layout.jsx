import Sidebar from '@/components/Sidebar';

const Layout = ({ children }) => {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 ml-28 p-4"> {/* Adjusted margin-left to match sidebar width */}
        {children}
      </main>
    </div>
  );
};

export default Layout;