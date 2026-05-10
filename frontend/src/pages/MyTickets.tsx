import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

interface Ticket {
    id: string
    status: 'valid' | 'used' | 'cancelled'
    purchaseDate: string
    event: {
        id: number
        title: string
        date: string
        location: string
    }
}

export default function MyTickets() {
    const [tickets, setTickets] = useState<Ticket[]>([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState<string>('all')

    useEffect(() => {
        const token = localStorage.getItem('token')
        fetch('http://localhost:3000/tickets', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => {
                setTickets(data.tickets || data)
                setLoading(false)
            })
            .catch(() => setLoading(false))
    }, [])

    const filteredTickets = tickets.filter(t => 
        filter === 'all' || t.status === filter
    )

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'valid': return '#28a745'
            case 'used': return '#6c757d'
            case 'cancelled': return '#dc3545'
            default: return '#666'
        }
    }

    const getStatusText = (status: string) => {
        switch (status) {
            case 'valid': return 'Valide'
            case 'used': return 'Utilisé'
            case 'cancelled': return 'Annulé'
            default: return status
        }
    }

    if (loading) return <div style={{ padding: 20 }}>Chargement...</div>

    return (
        <div style={{ maxWidth: 800, margin: '0 auto', padding: 20 }}>
            <h1>Mes Billets</h1>

            <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
                {['all', 'valid', 'used', 'cancelled'].map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        style={{
                            padding: '8px 16px',
                            border: '1px solid #ddd',
                            background: filter === f ? '#007bff' : 'white',
                            color: filter === f ? 'white' : '#333',
                            borderRadius: 4,
                            cursor: 'pointer'
                        }}
                    >
                        {f === 'all' ? 'Tous' : getStatusText(f)}
                    </button>
                ))}
            </div>

            {filteredTickets.length === 0 ? (
                <p style={{ marginTop: 20, color: '#666' }}>Aucun billet</p>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 20 }}>
                    {filteredTickets.map(ticket => (
                        <div 
                            key={ticket.id} 
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
                                <h3>{ticket.event.title}</h3>
                                <p style={{ color: '#666' }}>
                                    {ticket.event.date} • {ticket.event.location}
                                </p>
                                <p style={{ fontSize: 14, color: '#999', marginTop: 8 }}>
                                    Achet�� le: {ticket.purchaseDate}
                                </p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <span style={{ 
                                    background: getStatusColor(ticket.status),
                                    color: 'white',
                                    padding: '4px 12px',
                                    borderRadius: 4,
                                    fontSize: 14
                                }}>
                                    {getStatusText(ticket.status)}
                                </span>
                                <Link 
                                    to={`/events/${ticket.event.id}`}
                                    style={{ 
                                        display: 'block', 
                                        marginTop: 8,
                                        color: '#007bff'
                                    }}
                                >
                                    Voir l'événement
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}