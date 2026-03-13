import { Link, useLocation } from "react-router-dom"
import { LayoutDashboard, Sprout, FlaskConical, Syringe, Bug, Users, Truck, FileText, LogOut, Menu } from "lucide-react"
import { cn } from "../../lib/utils"
import { useAuth } from "../../contexts/AuthContext"
import { useState } from "react"

const navItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Seeds Inventory", href: "/seeds", icon: Sprout },
  { name: "Fertilizers", href: "/fertilizers", icon: FlaskConical },
  { name: "Vet & Chemicals", href: "/vet-chemicals", icon: Syringe },
  { name: "Pesticides", href: "/pesticides", icon: Bug },
  { name: "Recipients", href: "/recipients", icon: Users },
  { name: "Distribution", href: "/distribution", icon: Truck },
  { name: "Reports", href: "/reports", icon: FileText },
]

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const { signOut } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden print:h-auto print:overflow-visible print:bg-white">
      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 bg-[#1b3b2b] text-white transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 print:hidden",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex h-16 items-center px-6 border-b border-white/10">
          <h1 className="text-lg font-bold tracking-wider text-green-400">AGRI-SUPPLY IMS</h1>
        </div>
        <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-colors",
                  isActive
                    ? "bg-[#2e5e45] text-white"
                    : "text-gray-300 hover:bg-[#2e5e45]/50 hover:text-white"
                )}
              >
                <item.icon className={cn("mr-3 h-5 w-5 flex-shrink-0", isActive ? "text-green-400" : "text-gray-400")} />
                {item.name}
              </Link>
            )
          })}
        </nav>
        <div className="p-4 border-t border-white/10">
          <button
            onClick={signOut}
            className="flex w-full items-center px-3 py-2.5 text-sm font-medium text-gray-300 rounded-md hover:bg-[#2e5e45]/50 hover:text-white transition-colors"
          >
            <LogOut className="mr-3 h-5 w-5 text-gray-400" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden print:overflow-visible">
        <header className="flex h-16 items-center justify-between border-b bg-white px-4 sm:px-6 lg:px-8 print:hidden">
          <div className="flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="mr-4 text-gray-500 hover:text-gray-700 lg:hidden"
            >
              <Menu className="h-6 w-6" />
            </button>
            <h2 className="text-xl font-semibold text-[#004d40]">Agricultural Supply Inventory</h2>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 print:overflow-visible print:p-0">
          {children}
        </main>
      </div>
      
      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  )
}
