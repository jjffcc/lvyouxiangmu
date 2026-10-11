const TRIPS_STORAGE_PREFIX = "tujian:trips:";

export function readAccountTrips(accountId) {
  const saved = localStorage.getItem(`${TRIPS_STORAGE_PREFIX}${accountId}`);
  return saved ? JSON.parse(saved) : [];
}

export function saveAccountTrips(accountId, trips) {
  localStorage.setItem(`${TRIPS_STORAGE_PREFIX}${accountId}`, JSON.stringify(trips));
}
