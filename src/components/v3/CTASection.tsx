'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ContactForm } from '../ContactForm';
import { Particles, Confetti, FloatingParticles } from '../motion/Particles';
import { TypewriterText } from '../motion/RevealText';

interface CTASectionProps {
  paragraphs: string[];
  buttonText: string;
  subtext: string;
  signature: string;
  onSubmit: (data: { name: string; email: string; phone: string }) => Promise<void>;
  isSubmitting: boolean;
}

export function CTASection({
  paragraphs,
  buttonText,
  subtext,
  signature,
  onSubmit,
  isSubmitting,
}: CTASectionProps) {
  const [textComplete, setTextComplete] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleTextComplete = () => {
    setTextComplete(true);
    setTimeout(() => setFormVisible(true), 500);
  };

  const handleSubmit = async (data: { name: string; email: string; phone: string }) => {
    await onSubmit(data);
    setFormSubmitted(true);
  };

  return (
    <div className="relative space-y-8">
      {/* Floating background particles */}
      <FloatingParticles trigger={true} />

      {/* Headline with typewriter effect */}
      <div className="text-center">
        <h2 className="text-white text-2xl font-semibold mb-4">
          <TypewriterText
            text="¿Querés saber si esto es para vos?"
            speed={0.04}
            onComplete={handleTextComplete}
          />
        </h2>
      </div>

      {/* Paragraphs */}
      <AnimatePresence>
        {textComplete && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            {paragraphs.map((paragraph, index) => (
              <motion.p
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.4 }}
                className="text-[#d0d0d0] text-base leading-relaxed"
              >
                {paragraph}
              </motion.p>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Form section */}
      <AnimatePresence mode="wait">
        {formVisible && !formSubmitted && (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 25,
            }}
            className="space-y-6"
          >
            {/* Class header - same as V2 */}
            <div className="text-center space-y-3">
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#C9A227]/10 rounded-full border border-[#C9A227]/20"
                animate={{
                  boxShadow: [
                    '0 0 0px rgba(201, 162, 39, 0)',
                    '0 0 20px rgba(201, 162, 39, 0.3)',
                    '0 0 0px rgba(201, 162, 39, 0)',
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <svg className="w-4 h-4 text-[#C9A227]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-[#C9A227] text-sm font-medium uppercase tracking-wide">Clase Gratuita</span>
              </motion.div>
              <h3 className="text-white text-xl font-semibold">
                El ABC del Closer Profesional
              </h3>
            </div>

            {/* Benefits list */}
            <div className="bg-white/[0.02] rounded-xl p-5 border border-white/5">
              <p className="text-[#a0a0a0] text-sm mb-4">En esta clase vas a descubrir:</p>
              <ul className="space-y-3">
                {['Cómo funcionan las llamadas de cierre', 'El paso a paso para empezar desde cero', 'Si esto realmente es para vos'].map((item, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <svg className="w-5 h-5 text-[#C9A227] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-white/90 text-sm">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-[#606060] text-xs uppercase tracking-wider">Acceso inmediato</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            {/* Form */}
            <div className="space-y-4">
              <p className="text-center text-[#a0a0a0] text-sm">
                Ingresá tus datos para acceder:
              </p>
              <ContactForm
                onSubmit={handleSubmit}
                buttonText="ACCEDER A LA CLASE GRATIS"
                isSubmitting={isSubmitting}
              />
            </div>

            {/* Subtext */}
            <p className="text-center text-[#808080] text-sm">{subtext}</p>
          </motion.div>
        )}

        {formSubmitted && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-6 py-8"
          >
            <Confetti trigger={true} />

            <motion.div
              className="w-24 h-24 mx-auto bg-[#C9A227]/10 rounded-full flex items-center justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <motion.svg
                className="w-12 h-12 text-[#C9A227]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </motion.svg>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-2"
            >
              <h3 className="text-white text-2xl font-bold">¡Listo! Ya tenés acceso</h3>
              <p className="text-[#a0a0a0]">
                Revisá tu correo. Te enviamos el link a la clase.
              </p>
              <p className="text-[#606060] text-sm">
                También te abrimos el calendario por si querés agendar ahora.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Signature */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: formVisible ? 1 : 0 }}
        transition={{ delay: 1 }}
        className="pt-8 border-t border-white/5"
      >
        <p className="text-center text-[#606060] text-sm font-medium">
          {signature}
        </p>
      </motion.div>
    </div>
  );
}
