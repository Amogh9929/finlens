import React from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { saveUserProfile } from '../services/firestore'

export function OnboardingModal() {
	const [monthlyIncome, setMonthlyIncome] = React.useState('')
	const [spendingGoal, setSpendingGoal] = React.useState('')
	const [currentSpend, setCurrentSpend] = React.useState('')
	const [error, setError] = React.useState('')
	const [loading, setLoading] = React.useState(false)
	const navigate = useNavigate()
	const { currentUser } = useAuth()

	const handleSubmit = async (e) => {
		e.preventDefault()
		if (!monthlyIncome || !spendingGoal || !currentSpend) {
			setError('Please fill all fields')
			return
		}

		if (!currentUser) {
			setError('You must be logged in')
			return
		}

		setLoading(true)
		setError('')
		try {
			console.log('Saving profile for user:', currentUser.uid)
			const result = await saveUserProfile(currentUser.uid, {
				monthly_income: parseFloat(monthlyIncome),
				spending_goal: parseFloat(spendingGoal),
				current_spend: parseFloat(currentSpend),
			})
			
			console.log('Save result:', result)
			
			if (!result.success) {
				throw new Error(result.error || 'Failed to save profile')
			}
			
			// Force a page reload to refresh the dashboard
			window.location.href = '/app/dashboard'
		} catch (err) {
			console.error('Onboarding error:', err)
			let errorMessage = err.message || String(err)
			
			// Provide helpful error messages
			if (errorMessage.includes('permission') || errorMessage.includes('PERMISSION_DENIED')) {
				errorMessage = 'Permission denied. Check Firestore security rules in Firebase Console. See TROUBLESHOOTING.md for help.'
			} else if (errorMessage.includes('network')) {
				errorMessage = 'Network error. Check your internet connection.'
			}
			
			setError(errorMessage)
		} finally {
			setLoading(false)
		}
	}

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			style={{
				position: 'fixed',
				inset: 0,
				background: 'linear-gradient(180deg, #0a1b3a 0%, #071326 60%, #060f20 100%)',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				zIndex: 100,
				color: '#e2e8f0',
				fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial'
			}}
		>
			<motion.div
				initial={{ opacity: 0, y: 20, scale: 0.95 }}
				animate={{ opacity: 1, y: 0, scale: 1 }}
				transition={{ duration: 0.5, ease: 'easeOut' }}
				style={{
					width: 'min(520px, 90vw)',
					borderRadius: 16,
					border: '1px solid rgba(0,255,255,0.2)',
					background: 'linear-gradient(180deg, rgba(6,12,24,0.95), rgba(6,12,24,0.85))',
					backdropFilter: 'blur(10px)',
					padding: 28,
					boxShadow: '0 20px 60px rgba(0,0,0,0.5)'
				}}
			>
				<h2 style={{ fontWeight: 800, fontSize: 26, marginBottom: 8, color: '#a7f3d0', textAlign: 'center' }}>
					Welcome to Finlens
				</h2>
				<p style={{ color: '#cbd5e1', marginBottom: 20, textAlign: 'center', fontSize: 14 }}>
					Let's personalize your experience. Tell us a bit about your finances.
				</p>
				<form onSubmit={handleSubmit} style={{ display: 'grid', gap: 16 }}>
					<label>
						<div style={{ fontSize: 13, color: '#cbd5e1', marginBottom: 6 }}>Monthly Income (₹)</div>
						<input
							type="number"
							value={monthlyIncome}
							onChange={e => setMonthlyIncome(e.target.value)}
							placeholder="e.g., 30000"
							style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1px solid rgba(0,255,255,0.25)', background: 'rgba(15,23,42,0.8)', color: '#e2e8f0' }}
						/>
					</label>
					<label>
						<div style={{ fontSize: 13, color: '#cbd5e1', marginBottom: 6 }}>Monthly Spending Goal (₹)</div>
						<input
							type="number"
							value={spendingGoal}
							onChange={e => setSpendingGoal(e.target.value)}
							placeholder="e.g., 20000"
							style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1px solid rgba(0,255,255,0.25)', background: 'rgba(15,23,42,0.8)', color: '#e2e8f0' }}
						/>
					</label>
					<label>
						<div style={{ fontSize: 13, color: '#cbd5e1', marginBottom: 6 }}>Current Month Spend So Far (₹)</div>
						<input
							type="number"
							value={currentSpend}
							onChange={e => setCurrentSpend(e.target.value)}
							placeholder="e.g., 12000"
							style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1px solid rgba(0,255,255,0.25)', background: 'rgba(15,23,42,0.8)', color: '#e2e8f0' }}
						/>
					</label>
					{error && <div style={{ color: '#fecaca', fontSize: 12 }}>{error}</div>}
					<button
						disabled={loading}
						type="submit"
						style={{
							marginTop: 8,
							padding: '14px 16px',
							borderRadius: 10,
							background: loading ? '#64748b' : 'linear-gradient(135deg, #22c55e, #16a34a)',
							color: loading ? '#94a3b8' : '#052e16',
							fontWeight: 800,
							border: 'none',
							letterSpacing: 0.3,
							cursor: loading ? 'not-allowed' : 'pointer'
						}}
					>
						{loading ? 'Saving…' : 'Get Started'}
					</button>
				</form>
			</motion.div>
		</motion.div>
	)
}
