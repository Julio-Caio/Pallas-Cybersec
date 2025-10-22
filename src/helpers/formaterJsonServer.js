import fs from 'fs';

const data = JSON.parse(fs.readFileSync('../db/shodan.json', 'utf8'));

const transform = (key) => {
  if (Array.isArray(data[key])) {
    data[key] = data[key].map((item, i) =>
      typeof item === 'object' ? item : { id: i + 1, value: item }
    );
  }
};

Object.keys(data).forEach(transform);

fs.writeFileSync('db.json', JSON.stringify(data, null, 2));
console.log('Arquivo convertido com sucesso!');