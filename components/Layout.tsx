import SiteHeader from './SiteHeader';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4">{children}</main>
    </>
  );
}
