import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next"
import { destroyCookie, parseCookies } from "nookies"
import { AuthTokenError } from "../errors/authTokenError"
import decode from "jwt-decode"
import { ValidateUserPermissions } from "./validateUserPermissions"

type withSSROptions = {
  permissions?: string[]
  roles?: string[]
}

export function withSSRAuth<T>(fn: GetServerSideProps<T>, options?: withSSROptions): GetServerSideProps {
  return async (ctx: GetServerSidePropsContext): Promise<GetServerSidePropsResult<T>> => {
    const cookies = parseCookies(ctx)
    const token = cookies['nextauth.token']

    if (!token) {
      return {
        redirect: {
          destination: '/dashboard',
          permanent: false
        }
      }
    }

    if (options) {
      const user = decode<{ permissions: string[], roles: string[] }>(token)

      const { permissions, roles } = options
  
      const userHasValidaPermissions = ValidateUserPermissions({ user, permissions, roles })

      if (!userHasValidaPermissions) {
        return {
          redirect: {
            destination: '/dashboard',
            permanent: false
          }
        }
      }
    }

    try {
      return await fn(ctx)
    } catch (error) {
      if (error instanceof AuthTokenError) {
        destroyCookie(ctx, 'nextauth.token')
        destroyCookie(ctx, 'nextauth.refresh')
  
        return {
          redirect: {
            destination: '/',
            permanent: false
          }
        }
      }
    }
  }
}
