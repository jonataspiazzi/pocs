import tasklist from 'tasklist';

(async () => {
  const tasks = await tasklist({ verbose: true });
  console.log('count ', tasks.length);

  const statuses = tasks.reduce((ac, i) => ac.indexOf(i.status) < 0 ? [...ac, i.status] : ac, new Array<string>());
  console.log('statuses ', statuses);

  console.log(tasks.filter(t => /Visual Studio Code/g.test(t.windowTitle)));

})();