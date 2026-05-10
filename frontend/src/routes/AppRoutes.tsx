import { Routes, Route, Navigate } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import { useAuth } from '../contexts/AuthContext'

const Home = lazy(() => import('../pages/Home'))
const Login = lazy(() => import('../pages/Login'))
const Register = lazy(() => import('../pages/Register'))
const EventDetailPage = lazy(() => import('../pages/EventDetailPage'))
const Profile = lazy(() => import('../pages/Profile'))
const MyTickets = lazy(() => import('../pages/MyTickets'))
const Dashboard = lazy(() => import('../pages/organizer/Dashboard'))
const MyEvents = lazy(() => import('../pages/organizer/MyEvents'))
const CreateEvent = lazy(() => import('../pages/organizer/CreateEvent'))
const EditEvent = lazy(() => import('../pages/organizer/EditEvent'))

function PrivateRoute({ children, role }: { children: JSX.Element; role?: string }) {
    const { user } = useAuth()
    if (!user) return <Navigate to="/login" replace />
    if (role && user.role !== role) return <Navigate to="/" replace />
    return children
}

export default function AppRoutes() {
    return (
        <Suspense fallback={<div>Chargement...</div>}>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/events/:id" element={<EventDetailPage />} />
                <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
                <Route path="/my-tickets" element={<PrivateRoute><MyTickets /></PrivateRoute>} />
                <Route path="/organizer/dashboard" element={<PrivateRoute role="organizer"><Dashboard /></PrivateRoute>} />
                <Route path="/organizer/events" element={<PrivateRoute role="organizer"><MyEvents /></PrivateRoute>} />
                <Route path="/organizer/events/new" element={<PrivateRoute role="organizer"><CreateEvent /></PrivateRoute>} />
                <Route path="/organizer/events/:id/edit" element={<PrivateRoute role="organizer"><EditEvent /></PrivateRoute>} />
                <Route path="*" element={<div>404 - Page non trouvée</div>} />
            </Routes>
        </Suspense>
    )
}