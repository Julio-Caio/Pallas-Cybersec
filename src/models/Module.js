class UserAccount {
    id;
    name;
    email;
    provider;
    provider_id;
    created_at;

    // create user;
    // getUserByName;
    // getUserById;
    // deleteUserById;
}

class apiKey {
    id;
    apiKey;
    id_user;
    id_module;
    created_at;
    status; // true or false

    // createAPIKey(userId, key, module)
    // getAPIKeyById
    // getAPIKeyByUserId
    // updateAPIKey
    // deleteAPIKey
}

class Module {
    id;
    apiKeyId; // chave estrangeira da tabela api
    name;
    desc; // descrição da ferramenta

    constructor(id, name, apiKey, desc) { //props
        this.name = name,
        this.apiKey = null,
        this.desc = desc 
    }

    //methods
    // create module
    // getModuleById
    // deleteModuleById
    // search (domain)
    // enumerate (props, domain) # os systems, ports, technologies
    // count object_domain (props, domain)

}

class Domain {
    id;
    name;
    ip; // chave estrangeira referenciando ip
    nameserver;
    owner;
    created_at;
    update_at;

    constructor(id,name,ip,nameserver) {
        this.id = id,
        this.name = name,
        this.ip = ip,
        this.nameserver = nameserver,
        this.owner = null
    }

    // create domain entry (database)
    // update domain
    // getSubdomains (database)
    // getPortsbyIP(database)
    // getProductsbyIP(database)
    // getPublicIPs
}


class IPAddress {
    id;
    ip;
    isp;
    country;
    city;
    ports;
    services;

    constructor(id,ip_str,country,city,ports,services) {
        this.id = id,
        this.ip_str= ip_str,
        this.country = country,
        this.city = city,
        this.ports = ports,
        this.services = services
    }

    // methods
    // create asset
}

class Product {
    id;
    name;
    version;
}