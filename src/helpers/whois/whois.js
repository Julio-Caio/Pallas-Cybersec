import whois from 'whois-json'

export async function whoisQuery(domain)
{
  let domainInfo = await whois(domain)
  return domainInfo
}