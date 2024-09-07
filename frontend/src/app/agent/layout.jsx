import SecondaryNavbar from "@/components/SecondaryNavbar";

const Layout = ({ children }) => {
    return (
          <main>
              <SecondaryNavbar />
              {children}
          </main>
    );
};

export default Layout;