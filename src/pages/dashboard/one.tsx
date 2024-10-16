import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { TaskListView } from 'src/sections/dashboard/tasks/list';

// ----------------------------------------------------------------------

const metadata = { title: `Page one | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <TaskListView title="Tasks" />
    </>
  );
}
