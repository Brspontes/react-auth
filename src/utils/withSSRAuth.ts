import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next"
import { destroyCookie, parseCookies } from "nookies"
import { AuthTokenError } from "../errors/authTokenError"
import decode from "jwt-decode"

type withSSROptions = {
  permissions?: string[]
  roles?: string[]
}

export function withSSRAuth<T>(fn: GetServerSideProps<T>, options: withSSROptions): GetServerSideProps {
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

    const user = decode(token)

    console.log(user)

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
