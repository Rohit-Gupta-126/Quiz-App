export const openDB = async () => {
    return new Promise((resolve, reject) => {
        if (typeof window === 'undefined' || !('indexedDB' in window)) {
            reject('IndexedDB not supported');
            return;
        }

        const request = indexedDB.open('QuizApp', 1);

        request.onupgradeneeded = () => {
            const db = request.result;
            if (!db.objectStoreNames.contains('attempts')) {
                db.createObjectStore('attempts', { keyPath: 'id' });
            }
        };

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
};

export const saveAttempt = async (attempt) => {
    const db = await openDB();
    const tx = db.transaction('attempts', 'readwrite');
    const store = tx.objectStore('attempts');
    await store.put(attempt);
    await tx.done;
};

export const getAttempts = async () => {
    try {
        const db = await openDB();
        const tx = db.transaction("attempts", "readonly");
        const store = tx.objectStore("attempts");

        return new Promise((resolve, reject) => {
            const request = store.getAll();

            request.onsuccess = () => {
                console.log("Retrieved attempts:", request.result);
                resolve(request.result);
            };

            request.onerror = () => {
                console.error("Error fetching attempts:", request.error);
                reject(request.error);
            };
        });
    } catch (error) {
        console.error("Error fetching attempts:", error);
        return [];
    }
};