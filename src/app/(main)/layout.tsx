import { Navbar as NavbarDemo } from "@/components/navbar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NavbarDemo />
      {children}
    </>
  );
}
