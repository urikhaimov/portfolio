import packageJson from '../package.json';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
require('dotenv').config();

const {
  env: {
    DEBUG = false,
    HOME_ENV = false,
    NODE_ENV = 'development',
    VERSION = packageJson.version,
    MAP_KEY,
    COUNTRY_KEY,
    // CLOUDINARY_CLOUD_NAME,
    // CLOUDINARY_UPLOAD_PRESET,
    FB_API_KEY,
    FB_AUTH_DOMAIN,
    FB_PROJECT_ID,
    FB_STORAGE_BUCKET,
    FB_MESSAGING_SENDER_ID,
    FB_APP_ID,
    FB_MEASUREMENT_ID
  },
  versions: {
    node: NODE_VERSION
  },
  arch: ARCH,
  platform: OS_PLATFORM
} = process;

const isDevelopment = NODE_ENV === 'development';

const envs = {
  DEBUG,
  HOME_ENV,
  NODE_ENV,
  NODE_VERSION,
  ARCH,
  OS_PLATFORM,
  VERSION,
  MAP_KEY,
  COUNTRY_KEY,
  // CLOUDINARY_CLOUD_NAME,
  // CLOUDINARY_UPLOAD_PRESET,
  FB_API_KEY,
  FB_AUTH_DOMAIN,
  FB_PROJECT_ID,
  FB_STORAGE_BUCKET,
  FB_MESSAGING_SENDER_ID,
  FB_APP_ID,
  FB_MEASUREMENT_ID
};

if (isDevelopment) {
  console.log('\n\n==== ENV =====\n');
  console.log(JSON.stringify(envs, null, 2));
  console.log('\n==== /ENV =====\n\n');
}

export default envs;