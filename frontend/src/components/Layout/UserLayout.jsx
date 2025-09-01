import Header from '../Common/Header'
import Footer from '../Common/Footer'
import { Outlet } from 'react-router-dom'

function UserLayout() {
  return (
    <div>
      
      {/* Header */}
      <Header />

      {/* Main Component */}
      <main>
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default UserLayout
