import { NextResponse, type NextRequest } from 'next/server'
import { match } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'
import { defaultLocale, hasLocale, locales, localePath, LOCALE_COOKIE, type Locale } from '@/i18n/config'
import { updateSession } from '@/lib/supabase/middleware'

const UM_ANO = 60 * 60 * 24 * 365

function detectarIdioma(request: NextRequest): Locale {
  const cookie = request.cookies.get(LOCALE_COOKIE)?.value
  if (hasLocale(cookie)) return cookie

  const languages = new Negotiator({
    headers: { 'accept-language': request.headers.get('accept-language') ?? '' },
  }).languages()

  try {
    return match(languages, locales, defaultLocale) as Locale
  } catch {
    // Accept-Language inválido ou '*'
    return defaultLocale
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const primeiroSegmento = pathname.split('/')[1]

  // Caminho sem idioma (/dashboard, /login?error=oauth, links antigos de e-mail...):
  // redireciona para a mesma rota com prefixo, preservando a query string.
  if (!hasLocale(primeiroSegmento)) {
    const url = request.nextUrl.clone()
    url.pathname = localePath(detectarIdioma(request), pathname)
    return NextResponse.redirect(url)
  }

  const response = await updateSession(request)

  // Lembra o idioma da URL atual para os próximos acessos sem prefixo.
  if (request.cookies.get(LOCALE_COOKIE)?.value !== primeiroSegmento) {
    response.cookies.set(LOCALE_COOKIE, primeiroSegmento, { path: '/', maxAge: UM_ANO, sameSite: 'lax' })
  }

  return response
}

export const config = {
  // Ignora route handlers de auth, assets do Next e arquivos estáticos (fontes, imagens...).
  matcher: ['/((?!api|auth|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
}
