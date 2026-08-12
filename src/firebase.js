import { initializeApp } from 'firebase/app'
import { getFirestore, collection, addDoc, getDocs, serverTimestamp } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
}

export const hasFirebase = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId)

let app, db, storage
if (hasFirebase) {
  app = initializeApp(firebaseConfig)
  db = getFirestore(app)
  storage = getStorage(app)
}

export { app, db, storage }

export async function submitOrder(order) {
  if (!hasFirebase) {
    console.warn('[Viqor] Firebase not configured. Order saved to localStorage only.')
    const local = JSON.parse(localStorage.getItem('viqor_orders') || '[]')
    const withId = { ...order, id: `LOCAL-${Date.now()}`, createdAt: new Date().toISOString() }
    local.push(withId)
    localStorage.setItem('viqor_orders', JSON.stringify(local))
    return withId.id
  }
  const ref = await addDoc(collection(db, 'orders'), { ...order, status: 'new', createdAt: serverTimestamp() })
  return ref.id
}

export async function fetchProducts() {
  if (!hasFirebase) return null
  const snap = await getDocs(collection(db, 'products'))
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}
