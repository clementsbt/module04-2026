import { useState, useEffect } from 'react'

interface Stats {
    totalEvents: number
    totalTickets: number
    totalRevenue: number
    events: Array<{ id: number; title: string; ticketsSold: number; totalPlaces: number }>
}

export default function Dashboard() {
    const [stats, setStats] = useState<Stats | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const token = localStorage.getItem('token')
        fetch('http://localhost:3000/events/my-events', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => {
                const events = data.events || data
                const totalTickets = events.reduce((sum: number, e: any) => sum + (e.ticketsSold || 0), 0)
                const totalRevenue = events.reduce((sum: number, e: any) => sum + (e.ticketsSold || 0) * (e.price || 0), 0)
                setStats({
                    totalEvents: events.length,
                    totalTickets,
                    totalRevenue,
                    events
                })
                setLoading(false)
            })
            .catch(() => setLoading(false))
    }, [])

    if (loading) return <div style={{ padding: 20 }}>Chargement...</div>

    return (
        <div style={{ maxWidth: 800, margin: '0 auto', padding: 20 }}>
            <h1>Dashboard Organisateur</h1>

            <div style={{ display: 'flex', gap: 16, marginTop: 24 }}>
                <div style={{ flex: 1, padding: 20, background: '#f0f0f0', borderRadius: 8, textAlign: 'center' }}>
                    <p style={{ fontSize: 32, margin: 0, fontWeight: 'bold' }}>{stats?.totalEvents || 0}</p>
                    <p style={{ color: '#666', marginTop: 8 }}>Événements créés</p>
                </div>
                <div style={{ flex: 1, padding: 20, background: '#f0f0f0', borderRadius: 8, textAlign: 'center' }}>
                    <p style={{ fontSize: 32, margin: 0, fontWeight: 'bold' }}>{stats?.totalTickets || 0}</p>
                    <p style={{ color: '#666', marginTop: 8 }}>Billets vendus</p>
                </div>
                <div style={{ flex: 1, padding: 20, background: '#f0f0f0', borderRadius: 8, textAlign: 'center' }}>
                    <p style={{ fontSize: 32, margin: 0, fontWeight: 'bold' }}>{stats?.totalRevenue || 0}€</p>
                    <p style={{ color: '#666', marginTop: 8 }}>Chiffre d'affaires</p>
                </div>
            </div>

            <h2 style={{ marginTop: 32 }}>Aperçu des événements</h2>
            {stats?.events.length === 0 ? (
                <p style={{ color: '#666', marginTop: 16 }}>Aucun événement créé</p>
            ) : (
                <div style={{ marginTop: 16 }}>
                    {stats?.events.slice(0, 5).map(event => (
                        <div 
                            key={event.id} 
                            style={{ 
                                padding: 16, 
                                border: '1px solid #ddd', 
                                borderRadius: 8,
                                marginBottom: 8
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>{event.title}</span>
                                <span style={{ color: '#666' }}>
                                    {event.ticketsSold || 0} / {event.totalPlaces} billets
                                </span>
                            </div>
                            <div style={{ 
                                marginTop: 8, 
                                height: 8, 
                                background: '#e0e0e0', 
                                borderRadius: 4,
                                overflow: 'hidden'
                            }}>
                                <div style={{ 
                                    height: '100%', 
                                    width: `${((event.ticketsSold || 0) / event.totalPlaces) * 100}%`,
                                    background: '#28a745'
                                }} />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}