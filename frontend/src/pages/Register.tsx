import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

export default function Register() {
    const navigate = useNavigate()
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'user'
    })
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [loading, setLoading] = useState(false)

    const validate = () => {
        const newErrors: Record<string, string> = {}
        
        if (!form.name.trim()) newErrors.name = 'Le nom est requis'
        else if (form.name.length < 2) newErrors.name = 'Le nom doit contenir au moins 2 caractères'
        
        if (!form.email) newErrors.email = 'L\'email est requis'
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = 'Email invalide'
        
        if (!form.password) newErrors.password = 'Le mot de passe est requis'
        else if (form.password.length < 6) newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères'
        
        if (!form.confirmPassword) newErrors.confirmPassword = 'La confirmation est requise'
        else if (form.password !== form.confirmPassword) newErrors.confirmPassword = 'Les mots de passe ne correspondent pas'
        
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setForm(prev => ({ ...prev, [name]: value }))
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }))
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!validate()) return

        setLoading(true)
        try {
            const res = await fetch('http://localhost:3000/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: form.name,
                    email: form.email,
                    password: form.password,
                    role: form.role
                })
            })
            
            const data = await res.json()
            
            if (res.ok) {
                localStorage.setItem('token', data.token)
                localStorage.setItem('user', JSON.stringify(data.user))
                navigate(form.role === 'organizer' ? '/organizer/dashboard' : '/')
            } else {
                setErrors({ submit: data.message || 'Erreur lors de l\'inscription' })
            }
        } catch {
            setErrors({ submit: 'Erreur de connexion' })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={{ maxWidth: 400, margin: '40px auto', padding: '0 16px' }}>
            <h1>Inscription</h1>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 24 }}>
                <div>
                    <label htmlFor="name">Nom</label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        value={form.name}
                        onChange={handleChange}
                        style={{ display: 'block', width: '100%', padding: 8, marginTop: 4 }}
                    />
                    {errors.name && <span style={{ color: 'red', fontSize: 14 }}>{errors.name}</span>}
                </div>

                <div>
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        style={{ display: 'block', width: '100%', padding: 8, marginTop: 4 }}
                    />
                    {errors.email && <span style={{ color: 'red', fontSize: 14 }}>{errors.email}</span>}
                </div>

                <div>
                    <label htmlFor="password">Mot de passe</label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        value={form.password}
                        onChange={handleChange}
                        style={{ display: 'block', width: '100%', padding: 8, marginTop: 4 }}
                    />
                    {errors.password && <span style={{ color: 'red', fontSize: 14 }}>{errors.password}</span>}
                </div>

                <div>
                    <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
                    <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        style={{ display: 'block', width: '100%', padding: 8, marginTop: 4 }}
                    />
                    {errors.confirmPassword && <span style={{ color: 'red', fontSize: 14 }}>{errors.confirmPassword}</span>}
                </div>

                <div>
                    <label htmlFor="role">Je suis</label>
                    <select
                        id="role"
                        name="role"
                        value={form.role}
                        onChange={handleChange}
                        style={{ display: 'block', width: '100%', padding: 8, marginTop: 4 }}
                    >
                        <option value="user">Utilisateur</option>
                        <option value="organizer">Organisateur</option>
                    </select>
                </div>

                {errors.submit && (
                    <div style={{ color: 'red', padding: 8, background: '#ffe6e6', borderRadius: 4 }}>
                        {errors.submit}
                    </div>
                )}

                <button type="submit" disabled={loading} style={{ padding: '12px', fontSize: 16, cursor: 'pointer' }}>
                    {loading ? 'Inscription...' : 'S\'inscrire'}
                </button>
            </form>

            <p style={{ marginTop: 16, textAlign: 'center' }}>
                Déjà un compte ? <Link to="/login">Se connecter</Link>
            </p>
        </div>
    )
}