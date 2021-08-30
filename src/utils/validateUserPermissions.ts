type User = {
  permissions: string[]
  roles: string[]
}

type validateUserPermissionsParams = {
  user: User
  permissions?: string[]
  roles?: string[]
}

export function ValidateUserPermissions ({ user, permissions, roles }:validateUserPermissionsParams) {
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
