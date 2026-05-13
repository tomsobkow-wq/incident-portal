import { useState, useEffect } from 'react';
import { Sidebar, TopBar, Dashboard } from './components/Dashboard.jsx';
import { InvestigationView } from './components/Investigation.jsx';

export default function App() {
  const [route, setRoute] = useState(() => {
    try { return JSON.parse(localStorage.getItem('iip-route') || '"dashboard"'); } catch { return 'dashboard'; }
  });
  const [openInc, setOpenInc] = useState(() => {
    try { return JSON.parse(localStorage.getItem('iip-openInc') || 'null'); } catch { return null; }
  });

  useEffect(() => {
    localStorage.setItem('iip-route', JSON.stringify(route));
    localStorage.setItem('iip-openInc', JSON.stringify(openInc));
  }, [route, openInc]);

  const openInvestigation = inc => {
    setOpenInc(inc);
    setRoute('investigation');
  };

  const goBack = () => {
    setOpenInc(null);
    setRoute('dashboard');
  };

  if (route === 'investigation' && openInc) {
    return (
      <div className="app" data-theme="dark">
        <Sidebar route={route} setRoute={r => { if (r === 'dashboard') goBack(); else setRoute(r); }} />
        <div className="main">
          <TopBar crumbs={['Investigations', openInc.id]} actions={[]} />
          <InvestigationView inc={openInc} onBack={goBack} />
        </div>
      </div>
    );
  }

  return (
    <div className="app" data-theme="dark">
      <Sidebar route={route} setRoute={setRoute} />
      <div className="main">
        <TopBar crumbs={['Investigations overview']} actions={[]} />
        <Dashboard onOpen={openInvestigation} />
      </div>
    </div>
  );
}
