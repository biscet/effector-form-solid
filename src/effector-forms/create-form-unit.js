import { createStore, createEvent } from 'effector';

function store({ init, domain, existing }, effectorData) {
  if (existing) {
    return existing;
  }

  return domain
    ? domain.createStore(init, effectorData)
    : createStore(init, effectorData);
}

function event({ domain, existing }) {
  if (existing) {
    return existing;
  }

  return domain ? domain.createEvent() : createEvent();
}

export const createFormUnit = {
  store,
  event
};
