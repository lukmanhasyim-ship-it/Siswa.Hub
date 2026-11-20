import packageJson from '../../package.json?raw'

const GITHUB_OWNER = 'lukmanhasyim-ship-it'
const GITHUB_REPO = 'Siswa.Hub'
const GITHUB_API_URL = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}`

const UPDATE_CACHE_KEY = 'last_update_check'
const UPDATE_TTL = 6 * 60 * 60 * 1000
const ERROR_TTL = 10 * 60 * 1000

let cachedVersion = null
let inFlightCheck = null

export function getCurrentVersion() {
  if (cachedVersion) return cachedVersion
  try {
    const pkg = JSON.parse(packageJson)
    cachedVersion = pkg.version || '0.0.0'
  } catch {
    cachedVersion = '0.0.0'
  }
  return cachedVersion
}

function compareVersions(current, latest) {
  const curParts = current.split('.').map(Number)
  const latParts = latest.split('.').map(Number)

  for (let i = 0; i < Math.max(curParts.length, latParts.length); i++) {
    const cur = curParts[i] || 0
    const lat = latParts[i] || 0
    if (cur < lat) return -1
    if (cur > lat) return 1
  }
  return 0
}

function readCachedCheck() {
  try {
    const raw = localStorage.getItem(UPDATE_CACHE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed.checkedAt !== 'number') return null

    // Cache hasil pengecekan PASTI milik versi aplikasi yang sama.
    // Tanpa ini, setelah deploy versi baru hasil lama dipakai sampai TTL habis.
    if (!parsed.result || parsed.result.currentVersion !== getCurrentVersion()) return null

    const ttl = parsed.result?.error ? ERROR_TTL : UPDATE_TTL
    if (Date.now() - parsed.checkedAt > ttl) return null
    return parsed.result
  } catch {
    return null
  }
}

function writeCachedCheck(result) {
  try {
    localStorage.setItem(UPDATE_CACHE_KEY, JSON.stringify({ checkedAt: Date.now(), result }))
  } catch {
    // Abaikan kegagalan storage (private mode / quota penuh).
  }
}

function emptyResult(error) {
  return {
    hasUpdate: false,
    currentVersion: getCurrentVersion(),
    latestVersion: null,
    releaseNotes: null,
    releaseUrl: null,
    error,
  }
}

async function fetchLatestRelease() {
  try {
    const response = await fetch(`${GITHUB_API_URL}/releases/latest`, {
      headers: {
        Accept: 'application/vnd.github+json',
      },
    })

    if (!response.ok) {
      if (response.status === 404) return emptyResult('Belum ada release')
      if (response.status === 403) return emptyResult('Batas rate limit GitHub API tercapai')
      throw new Error(`HTTP ${response.status}`)
    }

    const release = await response.json()
    const latestVersion = release.tag_name?.replace(/^v/, '') || release.name || '0.0.0'
    const currentVersion = getCurrentVersion()

    return {
      hasUpdate: compareVersions(currentVersion, latestVersion) < 0,
      currentVersion,
      latestVersion,
      releaseNotes: release.body || null,
      releaseUrl: release.html_url,
      publishedAt: release.published_at,
      error: null,
    }
  } catch (err) {
    return emptyResult(err.message)
  }
}

export async function checkForUpdate({ force = false } = {}) {
  if (!force) {
    const cached = readCachedCheck()
    if (cached) return cached
  }

  if (inFlightCheck) return inFlightCheck

  inFlightCheck = fetchLatestRelease()
  try {
    const result = await inFlightCheck
    writeCachedCheck(result)
    return result
  } finally {
    inFlightCheck = null
  }
}
