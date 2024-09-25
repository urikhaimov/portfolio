/**
 * Import firebase
 * @type {{initializeApp}}
 */
import { initializeApp } from 'firebase/app';

import {
  getAuth,
  signOut,
  GoogleAuthProvider,
  FacebookAuthProvider,
  TwitterAuthProvider,
  GithubAuthProvider,
  EmailAuthProvider,
  isSignInWithEmailLink,
  signInWithEmailLink,
  getAdditionalUserInfo
} from 'firebase/auth';

import {
  getFirestore,
  addDoc,
  doc,
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit,
  setDoc,
  updateDoc,
  getDoc
} from 'firebase/firestore';

import { getAnalytics, logEvent } from 'firebase/analytics';

import { firebaseConfig } from '@/services/config/firebase.config';
import { networkConnection } from '@/services/common.service';

import {
  apiError,
  errorDeleteMsg,
  errorGetMsg,
  errorSaveMsg,
  errorUpdateMsg,
  successDeleteMsg,
  successSaveMsg,
  successUpdateMsg
} from '@/utils/message';
import { logger } from '@/utils/console';

const firebaseApp = initializeApp(firebaseConfig);

// Initialize Analytics and get a reference to the service
export const analytics = getAnalytics(firebaseApp);

export const analyticsLogEvent = ({ analyticsEventName }) => logEvent(
    analytics,
    analyticsEventName
);

const db = getFirestore(firebaseApp);

/**
 * @export
 * @constant
 */
export const firebaseAppAuth = getAuth(firebaseApp);

/**
 * See the signature above to find out the available providers.
 * @export
 * @param {string} provider
 * @param firebase
 * @return {*}
 */
export const providers = {
  googleProvider: new GoogleAuthProvider(),
  facebookProvider: new FacebookAuthProvider(),
  twitterProvider: new TwitterAuthProvider(),
  githubProvider: new GithubAuthProvider()
};

/**
 * @export
 * @param collectionPath
 * @param document
 * @return {*}
 */
export const getRef = ({ collectionPath, document }) => {
  if (document) {
    return doc(db, collectionPath, document);
  }

  throw new Error('Document must be defined.');
};

/**
 * @export
 * @return {Promise<boolean>}
 */
export const fbSignOut = async () => {
  return signOut(firebaseAppAuth).then(() => {
    // Sign-out successful.
    return true;
  }).catch((error) => {
    logger({ type: 'error', error });
    return false;
  });
};

/**
 * @export
 * @constant
 * @param {string} [collectionPath]
 * @return {boolean}
 */
export const isFbConnected = async ({ collectionPath = 'users' }) => {

  // const q = query(collection(db, collectionPath));
  // const querySnapshot = await getDocs(q);
  //
  // const _isCached = querySnapshot.metadata.fromCache;
  //
  // if (_isCached) {
  //   DEBUG && logger({ type: 'warn', log: `[FB] Cached connection` });
  // } else {
  //   DEBUG && logger({ type: 'log', log: `[FB] Successfully connected` });
  // }

  return true;
};

/**
 * Create firebase new collection
 * @export
 * @async
 * @param collectionPath
 * @param [data]
 * @param {boolean} [notice]
 */
export const fbAdd = async ({ collectionPath, data = {}, notice = true }) => {
  if (await networkConnection(collectionPath, notice, 'add')) {
    return addDoc(collection(db, collectionPath), data).then(async (docRef) => {
      notice && await successSaveMsg({ instance: collectionPath });
      return fbFindById({ collectionPath, docRef });
    }).catch(async error => {
      if (notice) {
        await errorSaveMsg({ instance: collectionPath });
      }
      console.error(`Write: ${collectionPath}`, error);
      return {error};
    });
  }
};

/**
 * @export
 * @param collectionPath
 * @param {string} docName
 * @param [data]
 * @param {boolean} [notice]
 * @return {Promise<{data: *, id: *}|void>}
 */
export const fbWrite = async (
    {
      collectionPath,
      docName,
      data = {},
      notice = true
    }) => {
  if (await networkConnection(collectionPath, notice, 'write')) {
    const docRef = getRef({ collectionPath, document: docName });

    return setDoc(docRef, data).then(async () => {
      notice && await successSaveMsg({ instance: collectionPath });
      return fbFindById({ collectionPath, docRef });
    }).catch(async error => {
      if (notice) {
        await errorSaveMsg({ instance: collectionPath });
      }
      console.error(`Write: ${collectionPath}\n`, error);
      return {error};
    });
  }
};

/**
 * Read all from collection
 * @export
 * @async
 * @param collectionPath
 * @param {boolean} [notice]
 */
export const fbReadAll = async ({ collectionPath, notice = true }) => {
  if (await networkConnection(collectionPath, notice, 'read all')) {
    return getDocs(collection(db, collectionPath)).catch(async (error) => {
      if (notice) {
        await errorGetMsg({ instance: collectionPath });
      }
      console.error(`All: ${collectionPath} \n`, error);
      return {error};
    });
  }
};

/**
 * @export
 * @async
 * @description Read from collection by reference.
 * @param colRef
 * @return {Promise<unknown>}
 */
export const fbReadByRef = async ({ colRef }) => {
  const snapshot = await getDoc(colRef);
  return snapshot.data();
};

/**
 * Read from collection by condition
 * @async
 * @export
 * @param collectionPath
 * @param field
 * @param [operator]
 * @param [optional]
 * @param value
 * @param {boolean} [notice]
 */
export const fbReadBy = async (
    {
      field,
      value,
      collectionPath,
      operator = '==',
      notice = true,
      optional = {}
    }) => {

  const { order, orderDirection = 'desc' } = optional;

  if (await networkConnection(collectionPath, notice, 'read')) {

    const queryParams = [
      collection(db, collectionPath),
      where(field, operator, value)
    ];

    if (order) {
      queryParams.push(orderBy(order, orderDirection));
    }

    if (optional?.limit) {
      queryParams.push(limit(optional.limit));
    }

    const q = query.apply(null, queryParams);

    return getDocs(q).catch(async error => {
      if (notice) {      
        await errorGetMsg({ instance: collectionPath });
      }
      
      console.error(error.message);
      return {error};
    });
  }
};

/**
 * @export
 * @param props
 * @return {Promise<DocumentSnapshot<unknown, DocumentData>>}
 */
export const fbFindById = async (props) => {
  const {
    docRef,
    collectionPath,
    docName,
    notice = true
  } = props;

  if (await networkConnection(collectionPath, notice, 'find')) {
    const _docRef = docRef ?? getRef({ collectionPath, document: docName });
    return getDoc(_docRef).catch(async error => {
      if (notice) {        
        await errorGetMsg({ instance: collectionPath });
      }
      
      console.error(error.message);
      return {error};
    });;
  }
};

/**
 * @async
 * @export
 * @param collectionPath
 * @param docs
 * @param value
 * @param notice
 * @return {Promise<unknown>}
 */
export const fbMultipleUpdate = async (
    {
      collectionPath,
      docs,
      value = {},
      notice = true
    }) => {
  if (await networkConnection(collectionPath, notice, 'multiple update')) {
    const docRefs = docs.map(document => getRef({ collectionPath, document }));
    return docRefs.length && db.runTransaction(transaction => {
      return transaction.get(docRefs[0]).then((sDoc) => {
        for (let docRef of docRefs) transaction.update(docRef, value);
        return value;
      });
    }).then(async (value) => {
      notice && await successUpdateMsg({ instance: collectionPath });
      return value;
    }).catch(async error => {
      if (notice) {
        console.error(error.message);
        await errorUpdateMsg({ instance: collectionPath });
      }
      console.error(`Multiple Update: ${collectionPath}\n`, error);
      return {error};
    });
  }
};

/**
 * Update collection
 * @async
 * @export
 * @param caller
 * @param collectionPath
 * @param docName
 * @param data
 * @param {boolean} [notice]
 */
export const fbUpdate = async (
    {
      caller,
      collectionPath,
      docName,
      data,
      notice = false
    }) => {

  DEBUG && console.info(caller, data);

  if (await networkConnection(collectionPath, notice, 'update')) {
    const docRef = getRef({ collectionPath, document: docName });

    return updateDoc(docRef, data).then(async () => {
      notice && await successUpdateMsg({ instance: collectionPath });
    }).catch(async error => {
      if (notice) {
        await errorUpdateMsg({ instance: collectionPath });
      }
      console.error(`Write: ${collectionPath}\n`, error);
      return {error};
    });
  }
};

/**
 * Delete collection
 * @async
 * @export
 * @param collectionPath
 * @param {string} docName
 * @param {boolean} [notice]
 */
export const fbDelete = async ({ collectionPath, docName, notice = true }) => {
  if (await networkConnection(collectionPath, notice, 'delete')) {
    const docRef = getRef({ collectionPath, document: docName });
    return docRef.delete().then(() => {
      notice && successDeleteMsg({ instance: collectionPath });
    }).catch(async error => {
      if (notice) {
        await errorDeleteMsg({ instance: collectionPath });
      }
      console.error(`Delete: ${collectionPath}\n`, error);
      return {error};
    });
  }
};

/**
 * @export
 * @param {string} email
 */
export const checkCredentialWithLink = ({ email }) =>
    EmailAuthProvider.credentialWithLink(email, window.location.href);

/**
 * @export
 * @param email
 * @return {Promise<void>}
 */
export const checkSignInWithEmailLink = async ({ email }) => {

  // Confirm the link is a sign-in with email link.
  if (isSignInWithEmailLink(firebaseAppAuth, window.location.href)) {

    // Additional state parameters can also be passed via URL.
    // This can be used to continue the user's intended action before triggering
    // the sign-in operation.
    // Get the email if available. This should be available if the user completes
    // the flow on the same device where they started it.

    if (!email) {

      // User opened the link on a different device. To prevent session fixation
      // attacks, ask the user to provide the associated email again. For example:
      return apiError({
        error: {
          name: 'Invalid email',
          message: 'Please provide your email for confirmation'
        }
      });
    }

    // The client SDK will parse the code from the link for you.
    return signInWithEmailLink(firebaseAppAuth, email, window.location.href).then((result) => {

      // You can access the new user by importing getAdditionalUserInfo
      // and calling it with result:
      return result;

    }).catch(async (error) => {

      // Some error occurred, you can inspect the code: error.code
      // Common errors could be invalid email and invalid or expired OTPs.
      await apiError({ error });

      return { error };
    });
  }
};

