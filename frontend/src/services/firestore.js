import { doc, getDoc, setDoc, collection, addDoc, query, where, getDocs } from 'firebase/firestore'
import { db } from '../firebase'

// User Profile Operations
export const getUserProfile = async (userId) => {
	try {
		const docRef = doc(db, 'users', userId)
		const docSnap = await getDoc(docRef)
		
		if (docSnap.exists()) {
			return { success: true, data: docSnap.data() }
		} else {
			// Return default profile for new users
			return { 
				success: true, 
				data: { 
					onboarded: false,
					userId: userId
				} 
			}
		}
	} catch (error) {
		console.error('Error getting user profile:', error)
		return { success: false, error: error.message }
	}
}

export const saveUserProfile = async (userId, profileData) => {
	try {
		const docRef = doc(db, 'users', userId)
		await setDoc(docRef, {
			...profileData,
			userId: userId,
			onboarded: true,
			updatedAt: new Date().toISOString()
		}, { merge: true })
		
		return { success: true }
	} catch (error) {
		console.error('Error saving user profile:', error)
		return { success: false, error: error.message }
	}
}

// Transaction Operations
export const addTransaction = async (userId, transactionData) => {
	try {
		const transactionsRef = collection(db, 'transactions')
		const docRef = await addDoc(transactionsRef, {
			...transactionData,
			userId: userId,
			createdAt: new Date().toISOString()
		})
		
		return { success: true, id: docRef.id }
	} catch (error) {
		console.error('Error adding transaction:', error)
		return { success: false, error: error.message }
	}
}

export const getUserTransactions = async (userId, limit = 100) => {
	try {
		const transactionsRef = collection(db, 'transactions')
		const q = query(
			transactionsRef,
			where('userId', '==', userId)
		)
		
		const querySnapshot = await getDocs(q)
		const transactions = []
		querySnapshot.forEach((doc) => {
			transactions.push({ id: doc.id, ...doc.data() })
		})
		
		return { success: true, data: transactions }
	} catch (error) {
		console.error('Error getting transactions:', error)
		return { success: false, error: error.message }
	}
}

// Category Breakdown (calculate from transactions)
export const getCategoryBreakdown = async (userId) => {
	try {
		const result = await getUserTransactions(userId)
		if (!result.success) {
			return result
		}
		
		const transactions = result.data
		const categoryTotals = {}
		let totalSpend = 0
		
		transactions.forEach(transaction => {
			const category = transaction.category || 'Other'
			const amount = parseFloat(transaction.amount) || 0
			categoryTotals[category] = (categoryTotals[category] || 0) + amount
			totalSpend += amount
		})
		
		// Convert to percentage
		const breakdown = Object.entries(categoryTotals).map(([category, amount]) => ({
			category,
			amount,
			percentage: totalSpend > 0 ? (amount / totalSpend) * 100 : 0
		}))
		
		return { success: true, data: breakdown }
	} catch (error) {
		console.error('Error calculating category breakdown:', error)
		return { success: false, error: error.message }
	}
}
