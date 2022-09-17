import { AsyncLocalStorage } from "async_hooks";

export { startSession, getSessionItem, setSessionItem };

const session = new AsyncLocalStorage();

interface SessionStore {
  correlationId: string;
  requestId: string;
}

type Store = Map<SessionStoreKey, SessionStore[SessionStoreKey]>;
type SessionStoreKey = keyof SessionStore;

function startSession(fn: () => any) {
  session.run(new Map(), async () => {
    await fn();
  });
}

function setSessionItem<T extends SessionStoreKey = SessionStoreKey>(
  key: T,
  value: SessionStore[T]
) {
  return getStore().set(key, value);
}

function getSessionItem(key: SessionStoreKey) {
  return (getStore() || new Map()).get(key);
}

function getStore() {
  return session.getStore() as Store;
}
