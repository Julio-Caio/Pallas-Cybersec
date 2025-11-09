// Filtrar Banco de Dados por SGBD ex.: product:"mysql" hostname:"mit.edu"
export function getDatabases(sgbd, domain) {
  const query = `product:"${sgbd}" hostname:${domain}`;
  return query;
}

//Filtrar apenas por dispositivos abertos que compartilham screenshot:
export function getScreenshots(domain) {
  const query = `has_screenshot:true hostname:${domain}`;
  return query;
}

// SMB: ex.: product:samba "Authentication disabled"
export function getExposureSMB(domain)
{
    const query = `product:samba "Authentication disabled" hostname:${domain}`
    return query
}

// Filtrar por servidores FTP
// "Welcome, archive user anonymous" hostname:sbcglobal.net
export function getFTPServers(domain) {
  const query = `"Welcome, archive user anonymous" hostname:${domain}`;
  return query;
}