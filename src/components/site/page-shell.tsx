import {Footer} from "./footer";
import {Header} from "./header";

export function PageShell({children}: {children: React.ReactNode}) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
