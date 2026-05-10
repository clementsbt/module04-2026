import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate, Link } from 'react-router-dom'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useAuth } from '../contexts/AuthContext'

const loginSchema = z.object({
    email: z.string().email('Email invalide'),
    password: z.string().min(1, 'Mot de passe requis'),
})

type LoginForm = z.infer<typeof loginSchema>

export default function Login() {
    const { login, user } = useAuth()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)

    const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
        resolver: zodResolver(loginSchema),
    })

    // Si déjà connecté, redirige
    if (user) {
        navigate(user.role === 'organizer' ? '/organizer/dashboard' : '/')
    }

    const onSubmit = async (data: LoginForm) => {
        try {
            setLoading(true)
            await login(data.email, data.password)
            toast.success('Connexion réussie !')
            // La redirection se fait via le if user au prochain render
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Identifiants invalides')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={{ maxWidth: 400, margin: '80px auto', padding: '0 16px' }}>
            <h1>Connexion</h1>
            <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 24 }}>

                <div>
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        type="email"
                        {...register('email')}
                        style={{ display: 'block', width: '100%', padding: 8, marginTop: 4 }}
                    />
                    {errors.email && <span style={{ color: 'red', fontSize: 14 }}>{errors.email.message}</span>}
                </div>

                <div>
                    <label htmlFor="password">Mot de passe</label>
                    <input
                        id="password"
                        type="password"
                        {...register('password')}
                        style={{ display: 'block', width: '100%', padding: 8, marginTop: 4 }}
                    />
                    {errors.password && <span style={{ color: 'red', fontSize: 14 }}>{errors.password.message}</span>}
                </div>

                <button type="submit" disabled={loading} style={{ padding: '10px', cursor: 'pointer' }}>
                    {loading ? 'Connexion...' : 'Se connecter'}
                </button>
            </form>

            <p style={{ marginTop: 16, textAlign: 'center' }}>
                Pas encore de compte ? <Link to="/register">S'inscrire</Link>
            </p>
        </div>
    )
}