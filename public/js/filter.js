const services = [
  "mysql",
  "postgresql",
  "apache",
  "mongodb",
  "redis",
  "tomcat",
  "aws elb",
];

const databases = ["mysql", "postgresql", "mongodb", "redis"];
const web_servers = ["nginx", "Microsoft IIS httpd", "Apache Tomcat/Coyote JSP engine", "Apache Tomcat", "Apache httpd" ]

console.log(services.filter((service) => databases.includes(service)));

const assets = [
  {
    name: "google.com",
    hostnames: ["google.com", "cloudflare.com"],
    ip: "1.1.1.1",
    ports: 80,
    services: "apache",
  },
  {
    name: "google.com",
    hostnames: ["google.com", "cloudflare.com"],
    ip: "2.2.2.2",
    ports: 3306,
    services: "mysql",
  },
  {
    name: "redis0.google.com",
    hostnames: ["redis0.google.com", "redis123.google.com"],
    ip: "3.3.3.3",
    ports: 6379,
    services: "redis",
  },
  { name: "google.com", ip: "5.5.5.5", ports: 6379, services: "redis" },
  { name: "redis1.google.com", ip: '6.6.6.6', ports: 6379, services: "redis" },
  { name: "mongo.google.com", ip: "4.4.4.4", ports: 2317, services: "mongodb" },
  { name: "ssh.google.com", ports: 22, services: "ssh" },
];



let assets_w_db = assets.filter((asset) => databases.includes(asset.services));
console.log(assets_w_db);
let assets_databases_ordenados = new Set()

assets.forEach((asset) => {
  databases.includes(asset.services)
    ? assets_databases_ordenados.add(asset.ip)
    : "none";
});

assets_databases_ordenados = [...assets_databases_ordenados]

console.log(`Banco de Dados: ${assets_databases_ordenados}`);

let assets_web_servers = new Set()

assets.forEach((asset) => {
  web_servers.includes(asset.services)
    ? assets_web_servers.add(asset.ip)
    : "none";
});

console.log(`Web servers: ${assets_web_servers}`)


const produtos = [
  "Microsoft Windows XP telnetd",
  "CCProxy telnet configuration",
  "ZyXEL ZyWALL USG 200 firewall telnetd",
  "Synchronet BBS",
  "Arris tm602g cable modem telnetd"
];

const filtrados = produtos.filter(p => p.toLowerCase().includes("telnetd"));

console.log(filtrados);