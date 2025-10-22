import { UserRole } from '@/types'

export const USER_ROLES = {
  BUYER: 'buyer' as UserRole,
  SUPPLIER: 'supplier' as UserRole,
  ADMIN: 'admin' as UserRole,
} as const

export function hasRole(userRole: UserRole | undefined, requiredRole: UserRole): boolean {
  if (!userRole) return false
  return userRole === requiredRole
}

export function isAdmin(userRole: UserRole | undefined): boolean {
  return hasRole(userRole, USER_ROLES.ADMIN)
}

export function isBuyer(userRole: UserRole | undefined): boolean {
  return hasRole(userRole, USER_ROLES.BUYER)
}

export function isSupplier(userRole: UserRole | undefined): boolean {
  return hasRole(userRole, USER_ROLES.SUPPLIER)
}

export function getRoleDisplayName(role: UserRole): string {
  const roleNames: Record<UserRole, string> = {
    buyer: 'Buyer',
    supplier: 'Supplier',
    admin: 'Administrator',
  }
  return roleNames[role] || 'Unknown'
}
