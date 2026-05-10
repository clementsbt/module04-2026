import { useState, useEffect } from 'react'

interface Event {
    id: number
    title: string
    date: string
    location: string
    price: number
}

export default function Home() {
    const [events, setEvents] = useState<Event[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch('http://localhost:3001/events')
            .then(res => res.json())
            .then(data => {
                setEvents(data)
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 20 }}>
                {events.map(event => (
                    <div key={event.id} style={{ border: '1px solid #ddd', padding: 16, borderRadius: 8 }}>
                        <h3>{event.title}</h3>
                        <p>{event.date} • {event.location}</p>
                        <p style={{ fontWeight: 'bold' }}>{event.price}€</p>
                    </div>
                ))}
            </div>
        </div>
    )
}