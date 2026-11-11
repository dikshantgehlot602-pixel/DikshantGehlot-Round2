const ONEDRIVE_HOSTS = ['onedrive.live.com', '1drv.ms', 'onedrive.com', 'sharepoint.com'];

export function isValidOneDriveLink(value) {
  let url;
  try {
    url = new URL(value);
  } catch {
    return false;
  }
  if (url.protocol !== 'https:') return false;
  const host = url.hostname.toLowerCase();
  return ONEDRIVE_HOSTS.some((allowed) => host === allowed || host.endsWith(`.${allowed}`));
}
