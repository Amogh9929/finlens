import React from 'react'
import { motion } from 'framer-motion'

export function BehaviorInsights() {
	const [data, setData] = React.useState(null)
	const [loading, setLoading] = React.useState(true)
	const [error, setError] = React.useState(null)

	React.useEffect(() => {
		const fetchData = async () => {
			try {
				const res = await fetch('/api/analytics/behavior-summary')
				if (!res.ok) throw new Error('Failed to fetch behavior insights')
				const js = await res.json()
				setData(js)
			} catch (e) {
				setError(String(e))
			} finally {
				setLoading(false)
			}
		}
		fetchData()
	}, [])

	if (loading) return <div>Loading behavior insights…</div>
	if (error) return <div style={{ color: '#b91c1c' }}>Error: {error}</div>
	if (!data) return null

	const cards = [
		{ key: 'late_night_orders', title: 'Late-night Orders' },
		{ key: 'subscription_creep', title: 'Subscription Creep' },
		{ key: 'dining_spike', title: 'Dining Spike' },
		{ key: 'impulse_buying_tendency', title: 'Impulse Buying' },
	]

	const PercentBar = ({ percent }) => (
		<div style={{ height: 8, background: '#e5e7eb', borderRadius: 999, overflow: 'hidden' }}>
			<div style={{ width: `${percent}%`, height: '100%', background: 'linear-gradient(90deg, #06b6d4, #7c3aed)', borderRadius: 999 }} />
		</div>
	)

	const badgeColor = (pct) => {
		if (pct < 35) return { background: '#dcfce7', color: '#065f46' }
		if (pct < 60) return { background: '#fef3c7', color: '#92400e' }
		return { background: '#ffe4e6', color: '#9f1239' }
	}

	return (
		<motion.div
			initial="hidden"
			animate="visible"
			variants={{
				hidden: { opacity: 1 },
				visible: {
					opacity: 1,
					transition: { staggerChildren: 0.08 }
				}
			}}
			style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}
		>
			{cards.map((c) => {
				const d = data[c.key]
				const badge = badgeColor(d.percent)
				return (
					<motion.div
						key={c.key}
						variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } }}
						transition={{ duration: 0.35, ease: 'easeOut' }}
						whileHover={{ y: -3, boxShadow: '0 10px 30px rgba(0, 255, 255, 0.12), 0 6px 20px rgba(124,58,237,0.10)' }}
						style={{
							border: '1px solid rgba(0,255,255,0.18)',
							borderRadius: 10,
							padding: 16,
							background: 'linear-gradient(180deg, rgba(255,255,255,0.98), rgba(255,255,255,0.96))',
							position: 'relative',
							overflow: 'hidden'
						}}
					>
						<motion.div
							aria-hidden
							initial={{ x: '-40%' }}
							whileHover={{ x: '120%' }}
							transition={{ duration: 1.6, ease: 'linear' }}
							style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, transparent, rgba(0,255,255,0.7), rgba(124,58,237,0.7), transparent)' }}
						/>
						<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
							<h3 style={{ fontWeight: 600 }}>{c.title}</h3>
							<span style={{ padding: '4px 8px', borderRadius: 6, fontSize: 12, background: badge.background, color: badge.color }}>
								{d.percent}%
							</span>
						</div>
						<p style={{ marginTop: 8, color: '#334155' }}>{d.phrase}</p>
						<div style={{ marginTop: 10 }}>
							<PercentBar percent={d.percent} />
						</div>
					</motion.div>
				)
			})}
		</motion.div>
	)
}
