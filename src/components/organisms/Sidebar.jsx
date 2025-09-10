import React, { useState } from "react"
import { NavLink, useLocation } from "react-router-dom"
import { motion } from "framer-motion"
import { cn } from "@/utils/cn"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"

const Sidebar = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const location = useLocation()

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: "BarChart3" },
    { name: "Contacts", href: "/contacts", icon: "Users" },
    { name: "Deals", href: "/deals", icon: "Target" },
    { name: "Activities", href: "/activities", icon: "Activity" },
  ]

  const closeMobile = () => setIsMobileOpen(false)

  const DesktopSidebar = () => (
    <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-white border-r border-slate-200 shadow-soft">
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-3 px-6 py-8 border-b border-slate-200">
          <div className="bg-gradient-to-br from-primary-600 to-primary-700 p-2 rounded-xl">
            <ApperIcon name="Zap" className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold gradient-text">PipelineCore</h1>
            <p className="text-xs text-slate-500">CRM Application</p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href
            return (
              <NavLink
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 relative",
                  isActive
                    ? "bg-gradient-to-r from-primary-50 to-primary-100 text-primary-700 shadow-soft"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                )}
              >
                <ApperIcon name={item.icon} className="h-5 w-5" />
                <span>{item.name}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute right-2 w-2 h-2 bg-primary-600 rounded-full"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </NavLink>
            )
          })}
        </nav>

        <div className="p-4 border-t border-slate-200">
          <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg p-4">
            <h3 className="font-semibold text-slate-900 mb-1">Need Help?</h3>
            <p className="text-xs text-slate-600 mb-3">
              Check our documentation for guides and tutorials.
            </p>
            <Button variant="secondary" size="sm" className="w-full">
              <ApperIcon name="HelpCircle" className="h-4 w-4" />
              Support
            </Button>
          </div>
        </div>
      </div>
    </div>
  )

  const MobileSidebar = () => (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="secondary"
          size="md"
          onClick={() => setIsMobileOpen(true)}
          className="shadow-premium"
        >
          <ApperIcon name="Menu" className="h-5 w-5" />
        </Button>
      </div>

      {/* Mobile sidebar overlay */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div 
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={closeMobile}
          />
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", bounce: 0, duration: 0.3 }}
            className="fixed inset-y-0 left-0 w-64 bg-white shadow-2xl"
          >
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between px-6 py-6 border-b border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-br from-primary-600 to-primary-700 p-2 rounded-xl">
                    <ApperIcon name="Zap" className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold gradient-text">PipelineCore</h1>
                    <p className="text-xs text-slate-500">CRM Application</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={closeMobile}>
                  <ApperIcon name="X" className="h-5 w-5" />
                </Button>
              </div>

              <nav className="flex-1 px-4 py-6 space-y-2">
                {navigation.map((item) => {
                  const isActive = location.pathname === item.href
                  return (
                    <NavLink
                      key={item.name}
                      to={item.href}
                      onClick={closeMobile}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 relative",
                        isActive
                          ? "bg-gradient-to-r from-primary-50 to-primary-100 text-primary-700 shadow-soft"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                      )}
                    >
                      <ApperIcon name={item.icon} className="h-5 w-5" />
                      <span>{item.name}</span>
                      {isActive && (
                        <div className="absolute right-2 w-2 h-2 bg-primary-600 rounded-full" />
                      )}
                    </NavLink>
                  )
                })}
              </nav>
            </div>
          </motion.div>
        </div>
      )}
    </>
  )

  return (
    <>
      <DesktopSidebar />
      <MobileSidebar />
    </>
  )
}

export default Sidebar