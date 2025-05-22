'use client';

import { useState } from 'react';
import { MiniKit } from '@worldcoin/minikit-js';

interface AgeGateProps {
  onVerified: () => void;
  onCancel: () => void;
}

export default function AgeGate({ onVerified, onCancel }: AgeGateProps) {
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleVerify = async () => {
    setIsVerifying(true);
    setError(null);
    try {
      // Trigger World ID verification via MiniKit
      await MiniKit.commands.verify({ action: 'age_check' });
      onVerified();
    } catch (err) {
      setError('Ocorreu um erro durante a verificação. Por favor, tente novamente.');
      console.error('Age verification error:', err);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-2">Verificação de Idade</h2>
          <p className="text-gray-700">
            Este produto contém álcool e é destinado apenas para maiores de 18 anos.
          </p>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <div className="flex flex-col space-y-3">
          <button
            onClick={handleVerify}
            disabled={isVerifying}
            className="bg-[var(--color-primary)] hover:bg-[var(--color-secondary)] text-white py-3 px-4 rounded-md transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isVerifying ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Verificando...
              </span>
            ) : (
              'Verificar com World ID'
            )}
          </button>
          
          <button
            onClick={onCancel}
            disabled={isVerifying}
            className="border border-gray-300 hover:bg-gray-100 text-gray-700 py-3 px-4 rounded-md transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
