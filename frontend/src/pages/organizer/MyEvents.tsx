import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

interface Event {
    id: number
    title: string
    date: string
    location: string
    price: number
    totalPlaces: number
    ticketsSold: number
}

export default function MyEvents() {
    const [events, setEvents] = useState<Event[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const token = localStorage.getItem('token')
        fetch('http://localhost:3000/events/my-events', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => {
                setEvents(data.events || data)
                setLoading(false)
            })
            .catch(() => setLoading(false))
    }, [])

    const handleDelete = async (id: number) => {
        if (!confirm('Voulez-vous vraiment supprimer cet événement ?')) return
        
        const token = localStorage.getItem('token')
        try {
            const res = await fetch(`http://localhost:3000/events/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            })
            
            if (res.ok) {
                setEvents(events.filter(e => e.id !== id))
            } else {
                alert('Impossible de supprimer - des billets ont déjà été vendus')
            }
        } catch {
            alert('Erreur lors de la suppression')
        }
    }

    if (loading) return <div style={{ padding: 20 }}>Chargement...</div>

    return (
        <div style={{ maxWidth: 800, margin: '0 auto', padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1>Mes Événements</h1>
                <Link 
                    to="/organizer/events/new"
                    style={{
                        padding: '10px 20px',
                        background: '#28a745',
                        color: 'white',
                        textDecoration: 'none',
                        borderRadius: 4
                    }}
                >
                    + Créer un événement
                </Link>
            </div>

            {events.length === 0 ? (
                <p style={{ marginTop: 20, color: '#666' }}>Aucun événement créé</p>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 20 }}>
                    {events.map(event => (
                        <div 
                            key={event.id} 
                            style={{ 
                                border: '1px solid #ddd', 
                                padding: 16, 
                                borderRadius: 8,
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}
                        >
                            <div>
                                <h3>{event.title}</h3>
                                <p style={{ color: '#666' }}>
                                    {event.date} • {event.location}
                                </p>
                                <p style={{ marginTop: 8 }}>
                                    <span style={{ fontWeight: 'bold' }}>{event.price}€</span>
                                    <span style={{ color: '#666', marginLeft: 16 }}>
                                        {event.ticketsSold || 0} / {event.totalPlaces} billets vendus
                                    </span>
                                </p>
                            </div>
                            <div style={{ display: 'flex', gap: 8 }}>
                                <Link 
                                    to={`/organizer/events/${event.id}/edit`}
                                    style={{
                                        padding: '8px 16px',
                                        background: '#007bff',
                                        color: 'white',
                                        textDecoration: 'none',
                                        borderRadius: 4
                                    }}
                                >
                                    Modifier
                                </Link>
                                <button 
                                    onClick={() => handleDelete(event.id)}
                                    style={{
                                        padding: '8px 16px',
                                        background: '#dc3545',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: 4,
                                        cursor: 'pointer'
                                    }}
                                >
                                    Supprimer
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}