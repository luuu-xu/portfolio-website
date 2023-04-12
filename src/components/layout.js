import SideBar from "./sidebar";

export default function Layout({ children }) {
  return (
    <>
      <div className="mx-4 mt-4 md:mt-32 mb-20 max-w-4xl flex flex-col 
        md:flex-row md:justify-center md:gap-4 md:mx-auto
        "
      >
        <SideBar />
        <main className="w-full">{children}</main>
      </div>
      {/* <footer className="flex justify-center">
        Made by <Link href='https://github.com/luuu-xu'>luuu-xu</Link>
      </footer> */}
    </>
  );
}