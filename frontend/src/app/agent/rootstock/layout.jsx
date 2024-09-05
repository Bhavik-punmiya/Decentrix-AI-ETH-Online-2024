import SecondaryNavbar from "../../../components/SecondaryNavbar";

const Layout = ({ children }) => {
  return (
      <div className="">
        <SecondaryNavbar />
        <main className=" ">
          {children}
        </main>
      </div>
  );
};

export default Layout;