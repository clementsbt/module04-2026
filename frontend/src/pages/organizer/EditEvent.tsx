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
    category: string
    imageUrl: string
}

export default function EditEvent() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const [form, setForm] = useState({
        title: '',
        description: '',
        date: '',
        time: '',
        location: '',
        city: '',
        price: '',
        totalPlaces: '',
        category: 'concert',
        imageUrl: ''
    })
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [loading, setLoading] = useState(false)
    const [initialLoading, setInitialLoading] = useState(true)

    const categories = [
        { value: 'concert', label: 'Concert' },
        { value: 'theater', label: 'Théâtre' },
        { value: 'sport', label: 'Sport' },
        { value: 'exhibition', label: 'Exposition' },
        { value: 'festival', label: 'Festival' },
        { value: 'other', label: 'Autre' }
    ]

    useEffect(() => {
        const token = localStorage.getItem('token')
        fetch(`http://localhost:3000/events/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => {
                const event = data.event || data
                const [date, time] = event.date.split('T')
                setForm({
                    title: event.title || '',
                    description: event.description || '',
                    date: date || '',
                    time: time ? time.slice(0, 5) : '',
                    location: event.location || '',
                    city: event.city || '',
                    price: event.price?.toString() || '',
                    totalPlaces: event.totalPlaces?.toString() || '',
                    category: event.category || 'concert',
                    imageUrl: event.imageUrl || ''
                })
                setInitialLoading(false)
            })
            .catch(() => setInitialLoading(false))
    }, [id])

    const validate = () => {
        const newErrors: Record<string, string> = {}
        
        if (!form.title.trim()) newErrors.title = 'Le titre est requis'
        if (!form.description.trim()) newErrors.description = 'La description est requise'
        if (!form.date) newErrors.date = 'La date est requise'
        if (!form.time) newErrors.time = 'L\'heure est requise'
        if (!form.location.trim()) newErrors.location = 'Le lieu est requis'
        if (!form.city.trim()) newErrors.city = 'La ville est requise'
        if (!form.price || parseFloat(form.price) < 0) newErrors.price = 'Le prix est requis'
        if (!form.totalPlaces || parseInt(form.totalPlaces) < 1) newErrors.totalPlaces = 'Le nombre de places est requis'
        
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
        const token = localStorage.getItem('token')
        
        try {
            const res = await fetch(`http://localhost:3000/events/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    title: form.title,
                    description: form.description,
                    date: `${form.date}T${form.time}:00`,
                    location: form.location,
                    city: form.city,
                    price: parseFloat(form.price),
                    totalPlaces: parseInt(form.totalPlaces),
                    category: form.category,
                    imageUrl: form.imageUrl
                })
            })
            
            if (res.ok) {
                navigate('/organizer/events')
            } else {
                const data = await res.json()
                setErrors({ submit: data.message || 'Erreur lors de la modification' })
            }
        } catch {
            setErrors({ submit: 'Erreur de connexion' })
        } finally {
            setLoading(false)
        }
    }

    if (initialLoading) return <div style={{ padding: 20 }}>Chargement...</div>

    return (
        <div style={{ maxWidth: 600, margin: '0 auto', padding: 20 }}>
            <h1>Modifier l'événement</h1>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 24 }}>
                <div>
                    <label htmlFor="title">Titre *</label>
                    <input
                        id="title"
                        name="title"
                        type="text"
                        value={form.title}
                        onChange={handleChange}
                        style={{ display: 'block', width: '100%', padding: 8, marginTop: 4 }}
                    />
                    {errors.title && <span style={{ color: 'red', fontSize: 14 }}>{errors.title}</span>}
                </div>

                <div>
                    <label htmlFor="description">Description *</label>
                    <textarea
                        id="description"
                        name="description"
                        rows={4}
                        value={form.description}
                        onChange={handleChange}
                        style={{ display: 'block', width: '100%', padding: 8, marginTop: 4 }}
                    />
                    {errors.description && <span style={{ color: 'red', fontSize: 14 }}>{errors.description}</span>}
                </div>

                <div style={{ display: 'flex', gap: 16 }}>
                    <div style={{ flex: 1 }}>
                        <label htmlFor="date">Date *</label>
                        <input
                            id="date"
                            name="date"
                            type="date"
                            value={form.date}
                            onChange={handleChange}
                            style={{ display: 'block', width: '100%', padding: 8, marginTop: 4 }}
                        />
                        {errors.date && <span style={{ color: 'red', fontSize: 14 }}>{errors.date}</span>}
                    </div>
                    <div style={{ flex: 1 }}>
                        <label htmlFor="time">Heure *</label>
                        <input
                            id="time"
                            name="time"
                            type="time"
                            value={form.time}
                            onChange={handleChange}
                            style={{ display: 'block', width: '100%', padding: 8, marginTop: 4 }}
                        />
                        {errors.time && <span style={{ color: 'red', fontSize: 14 }}>{errors.time}</span>}
                    </div>
                </div>

                <div style={{ display: 'flex', gap: 16 }}>
                    <div style={{ flex: 1 }}>
                        <label htmlFor="location">Lieu *</label>
                        <input
                            id="location"
                            name="location"
                            type="text"
                            value={form.location}
                            onChange={handleChange}
                            style={{ display: 'block', width: '100%', padding: 8, marginTop: 4 }}
                        />
                        {errors.location && <span style={{ color: 'red', fontSize: 14 }}>{errors.location}</span>}
                    </div>
                    <div style={{ flex: 1 }}>
                        <label htmlFor="city">Ville *</label>
                        <input
                            id="city"
                            name="city"
                            type="text"
                            value={form.city}
                            onChange={handleChange}
                            style={{ display: 'block', width: '100%', padding: 8, marginTop: 4 }}
                        />
                        {errors.city && <span style={{ color: 'red', fontSize: 14 }}>{errors.city}</span>}
                    </div>
                </div>

                <div style={{ display: 'flex', gap: 16 }}>
                    <div style={{ flex: 1 }}>
                        <label htmlFor="price">Prix (€) *</label>
                        <input
                            id="price"
                            name="price"
                            type="number"
                            step="0.01"
                            min="0"
                            value={form.price}
                            onChange={handleChange}
                            style={{ display: 'block', width: '100%', padding: 8, marginTop: 4 }}
                        />
                        {errors.price && <span style={{ color: 'red', fontSize: 14 }}>{errors.price}</span>}
                    </div>
                    <div style={{ flex: 1 }}>
                        <label htmlFor="totalPlaces">Places totales *</label>
                        <input
                            id="totalPlaces"
                            name="totalPlaces"
                            type="number"
                            min="1"
                            value={form.totalPlaces}
                            onChange={handleChange}
                            style={{ display: 'block', width: '100%', padding: 8, marginTop: 4 }}
                        />
                        {errors.totalPlaces && <span style={{ color: 'red', fontSize: 14 }}>{errors.totalPlaces}</span>}
                    </div>
                </div>

                <div>
                    <label htmlFor="category">Catégorie *</label>
                    <select
                        id="category"
                        name="category"
                        value={form.category}
                        onChange={handleChange}
                        style={{ display: 'block', width: '100%', padding: 8, marginTop: 4 }}
                    >
                        {categories.map(cat => (
                            <option key={cat.value} value={cat.value}>{cat.label}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="imageUrl">URL de l'image de couverture</label>
                    <input
                        id="imageUrl"
                        name="imageUrl"
                        type="url"
                        value={form.imageUrl}
                        onChange={handleChange}
                        placeholder="https://..."
                        style={{ display: 'block', width: '100%', padding: 8, marginTop: 4 }}
                    />
                </div>

                {form.imageUrl && (
                    <div>
                        <p style={{ fontSize: 14, color: '#666' }}>Aperçu:</p>
                        <img 
                            src={form.imageUrl} 
                            alt="Aperçu" 
                            style={{ maxWidth: '100%', maxHeight: 200, borderRadius: 8 }}
                            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                        />
                    </div>
                )}

                {errors.submit && (
                    <div style={{ color: 'red', padding: 8, background: '#ffe6e6', borderRadius: 4 }}>
                        {errors.submit}
                    </div>
                )}

                <button type="submit" disabled={loading} style={{ padding: '12px', fontSize: 16, cursor: 'pointer' }}>
                    {loading ? 'Enregistrement...' : 'Enregistrer les modifications'}
                </button>
            </form>
        </div>
    )
}