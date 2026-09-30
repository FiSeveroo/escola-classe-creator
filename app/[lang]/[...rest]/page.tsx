import { notFound } from 'next/navigation'

// Qualquer rota desconhecida dentro de /[lang] cai no not-found localizado.
export default function CatchAll() {
  notFound()
}
