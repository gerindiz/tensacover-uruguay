import { useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/components/features/hero/Hero';
import { Gallery } from '@/components/features/gallery/Gallery';
import { ContactForm } from '@/components/features/contact-form/ContactForm';
import { VideoModal } from '@/components/features/video-modal/VideoModal';
import { WhatsAppButton } from '@/components/features/whatsapp-button/WhatsAppButton';
import { TentCard } from '@/components/features/tent-catalog/TentCard';
import { TentDetail } from '@/components/features/tent-catalog/TentDetail';
import { useTents } from '@/hooks/useTents';

// ─── REEMPLAZÁ ESTE ID con el ID de tu video de YouTube ─────────────────────
// Ejemplo: si tu URL es https://www.youtube.com/watch?v=ABC123
// entonces el ID es "ABC123"
const YOUTUBE_VIDEO_ID = 'REEMPLAZA_CON_TU_VIDEO_ID';
// ────────────────────────────────────────────────────────────────────────────

export default function HomePage() {
  const { tents, isLoading } = useTents();
  const [selectedModel, setSelectedModel] = useState<number | null>(null);
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  const selectedTent = selectedModel !== null ? tents[selectedModel] : null;
  const selectedModelName = selectedTent?.title ?? 'General';

  return (
    <div className="min-h-screen font-sans">
      <Header />

      <AnimatePresence>
        {isVideoOpen && (
          <VideoModal
            isOpen={isVideoOpen}
            onClose={() => setIsVideoOpen(false)}
            videoId={YOUTUBE_VIDEO_ID}
          />
        )}
      </AnimatePresence>

      <Hero onOpenVideo={() => setIsVideoOpen(true)} />

      {/* Catálogo de Modelos */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" id="modelos">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Nuestros Modelos</h2>
          <div className="w-20 h-1.5 bg-primary mx-auto rounded-full" />
          <p className="mt-6 text-slate-600 max-w-xl mx-auto">
            Seleccioná la estructura que mejor se adapte a tu evento. Todas nuestras carpas son 100%
            impermeables y resistentes al viento.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-3xl h-96 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tents.map((tent, idx) => (
              <TentCard
                key={tent.id}
                tent={tent}
                onViewDetails={() => setSelectedModel(idx)}
              />
            ))}
          </div>
        )}

        <TentDetail
          tent={selectedTent}
          onClose={() => setSelectedModel(null)}
        />
      </section>

      <Gallery />

      <ContactForm selectedModel={selectedModelName} />

      <Footer />

      <WhatsAppButton />
    </div>
  );
}
