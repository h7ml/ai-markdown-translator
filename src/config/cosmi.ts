import { cosmiconfigSync } from 'cosmiconfig';

const SHORT_NAME = 'amdt';

export const cosmi = () => {
  const explorerSync = cosmiconfigSync(SHORT_NAME);
  const searched = explorerSync.search();

  if (!searched) return null;

  const loaded = explorerSync.load('.');

  return loaded?.config ?? null;
};
