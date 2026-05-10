import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

interface Event {
    id: number
    title: string
    date: string
    location: string
    city: string
    price: number
    category: string
}

export default function Home() {
    const [events, setEvents] = useState<Event[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch('http://localhost:3000/events')
            .then(res => res.json())
            .then(data => {
                setEvents(data.events || [])
                setLoading(false)
            })
            .catch(() => setLoading(false))
    }, [])

    if (loading) {
        return <div style={{ padding: 20 }}>Chargement...</div>
    }

    return (
        <div style={{ padding: 20 }}>
            <h1>Événements</h1>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16, marginTop: 20 }}>
                {events.map(event => (
                    <Link 
                        key={event.id} 
                        to={`/events/${event.id}`}
                        style={{ 
                            textDecoration: 'none', 
                            color: 'inherit',
                            border: '1px solid #ddd', 
                            padding: 16, 
                            borderRadius: 8,
                            transition: 'box-shadow 0.2s'
                        }}
                    >
                        <h3>{event.title}</h3>
                        <p>{event.date} • {event.location}</p>
                        <p>{event.city}</p>
                        <p style={{ fontWeight: 'bold' }}>{event.price}€</p>
                    </Link>
                ))}
            </div>
        </div>
    )
}