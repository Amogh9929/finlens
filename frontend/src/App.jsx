import React from 'react'
import { BrowserRouter, Routes, Route, Navigate, Link, useLocation, useNavigationType, useOutlet, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { FuzzyInsights } from './components/FuzzyInsights'
import { BehaviorInsights } from './components/BehaviorInsights'
import { Dashboard } from './components/Dashboard'
import { OnboardingModal } from './components/OnboardingModal'
import { AuthProvider, useAuth } from './contexts/AuthContext'

function BackgroundOrbs() {
	return (
		<div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
			<motion.div
				aria-hidden
				initial={{ x: 140, y: -140, opacity: 0.25, scale: 0.9 }}
				animate={{ x: 60, y: -60, opacity: 0.4, scale: 1.07 }}
				transition={{ duration: 12, ease: 'easeInOut', repeat: Infinity, repeatType: 'reverse' }}
				style={{
					position: 'absolute',
					top: 0,
					right: 0,
					width: 520,
					height: 520,
					borderRadius: '50%',
					background: 'radial-gradient(closest-side, rgba(0,255,255,0.22), rgba(0,255,255,0) 70%)',
					filter: 'blur(22px)'
				}}
			/>
			<motion.div
				aria-hidden
				initial={{ x: -160, y: -120, opacity: 0.18, scale: 0.92 }}
				animate={{ x: -80, y: -40, opacity: 0.28, scale: 1.06 }}
				transition={{ duration: 14, ease: 'easeInOut', repeat: Infinity, repeatType: 'reverse' }}
				style={{
					position: 'absolute',
					top: 0,
					left: 0,
					width: 460,
					height: 460,
					borderRadius: '50%',
					background: 'radial-gradient(closest-side, rgba(255,0,200,0.18), rgba(255,0,200,0) 70%)',
					filter: 'blur(30px)'
				}}
			/>
		</div>
	)
}

function Header() {
	const location = useLocation()
	const { currentUser, logout } = useAuth()
	const navigate = useNavigate()
	const isLoginPage = location.pathname === '/login'

	const handleLogout = async () => {
		try {
			await logout()
			navigate('/login')
		} catch (err) {
			console.error('Logout error:', err)
		}
	}

	return (
		<motion.header
			initial={{ opacity: 0, y: -12 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.4, ease: 'easeOut' }}
			style={{
				position: 'fixed',
				top: 0,
				left: 0,
				right: 0,
				height: 88,
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				background: 'linear-gradient(180deg, rgba(4,8,16,0.75), rgba(4,8,16,0.35) 60%, rgba(4,8,16,0))',
				backdropFilter: 'blur(6px)',
				borderBottom: '1px solid rgba(255,255,255,0.04)',
				zIndex: 30
			}}>
			{/* subtle halo behind logo */}
			<div style={{
				position: 'absolute', top: 10, left: '50%', transform: 'translateX(-50%)',
				width: 420, height: 140, pointerEvents: 'none', filter: 'blur(28px)',
				background: 'radial-gradient(60% 40% at 50% 50%, rgba(0,255,255,0.16), rgba(255,0,200,0.10), rgba(0,0,0,0))'
			}} />
			<div style={{ position: 'absolute', left: 0, right: 0, textAlign: 'center', pointerEvents: 'none' }}>
				<motion.h1
					initial={{ opacity: 0.0, y: 8 }}
					animate={{
						opacity: 1,
						y: 0,
						transition: { duration: 0.6, ease: 'easeOut' }
					}}
					whileHover={{ scale: 1.02 }}
					transition={{ type: 'spring', stiffness: 180, damping: 18 }}
					style={{
						fontWeight: 800,
						fontSize: 44,
						letterSpacing: 0.4,
						margin: 0,
						lineHeight: 1,
						backgroundImage: 'linear-gradient(90deg, #00eaff 0%, #7c3aed 50%, #00ffa3 100%)',
						WebkitBackgroundClip: 'text',
						backgroundClip: 'text',
						color: 'transparent',
						textShadow: 'none'
					}}
				>
					Finlens
					{/* shimmer overlay */}
					<motion.span
						aria-hidden
						initial={{ x: '-120%' }}
						animate={{ x: ['-120%','120%'] }}
						transition={{ duration: 2.6, repeat: Infinity, ease: 'linear', repeatDelay: 1.0 }}
						style={{
							position: 'absolute',
							inset: 0,
							background: 'linear-gradient(100deg, transparent 32%, rgba(255,255,255,0.28) 50%, transparent 68%)',
							WebkitBackgroundClip: 'text',
							backgroundClip: 'text',
							color: 'transparent',
							pointerEvents: 'none'
						}}
					/>
				</motion.h1>
			</div>
			{/* Logout button (only show when logged in and not on login page) */}
			{currentUser && !isLoginPage && (
				<div style={{ position: 'absolute', right: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
					<span style={{ fontSize: 13, color: '#94a3b8' }}>{currentUser.email}</span>
					<button
						onClick={handleLogout}
						style={{
							padding: '8px 16px',
							borderRadius: 8,
							background: 'rgba(239,68,68,0.15)',
							border: '1px solid rgba(239,68,68,0.3)',
							color: '#fca5a5',
							fontSize: 13,
							fontWeight: 600,
							cursor: 'pointer'
						}}
					>
						Logout
					</button>
				</div>
			)}
		</motion.header>
	)
}

function SegmentedBar() {
	const location = useLocation()
	const nav = [
		{ to: '/app/dashboard', label: 'Dashboard' },
		{ to: '/app/spending', label: 'Spending' },
		{ to: '/app/budget', label: 'Budget' },
		{ to: '/app/savings', label: 'Savings' },
		{ to: '/app/profile', label: 'Profile' },
	]
	const activeIndex = Math.max(0, nav.findIndex(n => location.pathname.startsWith(n.to)))
	const segmentCount = nav.length
	return (
		<motion.div
			initial={{ opacity: 0, y: -6 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.35, ease: 'easeOut', delay: 0.05 }}
			style={{
				position: 'fixed',
				top: 100,
				right: 24,
				zIndex: 25
			}}
		>
			<div style={{
				width: 'min(720px, 92vw)',
				borderRadius: 12,
				border: '1px solid rgba(0,255,255,0.15)',
				background: 'linear-gradient(180deg, rgba(6,12,24,0.6), rgba(6,12,24,0.35))',
				backdropFilter: 'blur(10px)',
				padding: 4,
				position: 'relative',
			}}>
				{/* Active indicator */}
				<motion.div
					aria-hidden
					initial={false}
					animate={{ 
						left: `calc(${(100 / segmentCount) * activeIndex}% + 4px)`,
						width: `calc(${100 / segmentCount}% - 4px)`
					}}
					transition={{ type: 'spring', stiffness: 260, damping: 26 }}
					style={{
						position: 'absolute',
						top: 4,
						height: 'calc(100% - 8px)',
						borderRadius: 8,
						background: 'linear-gradient(90deg, rgba(0,255,255,0.18), rgba(124,58,237,0.18))',
						border: '1px solid rgba(0,255,255,0.25)',
						pointerEvents: 'none'
					}}
				/>
				{/* neon sweep */}
				<motion.div
					aria-hidden
					initial={{ x: '-20%' }}
					animate={{ x: '120%' }}
					transition={{ duration: 2.8, repeat: Infinity, ease: 'linear', repeatDelay: 1.2 }}
					style={{
						position: 'absolute',
						top: 0,
						height: 2,
						left: 0,
						right: 0,
						background: 'linear-gradient(90deg, transparent, rgba(0,255,255,0.5), rgba(124,58,237,0.5), transparent)'
					}}
				/>
				<div style={{
					display: 'grid',
					gridTemplateColumns: `repeat(${segmentCount}, 1fr)`,
					gap: 4,
					position: 'relative'
				}}>
					{nav.map((item, idx) => {
						const active = idx === activeIndex
						return (
							<Link key={item.to} to={item.to} style={{
								textDecoration: 'none',
								textAlign: 'center',
								padding: '10px 10px',
								borderRadius: 8,
								color: active ? '#eafffb' : '#e2e8f0',
								fontWeight: 600,
								fontSize: 12.5,
								letterSpacing: 0.2,
								position: 'relative',
								zIndex: 1
							}}>
								{item.label}
							</Link>
						)
					})}
				</div>
			</div>
		</motion.div>
	)
}

function AgentWidget() {
    const [open, setOpen] = React.useState(false)
    const [prompt, setPrompt] = React.useState('')
    const [loading, setLoading] = React.useState(false)
    const [messages, setMessages] = React.useState([])
    const [error, setError] = React.useState('')
    const messagesEndRef = React.useRef(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    React.useEffect(() => {
        scrollToBottom()
    }, [messages])

    const ask = async (e) => {
        e?.preventDefault()
        if (!prompt.trim()) return
        
        const userMsg = { role: 'user', content: prompt }
        setMessages(prev => [...prev, userMsg])
        setPrompt('')
        setLoading(true)
        setError('')
        
        try {
            const qs = new URLSearchParams({ q: prompt })
            const res = await fetch(`/api/agent/respond?${qs.toString()}`)
            if (!res.ok) throw new Error('Agent request failed')
            const js = await res.json()
            const assistantMsg = {
                role: 'assistant',
                content: js.suggestions && js.suggestions.length > 0 
                    ? js.suggestions.join('\n• ')
                    : 'No specific suggestions right now.'
            }
            setMessages(prev => [...prev, assistantMsg])
        } catch (err) {
            setError(String(err))
            const errMsg = { role: 'assistant', content: `Error: ${String(err)}` }
            setMessages(prev => [...prev, errMsg])
        } finally {
            setLoading(false)
        }
    }

    React.useEffect(() => {
        const onKey = (e) => { if (e.key === 'Escape') setOpen(false) }
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [])

    return (
        <>
            {/* Collapsed bottom center bar */}
			{!open && (
				<motion.button
					onClick={() => setOpen(true)}
					initial={{ opacity: 0, y: 12 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.35, ease: 'easeOut' }}
					style={{
						position: 'fixed',
						bottom: 16,
						left: '50%',
						transform: 'translateX(-50%)',
						padding: '10px 14px',
						borderRadius: 999,
						border: '1px solid rgba(0,255,255,0.25)',
						background: 'linear-gradient(180deg, rgba(6,12,24,0.75), rgba(6,12,24,0.55))',
						color: '#e2e8f0',
						fontWeight: 700,
						letterSpacing: 0.2,
						backdropFilter: 'blur(10px)',
						cursor: 'pointer',
						zIndex: 40,
						boxShadow: '0 8px 24px rgba(0,0,0,0.35)'
					}}
					whileHover={{ scale: 1.03 }}
					whileTap={{ scale: 0.98 }}
				>
					💬 Ask Finlens
				</motion.button>
			)}

            {/* Expanded full-screen slide-up chat */}
            <AnimatePresence>
                {open && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            onClick={() => setOpen(false)}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.5 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            style={{ position: 'fixed', inset: 0, background: '#020617', zIndex: 50 }}
                        />
                        {/* Full-screen chat panel */}
                        <motion.div
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
                            style={{
                                position: 'fixed',
                                inset: 0,
                                display: 'flex',
                                flexDirection: 'column',
                                background: 'linear-gradient(180deg, #050a14 0%, #040812 60%, #03070f 100%)',
                                color: '#e2e8f0',
                                zIndex: 60
                            }}
                        >
                            {/* Header */}
                            <div style={{ 
                                padding: '14px 16px', 
                                borderBottom: '1px solid rgba(0,255,255,0.15)', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'space-between',
                                background: 'linear-gradient(180deg, rgba(6,12,24,0.9), rgba(6,12,24,0.6))',
                                backdropFilter: 'blur(10px)'
                            }}>
                                <strong style={{ color: '#a7f3d0', fontSize: 16 }}>💬 Finlens Assistant</strong>
                                <button onClick={() => setOpen(false)} style={{ 
                                    background: 'transparent', 
                                    border: 'none', 
                                    color: '#cbd5e1', 
                                    fontSize: 24, 
                                    cursor: 'pointer',
                                    padding: '4px 8px'
                                }}>×</button>
                            </div>
                            
                            {/* Message history (scrollable) */}
                            <div style={{ 
                                flex: 1, 
                                overflowY: 'auto', 
                                padding: '16px',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 12
                            }}>
                                {messages.length === 0 && (
                                    <div style={{ 
                                        color: '#64748b', 
                                        fontSize: 14, 
                                        textAlign: 'center', 
                                        marginTop: 40 
                                    }}>
                                        Ask me anything about your spending, budget, or savings.
                                    </div>
                                )}
                                {messages.map((msg, idx) => (
                                    <div key={idx} style={{ 
                                        alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                                        maxWidth: '75%'
                                    }}>
                                        <div style={{
                                            padding: '10px 14px',
                                            borderRadius: 12,
                                            background: msg.role === 'user' 
                                                ? 'linear-gradient(135deg, #22c55e, #16a34a)' 
                                                : 'linear-gradient(135deg, rgba(6,12,24,0.9), rgba(15,23,42,0.8))',
                                            border: msg.role === 'assistant' ? '1px solid rgba(0,255,255,0.2)' : 'none',
                                            color: '#e2e8f0',
                                            fontSize: 14,
                                            lineHeight: 1.5,
                                            whiteSpace: 'pre-wrap'
                                        }}>
                                            {msg.role === 'assistant' && msg.content.includes('\n') 
                                                ? msg.content.split('\n').map((line, i) => (
                                                    <div key={i} style={{ marginBottom: i < msg.content.split('\n').length - 1 ? 6 : 0 }}>
                                                        {line}
                                                    </div>
                                                ))
                                                : msg.content
                                            }
                                        </div>
                                    </div>
                                ))}
                                {loading && (
                                    <div style={{ alignSelf: 'flex-start', maxWidth: '75%' }}>
                                        <div style={{
                                            padding: '10px 14px',
                                            borderRadius: 12,
                                            background: 'linear-gradient(135deg, rgba(6,12,24,0.9), rgba(15,23,42,0.8))',
                                            border: '1px solid rgba(0,255,255,0.2)',
                                            color: '#64748b',
                                            fontSize: 14
                                        }}>
                                            Thinking...
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>
                            
                            {/* Input bar */}
                            <form onSubmit={ask} style={{ 
                                padding: 12, 
                                display: 'flex', 
                                gap: 8, 
                                borderTop: '1px solid rgba(0,255,255,0.15)',
                                background: 'linear-gradient(180deg, rgba(6,12,24,0.6), rgba(6,12,24,0.9))',
                                backdropFilter: 'blur(10px)'
                            }}>
                                <input 
                                    value={prompt} 
                                    onChange={e => setPrompt(e.target.value)} 
                                    placeholder="Type your question…"
                                    autoFocus
                                    style={{ 
                                        flex: 1, 
                                        padding: '14px 16px', 
                                        borderRadius: 10, 
                                        border: '1px solid rgba(0,255,255,0.25)', 
                                        background: 'rgba(15,23,42,0.8)', 
                                        color: '#e2e8f0',
                                        fontSize: 14
                                    }} 
                                />
                                <button 
                                    disabled={loading || !prompt.trim()} 
                                    type="submit" 
                                    style={{
                                        padding: '14px 20px', 
                                        borderRadius: 10, 
                                        background: loading || !prompt.trim() ? '#475569' : 'linear-gradient(135deg, #22c55e, #16a34a)', 
                                        color: loading || !prompt.trim() ? '#94a3b8' : '#052e16', 
                                        fontWeight: 800, 
                                        border: 'none',
                                        minWidth: 90,
                                        cursor: loading || !prompt.trim() ? 'not-allowed' : 'pointer'
                                    }}
                                >
                                    {loading ? 'Sending…' : 'Send'}
                                </button>
                            </form>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
		</>
	)
}

function Layout({ children }) {
	return (
		<div style={{
			minHeight: '100vh',
			background: 'radial-gradient(1200px 700px at 80% -10%, rgba(0,255,255,0.10), transparent), radial-gradient(900px 600px at 15% -10%, rgba(124,58,237,0.10), transparent), linear-gradient(180deg, #050a14 0%, #040812 60%, #03070f 100%)',
			color: '#e2e8f0',
			fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial'
		}}>
			<BackgroundOrbs />
			<Header />
			<SegmentedBar />
			<AgentWidget />
			<motion.main
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				transition={{ duration: 0.3 }}
				style={{ paddingTop: 172, paddingLeft: 24, paddingRight: 24, paddingBottom: 80, maxWidth: 1200, margin: '0 auto' }}
			>
				<motion.div
					initial={{ opacity: 0, y: 8 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.35, ease: 'easeOut', delay: 0.05 }}
				>
					{children}
				</motion.div>
			</motion.main>
		</div>
	)
}

function LoginPage() {
	const [email, setEmail] = React.useState('')
	const [password, setPassword] = React.useState('')
	const [error, setError] = React.useState('')
	const [loading, setLoading] = React.useState(false)
	const [isSignup, setIsSignup] = React.useState(false)
	const { login, signup } = useAuth()
	const navigate = useNavigate()

	const onSubmit = async (e) => {
		e.preventDefault()
		if (!email || !password) {
			setError('Enter email and password')
			return
		}

		if (password.length < 6) {
			setError('Password must be at least 6 characters')
			return
		}

		setLoading(true)
		setError('')

		try {
			if (isSignup) {
				await signup(email, password)
			} else {
				await login(email, password)
			}
			navigate('/app/dashboard')
		} catch (err) {
			console.error('Auth error:', err)
			if (err.code === 'auth/email-already-in-use') {
				setError('Email already in use. Try logging in instead.')
			} else if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
				setError('Invalid email or password')
			} else if (err.code === 'auth/user-not-found') {
				setError('No account found. Try signing up instead.')
			} else if (err.code === 'auth/invalid-email') {
				setError('Invalid email address')
			} else {
				setError(err.message || 'Authentication failed')
			}
		} finally {
			setLoading(false)
		}
	}
	return (
		<AnimatePresence>
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ duration: 0.35 }}
			style={{
			minHeight: '100vh',
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			background: 'linear-gradient(180deg, #0a1b3a 0%, #071326 60%, #060f20 100%)',
			color: '#e2e8f0',
			fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial'
		}}>
			<div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 24, alignItems: 'center', maxWidth: 1000, padding: 16 }}>
				<motion.div
					initial={{ opacity: 0, y: 12 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, ease: 'easeOut' }}
					style={{
						borderRadius: 16,
						background: 'linear-gradient(45deg, rgba(34,197,94,0.12), rgba(59,130,246,0.08))',
						border: '1px solid rgba(255,255,255,0.08)',
						padding: 28
					}}
				>
					<div style={{ marginBottom: 18 }}>
						<div style={{ color: '#22c55e', fontWeight: 800, fontSize: 28, letterSpacing: 0.5 }}>Finlens</div>
						<div style={{ color: '#cbd5e1', marginTop: 6, maxWidth: 520, lineHeight: 1.6 }}>
							Your AI-powered student expense buddy. Smart budgets, fuzzy insights, and personalized tips — all in one place.
						</div>
					</div>
					<ul style={{ margin: 0, paddingLeft: 18, color: '#a7b1c2', lineHeight: 1.8 }}>
						<li>Clear view of spending, budget, and savings</li>
						<li>Fuzzy, human-like insights instead of rigid alerts</li>
						<li>Always-available AI agent for quick advice</li>
					</ul>
				</motion.div>
				<motion.div
					initial={{ opacity: 0, y: 12, scale: 0.98 }}
					animate={{ opacity: 1, y: 0, scale: 1 }}
					exit={{ opacity: 0, y: 10 }}
					transition={{ duration: 0.4, ease: 'easeOut' }}
					style={{
						width: 420,
						borderRadius: 14,
						border: '1px solid rgba(255,255,255,0.08)',
						background: 'rgba(10, 20, 40, 0.7)',
						backdropFilter: 'blur(10px)',
						padding: 24,
						boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
					}}>
					<div style={{ textAlign: 'center', marginBottom: 16 }}>
						<h2 style={{ color: '#e2e8f0', fontWeight: 800, fontSize: 20, margin: 0 }}>
							{isSignup ? 'Create Account' : 'Sign in to Finlens'}
						</h2>
						<p style={{ color: '#9aa4b2', marginTop: 6, fontSize: 13 }}>
							{isSignup ? 'Join Finlens and take control of your finances' : 'Welcome back — let\'s stay on track'}
						</p>
					</div>
					<form onSubmit={onSubmit} style={{ display: 'grid', gap: 12 }}>
						<label>
							<div style={{ fontSize: 12, color: '#cbd5e1', marginBottom: 6 }}>Email</div>
							<input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="you@example.com"
								style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1px solid #2a3a55', background: '#0b162a', color: '#e2e8f0' }} />
						</label>
						<label>
							<div style={{ fontSize: 12, color: '#cbd5e1', marginBottom: 6 }}>Password</div>
							<input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="••••••••"
								style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1px solid #2a3a55', background: '#0b162a', color: '#e2e8f0' }} />
						</label>
						{error ? <div style={{ color: '#fecaca', fontSize: 12 }}>{error}</div> : null}
						<button 
							type="submit" 
							disabled={loading}
							style={{
								marginTop: 8, 
								padding: '12px 14px', 
								borderRadius: 10, 
								background: loading ? '#64748b' : '#22c55e', 
								color: loading ? '#cbd5e1' : '#052e16', 
								fontWeight: 800, 
								border: 'none', 
								letterSpacing: 0.2,
								cursor: loading ? 'not-allowed' : 'pointer'
							}}
						>
							{loading ? (isSignup ? 'Creating Account...' : 'Signing in...') : (isSignup ? 'Sign Up' : 'Sign In')}
						</button>
						<button 
							type="button"
							onClick={() => {
								setIsSignup(!isSignup)
								setError('')
							}}
							style={{
								padding: '10px 14px',
								borderRadius: 10,
								background: 'transparent',
								color: '#22c55e',
								fontWeight: 600,
								border: '1px solid rgba(34,197,94,0.3)',
								cursor: 'pointer',
								fontSize: 13
							}}
						>
							{isSignup ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
						</button>
						<div style={{ color: '#9aa4b2', fontSize: 12, textAlign: 'center' }}>
							By continuing, you agree to our Terms and Privacy Policy.
						</div>
					</form>
				</motion.div>
			</div>
		</motion.div>
		</AnimatePresence>
	)
}

function SectionShell({ title, tip, children }) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 8 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5, ease: 'easeOut' }}
			style={{ maxWidth: 1200 }}
		>
			<h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 10, color: '#eef2ff' }}>{title}</h2>
			<motion.div
				initial={{ opacity: 0, y: 8 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.45, ease: 'easeOut', delay: 0.05 }}
				style={{
					marginBottom: 16, padding: 14, borderRadius: 12,
					background: 'linear-gradient(90deg, rgba(34,197,94,0.12), rgba(59,130,246,0.09))',
					border: '1px solid rgba(255,255,255,0.08)'
				}}>
				<strong style={{ color: '#86efac' }}>AI tip:</strong> <span style={{ color: '#e2e8f0' }}>{tip}</span>
			</motion.div>
			{children}
		</motion.div>
	)
}

function SpendingPage() {
	return (
		<Layout>
			<SectionShell title="Spending" tip="You’re moderately high vs normal. Try a no-spend weekend.">
				<FuzzyInsights />
				<div style={{ marginTop: 16 }}>
					<BehaviorInsights />
				</div>
			</SectionShell>
		</Layout>
	)
}

function BudgetPage() {
	return (
		<Layout>
			<SectionShell title="Budget" tip="Budget risk is moderately high. Consider a temporary 10% cap.">
				<div style={{ color: '#cbd5e1' }}>Your budget status and projections will appear here.</div>
				<div style={{ marginTop: 16 }}>
					<FuzzyInsights />
				</div>
			</SectionShell>
		</Layout>
	)
}

function SavingsPage() {
	return (
		<Layout>
			<SectionShell title="Savings" tip="Round-up transfers could save ₹500–₹800 this month.">
				<div style={{ color: '#cbd5e1' }}>Savings goals and progress will appear here.</div>
			</SectionShell>
		</Layout>
	)
}

function DashboardPage() {
	const [onboarded, setOnboarded] = React.useState(null)
	const { currentUser } = useAuth()
	const location = useLocation()

	React.useEffect(() => {
		const checkOnboarding = async () => {
			if (!currentUser) {
				setOnboarded(false)
				return
			}

			try {
				const { getUserProfile } = await import('./services/firestore')
				const result = await getUserProfile(currentUser.uid)
				if (result.success) {
					setOnboarded(result.data.onboarded || false)
				} else {
					setOnboarded(false)
				}
			} catch (err) {
				console.error('Error checking onboarding:', err)
				setOnboarded(false)
			}
		}
		checkOnboarding()
	}, [currentUser, location])

	if (onboarded === null) {
		return (
			<Layout>
				<div style={{ textAlign: 'center', paddingTop: 40, color: '#cbd5e1' }}>Loading...</div>
			</Layout>
		)
	}

	if (!onboarded) {
		return <OnboardingModal />
	}

	return (
		<Layout>
			<Dashboard />
		</Layout>
	)
}

function ProfilePage() {
	return (
		<Layout>
			<SectionShell title="Profile" tip="Set category caps to receive proactive nudges.">
				<div style={{ color: '#cbd5e1' }}>Profile and preferences will appear here.</div>
			</SectionShell>
		</Layout>
	)
}

function RequireAuth({ children }) {
	const token = typeof window !== 'undefined' ? localStorage.getItem('finlens_token') : null
	if (!token) return <Navigate to="/login" replace />
	return children
}

export function App() {
	return (
		<BrowserRouter>
			<AuthProvider>
				<AppRoutes />
			</AuthProvider>
		</BrowserRouter>
	)
}

function AppRoutes() {
	const location = useLocation()
	return (
		<AnimatePresence mode="wait">
			<Routes location={location} key={location.pathname}>
				<Route path="/login" element={<LoginPage />} />
				<Route path="/app/dashboard" element={<RequireAuth><DashboardPage /></RequireAuth>} />
				<Route path="/app/spending" element={<RequireAuth><SpendingPage /></RequireAuth>} />
				<Route path="/app/budget" element={<RequireAuth><BudgetPage /></RequireAuth>} />
				<Route path="/app/savings" element={<RequireAuth><SavingsPage /></RequireAuth>} />
				<Route path="/app/profile" element={<RequireAuth><ProfilePage /></RequireAuth>} />
				<Route path="*" element={<Navigate to="/login" replace />} />
			</Routes>
		</AnimatePresence>
	)
}


