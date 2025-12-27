'use client';

import { useState } from 'react';

interface ContactFormProps {
  onSubmit: (data: { name: string; email: string; phone: string }) => Promise<void>;
  buttonText?: string;
  isSubmitting?: boolean;
}

export function ContactForm({ onSubmit, buttonText = 'Enviar', isSubmitting = false }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'El nombre debe tener al menos 2 caracteres';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El correo es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Ingresa un correo válido';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'El teléfono es requerido';
    } else if (!/^[\d\s\-+()]{8,}$/.test(formData.phone)) {
      newErrors.phone = 'Ingresa un teléfono válido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || isSubmitting) return;
    await onSubmit(formData);
  };

  const handleChange = (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const inputClasses = (hasError: boolean) => `
    w-full px-4 py-3.5
    bg-white/5 border ${hasError ? 'border-red-500/50' : 'border-white/10'}
    rounded-xl text-white placeholder-[#606060]
    focus:outline-none focus:border-[#C9A227]/50 focus:ring-1 focus:ring-[#C9A227]/30
    transition-all duration-300
  `;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <input
          type="text"
          placeholder="Tu nombre"
          value={formData.name}
          onChange={handleChange('name')}
          className={inputClasses(!!errors.name)}
          disabled={isSubmitting}
        />
        {errors.name && (
          <p className="mt-1.5 text-red-400 text-sm">{errors.name}</p>
        )}
      </div>

      <div>
        <input
          type="email"
          placeholder="Tu correo electrónico"
          value={formData.email}
          onChange={handleChange('email')}
          className={inputClasses(!!errors.email)}
          disabled={isSubmitting}
        />
        {errors.email && (
          <p className="mt-1.5 text-red-400 text-sm">{errors.email}</p>
        )}
      </div>

      <div>
        <input
          type="tel"
          placeholder="Tu teléfono (con código de país)"
          value={formData.phone}
          onChange={handleChange('phone')}
          className={inputClasses(!!errors.phone)}
          disabled={isSubmitting}
        />
        {errors.phone && (
          <p className="mt-1.5 text-red-400 text-sm">{errors.phone}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className={`
          group relative w-full py-4 px-8 mt-2
          bg-[#C9A227] hover:bg-[#d4ad2e]
          text-black font-semibold text-lg
          rounded-xl
          transition-all duration-300 ease-out
          shadow-[0_4px_20px_rgba(201,162,39,0.3)]
          hover:shadow-[0_8px_40px_rgba(201,162,39,0.4)]
          active:shadow-[0_2px_10px_rgba(201,162,39,0.3)]
          hover:scale-[1.02] active:scale-[0.97]
          focus:outline-none focus:ring-2 focus:ring-[#C9A227] focus:ring-offset-2 focus:ring-offset-[#0a0a0a]
          flex items-center justify-center gap-3
          disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100
        `}
      >
        {isSubmitting ? (
          <>
            <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
            Enviando...
          </>
        ) : (
          <>
            {buttonText}
            <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </>
        )}
      </button>
    </form>
  );
}
