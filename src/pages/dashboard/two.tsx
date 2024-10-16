import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { ProductListView } from 'src/sections/dashboard/products/list';

// ----------------------------------------------------------------------

const metadata = { title: `Page two | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <ProductListView title="Produts" />
    </>
  );
}
