import { useContext } from "react"
import { AuthContext } from "../contexts/AuthContext"

type useCanParams = {
  permissions?: string[]
  roles?: string[]
}

export function useCan({ permissions, roles }: useCanParams) {
  const { user, isAuthenticated } = useContext(AuthContext)

  if (!isAuthenticated) return false

  if (permissions?.length > 0) {
    const hasAllPermissions = permissions.every(permission => {
      return user.permissions.includes(permission)
    })//retorna true caso o usuário retorne todas as permissões
    
    if (!hasAllPermissions) return false
  }

  if (roles?.length > 0) {
    const hasAllRoles = roles.some(role => {
      return user.permissions.includes(role)
    })//retorna true caso o usuário retorne todas as permissões
    
    if (!hasAllRoles) return false
  }

  return true
}
