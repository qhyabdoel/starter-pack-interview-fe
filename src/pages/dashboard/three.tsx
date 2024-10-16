import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { NoteListView } from 'src/sections/dashboard/notes/list';

// ----------------------------------------------------------------------

const metadata = { title: `Page one | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <NoteListView title="Notes" />
    </>
  );
}
