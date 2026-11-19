'use client';

import { useEffect } from 'react';

export default function OrbeJobsRedirectPage() {
  useEffect(() => {
    window.location.replace('https://www.orbesystems.com.br/orbejobs');
  }, []);

  return (
    <div className="min-h-screen bg-[#070403] text-white flex flex-col items-center justify-center p-6 text-center">
      <p className="text-sm font-bold text-[#FFB380]">
        Redirecionando para o OrbeJobs no Portal Oficial da Orbe Systems (https://www.orbesystems.com.br/orbejobs)...
      </p>
    </div>
  );
}
