const stores = [
  {
    id: 58579768,
    name: "First Team Honda Chesapeake",
  },
  {
    id: 183521467,
    name: "First Team Kia Suffolk",
  },
  {
    id: 183528037,
    name: "First Team Subaru Suffolk",
  },
  {
    id: 58582481,
    name: "First Team Toyota",
  },
  {
    id: 183527321,
    name: "Hampton Chevrolet",
  },
  {
    id: 245604812,
    name: "First Team Subaru Norfolk",
  },
  {
    id: 221119799,
    name: "Suntrup Ford Westport",
  },
];

export function getStore(id: number) {
  const storesData = stores.filter((e) => {
    return e.id === id;
  });
  return storesData;
}
