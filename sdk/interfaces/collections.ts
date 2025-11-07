export const collections = {
    users: 'users',
  } as const;

export type CollectionsType = typeof collections[keyof typeof collections];
