import React, { useEffect } from "react";
import { db } from "../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

const TestFirestore: React.FC = () => {
  useEffect(() => {
    async function fetchProducts() {
      try {
        console.log("Testing Firestore access...");

        const snapshot = await getDocs(collection(db, "products"));

        if (snapshot.empty) {
          console.log("No products found.");
          return;
        }

        snapshot.forEach((doc) => {
          console.log(`Product ID: ${doc.id}`, doc.data());
        });

        console.log("Firestore access test completed.");
      } catch (error) {
        console.error("Firestore Access Error:", error);
      }
    }

    fetchProducts();
  }, []);

  return <h1>Check the console for Firestore test results</h1>;
};

export default TestFirestore;
