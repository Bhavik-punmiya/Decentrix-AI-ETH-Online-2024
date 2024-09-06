// src/lib/contractService.js
import { db, storage } from '@/lib/firebaseConfig';
import { collection, doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadString } from "firebase/storage";

const saveContractData = async (contractData, userId) => {
    try {
        // Reference to the user's document
        const userDocRef = doc(db, "users", userId);

        // Get the current user document
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
            // User document exists, update it
            const userData = userDoc.data();
            const contracts = userData.contracts || [];
            contracts.push(contractData);

            await updateDoc(userDocRef, { contracts });
        } else {
            // User document doesn't exist, create it
            await setDoc(userDocRef, { contracts: [contractData] });
        }

        console.log("Contract data saved for user: ", userId);
    } catch (e) {
        console.error("Error saving contract data: ", e);
        throw e;
    }
};

const saveSolidityCode = async (solidityCode, fileName) => {
    try {
        const storageRef = ref(storage, `solidity/${fileName}`);
        await uploadString(storageRef, solidityCode, 'raw', { contentType: 'text/plain' });
        console.log("Solidity code uploaded successfully.");
        return storageRef.fullPath;
    } catch (error) {
        console.error("Error uploading Solidity code: ", error);
        throw error;
    }
};


const getContractsForUser = async (userId) => {
    try {
        const userDocRef = doc(db, "users", userId);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
            const userData = userDoc.data();
            return userData.contracts || [];
        } else {
            console.log("No contracts found for user: ", userId);
            return [];
        }
    } catch (error) {
        console.error("Error fetching user contracts: ", error);
        throw error;
    }
};

export { saveContractData, saveSolidityCode, getContractsForUser };