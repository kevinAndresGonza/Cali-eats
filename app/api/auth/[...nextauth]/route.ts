import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      // Pasar el user.id al session
      if (session.user) {
        (session.user as any).id = token.sub
      }
      return session
    },
    async jwt({ token, account, profile }) {
      // Persistir datos adicionales al token
      if (account) {
        token.accessToken = account.access_token
      }
      return token
    },
  },
  pages: {
    signIn: "/",
  },
})

export { handler as GET, handler as POST }
