import React, { createContext, useContext, useEffect, useState } from 'react'
import { 
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	signOut,
	onAuthStateChanged
} from 'firebase/auth'
import { auth } from '../firebase'

const AuthContext = createContext({})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }) {
	const [currentUser, setCurrentUser] = useState(null)
	const [loading, setLoading] = useState(true)

	// Sign up function
	const signup = (email, password) => {
		return createUserWithEmailAndPassword(auth, email, password)
	}

	// Login function
	const login = (email, password) => {
		return signInWithEmailAndPassword(auth, email, password)
	}

	// Logout function
	const logout = () => {
		localStorage.removeItem('finlens_token')
		return signOut(auth)
	}

	// Listen for auth state changes
	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			setCurrentUser(user)
			setLoading(false)
			if (user) {
				// Store a simple flag in localStorage for RequireAuth component
				localStorage.setItem('finlens_token', 'authenticated')
			} else {
				localStorage.removeItem('finlens_token')
			}
		})

		return unsubscribe
	}, [])

	const value = {
		currentUser,
		signup,
		login,
		logout
	}

	return (
		<AuthContext.Provider value={value}>
			{!loading && children}
		</AuthContext.Provider>
	)
}
