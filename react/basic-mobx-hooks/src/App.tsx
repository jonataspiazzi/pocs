import React, { FunctionComponent, useContext, createContext, useState, FormEvent } from 'react';
import { useLocalObservable, Observer } from 'mobx-react';
import { makeAutoObservable } from 'mobx';
import './App.css';

class BugsStore {
  bugs: string[];

  constructor() {
    this.bugs = [];
  }

  addBug(bug: string) {
    this.bugs.push(bug);
  }

  get bugsCount() {
    return this.bugs.length;
  }
}

const BugsContext = createContext<BugsStore>(null);

const StoreProvider: FunctionComponent = ({ children }) => {
  const store = useLocalObservable(() => {
    const bugsStore = new BugsStore();
    makeAutoObservable(bugsStore);
    return bugsStore;
  });

  return <BugsContext.Provider value={store}>{children}</BugsContext.Provider>;
}

const BugsHeader = () => {
  const store = useContext(BugsContext);

  return <Observer>
    {() => (
      <h1>{store.bugsCount} Bugs!</h1>
    )}
  </Observer>;
}

const BugsList = () => {
  const store = useContext(BugsContext);

  return <Observer>
    {() => (
      <ul>
        {store.bugs.map(bug => (
          <li key={bug}>{bug}</li>
        ))}
      </ul>
    )}
  </Observer>;
}

const BugsForm = () => {
  const store = useContext(BugsContext);
  const [bug, setBug] = useState('');

  function submit(e: FormEvent) {
    store.addBug(bug);
    setBug('');
    e.preventDefault();
  }

  return (
    <form onSubmit={submit}>
      <input type="text" value={bug} onChange={e => setBug(e.target.value)} />
      <button type="submit">Add</button>
    </form>
  )
}

function App() {
  return (
    <StoreProvider>
      <div className="App">
        <BugsHeader />
        <BugsList />
        <BugsForm />
      </div>
    </StoreProvider>
  );
}

export default App;
