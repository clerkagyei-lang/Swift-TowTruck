// This file is manually mapped to bypass the missing Replit environment plugin.
type ModuleMap = Record<string, () => Promise<Record<string, unknown>>>;
export const modules: ModuleMap = {
  'AdminDashboard': () => import('../App').then(m => m),
  'App': () => import('../App').then(m => m)
};
