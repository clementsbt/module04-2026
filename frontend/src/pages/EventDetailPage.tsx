import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

interface Event {
    id: number
    title: string
    description: string
    date: string
    location: string
    city: string
    price: number
    totalPlaces: number
    availablePlaces: number
    category: string
    imageUrl: string
    organizer: {
        name: string
    }
}

export default function EventDetailPage() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const [event, setEvent] = useState<Event | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch(`http://localhost:3000/events/${id}`)
            .then(res => res.json())
            .then(data => {
                setEvent(data.event || data)
                setLoading(false)
            })
            .catch(() => setLoading(false))
    }, [id])

    const handleBuy = () => {
        const token = localStorage.getItem('token')
        if (!token) {
            navigate('/login')
            return
        }
        fetch('http://localhost:3000/tickets', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ eventId: id })
        })
            .then(res => res.json())
            .then(data => {
                alert('Billet acheté!')
                navigate('/my-tickets')
            })
            .catch(err => alert('Erreur lors de l\'achat'))
    }

    if (loading) return <div style={{ padding: 20 }}>Chargement...</div>
    if (!event) return <div style={{ padding: 20 }}>Événement non trouvé</div>

    return (
        <div style={{ maxWidth: 800, margin: '0 auto', padding: 20 }}>
            {event.imageUrl && (
                <img 
                    src={event.imageUrl} 
                    alt={event.title}
                    style={{ width: '100%', height: 300, objectFit: 'cover', borderRadius: 8 }}
                />
            )}
            
            <h1 style={{ marginTop: 20 }}>{event.title}</h1>
            
            <div style={{ display: 'flex', gap: 20, marginTop: 16, color: '#666' }}>
                <span>📅 {event.date}</span>
                <span>📍 {event.location} ({event.city})</span>
            </div>

            <p style={{ marginTop: 16, fontSize: 18, fontWeight: 'bold' }}>
                {event.price}€
            </p>

            <p style={{ marginTop: 16 }}>
                Places disponibles: {event.availablePlaces} / {event.totalPlaces}
            </p>

            <div style={{ marginTop: 20 }}>
                <span style={{ 
                    background: '#eee', 
                    padding: '4px 12px', 
                    borderRadius: 4,
                    fontSize: 14 
                }}>
                    {event.category}
                </span>
            </div>

            <p style={{ marginTop: 20, lineHeight: 1.6 }}>
                {event.description}
            </p>

            <p style={{ marginTop: 20, color: '#666' }}>
                Organisé par: {event.organizer?.name}
            </p>

            <button 
                onClick={handleBuy}
                disabled={event.availablePlaces === 0}
                style={{
                    marginTop: 24,
                    padding: '12px 32px',
                    fontSize: 16,
                    background: event.availablePlaces > 0 ? '#007bff' : '#ccc',
                    color: 'white',
                    border: 'none',
                    borderRadius: 8,
                    cursor: event.availablePlaces > 0 ? 'pointer' : 'not-allowed'
                }}
            >
                {event.availablePlaces > 0 ? 'Acheter ce billet' : 'Complet'}
            </button>
        </div>
    )
}