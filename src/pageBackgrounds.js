// Each "function" (Home, Map, Detail, Top, Rewards, Planner, dashboards) gets
// its own small pool of real Qashqadaryo photos so the ambient backdrop keeps
// changing both when you switch functions and while you stay on one — instead
// of the flat #F5F7F5 void that used to sit behind everything past the Home hero.
export const VIEW_BACKGROUND_POOLS = {
  home: ["/images/kitob-mountains.jpg", "/images/qashqadaryo-river.jpg"],
  map: ["/images/kitob-dovoni.jpg", "/images/kitob-mountains.jpg"],
  detail: ["/images/kitob-dovoni.jpg", "/images/aksaray-shahrisabz.jpg"],
  top: ["/images/aksaray-shahrisabz.jpg", "/images/qarshi-bridge.jpg"],
  rewards: ["/images/qarshi-bridge.jpg", "/images/qashqadaryo-osh.jpg"],
  planner: ["/images/qashqadaryo-osh.jpg", "/images/kitob-mountains.jpg"],
  business: ["/images/kitob-dovoni.jpg", "/images/qarshi-bridge.jpg"],
  gov: ["/images/aksaray-shahrisabz.jpg", "/images/kitob-mountains.jpg"],
};

export function poolFor(view) {
  return VIEW_BACKGROUND_POOLS[view] || VIEW_BACKGROUND_POOLS.home;
}
