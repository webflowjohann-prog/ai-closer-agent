import { motion } from 'framer-motion'
import { Eye } from 'lucide-react'

interface BrandPreviewProps {
  brandName: string
  brandColor: string
  logoUrl?: string
  loginBgUrl?: string
  fontFamily: string
}

export function BrandPreview({ brandName, brandColor, logoUrl, loginBgUrl, fontFamily }: BrandPreviewProps) {
  // Derive a lighter tint for backgrounds
  const colorToRgb = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    return { r, g, b }
  }

  const getAccentLight = () => {
    try {
      const { r, g, b } = colorToRgb(brandColor)
      return `rgba(${r},${g},${b},0.12)`
    } catch {
      return 'rgba(92,124,250,0.12)'
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1.5">
        <Eye className="w-3.5 h-3.5 text-[var(--text-tertiary)]" />
        <p className="text-xs font-medium text-[var(--text-secondary)]">Aperçu de la page de connexion</p>
      </div>

      {/* Mini login page mockup */}
      <motion.div
        layout
        className="relative w-full rounded-xl overflow-hidden border border-[var(--border-default)] shadow-lg"
        style={{ aspectRatio: '16/10' }}
      >
        {/* Background */}
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: loginBgUrl ? undefined : '#f8f9fa',
            backgroundImage: loginBgUrl ? `url(${loginBgUrl})` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        {loginBgUrl && <div className="absolute inset-0 bg-black/30" />}

        {/* Login card */}
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <motion.div
            layout
            className="w-full max-w-[180px] bg-white rounded-xl shadow-xl p-4 space-y-3"
            style={{ fontFamily }}
          >
            {/* Logo area */}
            <div className="flex justify-center">
              {logoUrl ? (
                <img src={logoUrl} alt="Logo" className="h-6 object-contain" />
              ) : (
                <div
                  className="h-5 rounded-md flex items-center justify-center px-2"
                  style={{ backgroundColor: getAccentLight() }}
                >
                  <span
                    className="text-[9px] font-bold tracking-wide"
                    style={{ color: brandColor, fontFamily }}
                  >
                    {brandName || 'Votre marque'}
                  </span>
                </div>
              )}
            </div>

            {/* Welcome text */}
            <div className="text-center space-y-0.5">
              <p className="text-[8px] font-semibold text-gray-800" style={{ fontFamily }}>
                Connexion
              </p>
              <p className="text-[6px] text-gray-400" style={{ fontFamily }}>
                Accédez à votre espace
              </p>
            </div>

            {/* Fake inputs */}
            <div className="space-y-1.5">
              <div className="h-5 bg-gray-100 rounded-md border border-gray-200 px-2 flex items-center">
                <span className="text-[6px] text-gray-400">Email</span>
              </div>
              <div className="h-5 bg-gray-100 rounded-md border border-gray-200 px-2 flex items-center">
                <span className="text-[6px] text-gray-400">Mot de passe</span>
              </div>
            </div>

            {/* CTA button */}
            <div
              className="h-5 rounded-md flex items-center justify-center"
              style={{ backgroundColor: brandColor }}
            >
              <span className="text-[7px] font-semibold text-white" style={{ fontFamily }}>
                Se connecter
              </span>
            </div>

            {/* Footer */}
            <p className="text-center text-[5px] text-gray-400" style={{ fontFamily }}>
              Propulsé par {brandName || 'votre marque'}
            </p>
          </motion.div>
        </div>
      </motion.div>

      <p className="text-[10px] text-[var(--text-tertiary)] text-center">
        Aperçu en temps réel — modifiez les champs à gauche
      </p>
    </div>
  )
}
