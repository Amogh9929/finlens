import React from 'react'
import { motion } from 'framer-motion'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts'
import { useAuth } from '../contexts/AuthContext'
import { getUserProfile } from '../services/firestore'

export function Dashboard() {
	const [profile, setProfile] = React.useState(null)
	const [loading, setLoading] = React.useState(true)
	const { currentUser } = useAuth()

	React.useEffect(() => {
		const fetchProfile = async () => {
			if (!currentUser) {
				setLoading(false)
				return
			}
			
			try {
				const result = await getUserProfile(currentUser.uid)
				if (result.success) {
					setProfile(result.data)
				}
			} catch (err) {
				console.error('Error fetching profile:', err)
			} finally {
				setLoading(false)
			}
		}
		fetchProfile()
	}, [currentUser])

	if (loading) return <div style={{ padding: 40, color: '#cbd5e1' }}>Loading dashboard…</div>

	if (!profile?.onboarded) return null

	const remaining = profile.spending_goal - profile.current_spend
	const percentUsed = Math.min(100, Math.round((profile.current_spend / profile.spending_goal) * 100))
	const overbudget = profile.current_spend > profile.spending_goal

	// Mock category breakdown
	const categoryData = [
		{ name: 'Food', value: profile.current_spend * 0.35, color: '#22c55e' },
		{ name: 'Transport', value: profile.current_spend * 0.2, color: '#06b6d4' },
		{ name: 'Entertainment', value: profile.current_spend * 0.15, color: '#7c3aed' },
		{ name: 'Shopping', value: profile.current_spend * 0.2, color: '#f59e0b' },
		{ name: 'Other', value: profile.current_spend * 0.1, color: '#64748b' },
	]

	// Mock trend data
	const trendData = [
		{ month: 'Jul', spend: profile.current_spend * 0.75 },
		{ month: 'Aug', spend: profile.current_spend * 0.82 },
		{ month: 'Sep', spend: profile.current_spend * 0.9 },
		{ month: 'Oct', spend: profile.current_spend * 0.95 },
		{ month: 'Nov', spend: profile.current_spend },
	]

	const budgetData = [
		{ label: 'Income', value: profile.monthly_income, color: '#22c55e' },
		{ label: 'Goal', value: profile.spending_goal, color: '#06b6d4' },
		{ label: 'Spent', value: profile.current_spend, color: overbudget ? '#ef4444' : '#7c3aed' },
	]

	return (
		<motion.div
			initial={{ opacity: 0, y: 8 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.4, ease: 'easeOut' }}
			style={{ maxWidth: 1200 }}
		>
			<h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 10, color: '#eef2ff' }}>Your Dashboard</h2>
			<motion.div
				initial={{ opacity: 0, y: 8 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.45, ease: 'easeOut', delay: 0.05 }}
				style={{
					marginBottom: 16, padding: 14, borderRadius: 12,
					background: 'linear-gradient(90deg, rgba(34,197,94,0.12), rgba(59,130,246,0.09))',
					border: '1px solid rgba(255,255,255,0.08)'
				}}>
				<strong style={{ color: '#86efac' }}>AI tip:</strong>{' '}
				<span style={{ color: '#e2e8f0' }}>
					{overbudget 
						? `You're ${percentUsed - 100}% over budget. Consider reviewing your top spending categories.`
						: `You've used ${percentUsed}% of your budget. ${remaining > 0 ? `₹${Math.round(remaining)} remaining this month.` : ''}`
					}
				</span>
			</motion.div>

			{/* Stats grid */}
			<motion.div
				initial="hidden"
				animate="visible"
				variants={{
					hidden: { opacity: 1 },
					visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
				}}
				style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', marginBottom: 24 }}
			>
				{[
					{ label: 'Monthly Income', value: `₹${Math.round(profile.monthly_income)}`, color: '#22c55e' },
					{ label: 'Spending Goal', value: `₹${Math.round(profile.spending_goal)}`, color: '#06b6d4' },
					{ label: 'Current Spend', value: `₹${Math.round(profile.current_spend)}`, color: overbudget ? '#ef4444' : '#7c3aed' },
					{ label: 'Remaining', value: overbudget ? '-' : `₹${Math.round(remaining)}`, color: '#a7f3d0' },
				].map((stat, idx) => (
					<motion.div
						key={stat.label}
						variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } }}
						whileHover={{ y: -2, boxShadow: '0 8px 24px rgba(0, 255, 255, 0.1)' }}
						style={{
							border: '1px solid rgba(0,255,255,0.18)',
							borderRadius: 10,
							padding: 16,
							background: 'linear-gradient(180deg, rgba(255,255,255,0.98), rgba(255,255,255,0.96))',
						}}
					>
						<div style={{ fontSize: 12, color: '#64748b', marginBottom: 6 }}>{stat.label}</div>
						<div style={{ fontSize: 24, fontWeight: 800, color: stat.color }}>{stat.value}</div>
					</motion.div>
				))}
			</motion.div>

			{/* Charts row */}
			<div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))' }}>
				{/* Budget comparison */}
				<motion.div
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.4, delay: 0.1 }}
					style={{
						border: '1px solid rgba(0,255,255,0.18)',
						borderRadius: 12,
						padding: 16,
						background: 'linear-gradient(180deg, rgba(255,255,255,0.98), rgba(255,255,255,0.96))',
					}}
				>
					<h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, color: '#334155' }}>Budget Overview</h3>
					<ResponsiveContainer width="100%" height={240}>
						<BarChart data={budgetData}>
							<XAxis dataKey="label" stroke="#64748b" />
							<YAxis stroke="#64748b" />
							<Tooltip contentStyle={{ background: '#0f172a', border: '1px solid rgba(0,255,255,0.3)', borderRadius: 8, color: '#e2e8f0' }} />
							<Bar dataKey="value" radius={[8, 8, 0, 0]}>
								{budgetData.map((entry, idx) => (
									<Cell key={`cell-${idx}`} fill={entry.color} />
								))}
							</Bar>
						</BarChart>
					</ResponsiveContainer>
				</motion.div>

				{/* Category breakdown */}
				<motion.div
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.4, delay: 0.15 }}
					style={{
						border: '1px solid rgba(0,255,255,0.18)',
						borderRadius: 12,
						padding: 16,
						background: 'linear-gradient(180deg, rgba(255,255,255,0.98), rgba(255,255,255,0.96))',
					}}
				>
					<h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, color: '#334155' }}>Spending by Category</h3>
					<ResponsiveContainer width="100%" height={240}>
						<PieChart>
							<Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
								{categoryData.map((entry, idx) => (
									<Cell key={`cell-${idx}`} fill={entry.color} />
								))}
							</Pie>
							<Tooltip contentStyle={{ background: '#0f172a', border: '1px solid rgba(0,255,255,0.3)', borderRadius: 8, color: '#e2e8f0' }} />
						</PieChart>
					</ResponsiveContainer>
				</motion.div>

				{/* Spending trend */}
				<motion.div
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.4, delay: 0.2 }}
					style={{
						border: '1px solid rgba(0,255,255,0.18)',
						borderRadius: 12,
						padding: 16,
						background: 'linear-gradient(180deg, rgba(255,255,255,0.98), rgba(255,255,255,0.96))',
						gridColumn: 'span 2'
					}}
				>
					<h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, color: '#334155' }}>5-Month Spending Trend</h3>
					<ResponsiveContainer width="100%" height={240}>
						<LineChart data={trendData}>
							<XAxis dataKey="month" stroke="#64748b" />
							<YAxis stroke="#64748b" />
							<Tooltip contentStyle={{ background: '#0f172a', border: '1px solid rgba(0,255,255,0.3)', borderRadius: 8, color: '#e2e8f0' }} />
							<Line type="monotone" dataKey="spend" stroke="#7c3aed" strokeWidth={3} dot={{ fill: '#7c3aed', r: 5 }} />
						</LineChart>
					</ResponsiveContainer>
				</motion.div>
			</div>
		</motion.div>
	)
}
