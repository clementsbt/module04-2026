import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Profile() {
    const navigate = useNavigate()
    const [name, setName] = useState('')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')

    useEffect(() => {
        const userJson = localStorage.getItem('user')
        if (userJson) {
            const user = JSON.parse(userJson)
            setName(user.name)
        }
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        
        const token = localStorage.getItem('token')
        try {
            const res = await fetch('http://localhost:3000/auth/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ name })
            })
            
            if (res.ok) {
                const user = JSON.parse(localStorage.getItem('user') || '{}')
                user.name = name
                localStorage.setItem('user', JSON.stringify(user))
                setMessage('Profil mis à jour!')
            } else {
                setMessage('Erreur lors de la mise à jour')
            }
        } catch {
            setMessage('Erreur de connexion')
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        navigate('/login')
    }

    const userJson = localStorage.getItem('user')
    const user = userJson ? JSON.parse(userJson) : null

    return (
        <div style={{ maxWidth: 400, margin: '40px auto', padding: '0 16px' }}>
            <h1>Mon Profil</h1>
            
            <div style={{ marginTop: 24, padding: 16, background: '#f5f5f5', borderRadius: 8 }}>
                <p><strong>Email:</strong> {user?.email}</p>
                <p><strong>Rôle:</strong> {user?.role === 'organizer' ? 'Organisateur' : 'Utilisateur'}</p>
            </div>

            <form onSubmit={handleSubmit} style={{ marginTop: 24 }}>
                <div>
                    <label htmlFor="name">Nom</label>
                    <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        style={{ display: 'block', width: '100%', padding: 8, marginTop: 4 }}
                    />
                </div>

                {message && (
                    <p style={{ marginTop: 16, color: message.includes('Erreur') ? 'red' : 'green' }}>
                        {message}
                    </p>
                )}

                <button 
                    type="submit" 
                    disabled={loading}
                    style={{ 
                        marginTop: 16, 
                        padding: '10px 20px',
                        cursor: 'pointer'
                    }}
                >
                    {loading ? 'Enregistrement...' : 'Enregistrer'}
                </button>
            </form>

            <button 
                onClick={handleLogout}
                style={{ 
                    marginTop: 24, 
                    padding: '10px 20px',
                    background: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: 4,
                    cursor: 'pointer'
                }}
            >
                Se déconnecter
            </button>
        </div>
    )
}