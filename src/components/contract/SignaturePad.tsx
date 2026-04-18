import React, { useRef, useState, useEffect, useCallback } from 'react';
import { ContractParty } from '../../contexts/ContractContext';

interface SignaturePadProps {
  party: ContractParty;
  onSign: () => void;
  disabled?: boolean;
}

export const SignaturePad: React.FC<SignaturePadProps> = ({ party, onSign, disabled }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size with device pixel ratio for crisp lines
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    // Set drawing style
    ctx.strokeStyle = '#D4AF37';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Add gold gradient effect
    ctx.shadowColor = '#D4AF37';
    ctx.shadowBlur = 4;

    setIsReady(true);
  }, []);

  const getCoordinates = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.offsetWidth / rect.width;
    const scaleY = canvas.offsetHeight / rect.height;

    if ('touches' in e && e.touches.length > 0) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY
      };
    } else if ('clientX' in e) {
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY
      };
    }
    return lastPos;
  }, [lastPos]);

  const startDrawing = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (disabled || party.signed) return;
    e.preventDefault();

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    const { x, y } = getCoordinates(e);
    setLastPos({ x, y });
    ctx.beginPath();
    ctx.moveTo(x, y);
  }, [disabled, party.signed, getCoordinates]);

  const draw = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || disabled || party.signed) return;
    e.preventDefault();

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
    setLastPos({ x, y });
    setHasDrawn(true);
  }, [isDrawing, disabled, party.signed, getCoordinates]);

  const stopDrawing = useCallback(() => {
    setIsDrawing(false);
  }, []);

  const clearSignature = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  }, []);

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas || !hasDrawn) return;
      // Save current drawing before resize
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [hasDrawn]);

  if (party.signed) {
    return (
      <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
            <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <p className="text-emerald-400 font-semibold">Contract Signed</p>
            <p className="text-sm text-gray-400">
              {party.signedAt && new Date(party.signedAt).toLocaleString()}
            </p>
          </div>
        </div>
        <div className="bg-[#050B18] rounded-lg p-4">
          <p className="text-gray-400 text-sm mb-2">Digital Signature</p>
          <div className="flex items-center gap-2">
            <div className="w-16 h-10 bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 rounded flex items-center justify-center border border-emerald-500/30">
              <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </div>
            <div>
              <p className="text-white font-medium">{party.name}</p>
              <p className="text-xs text-gray-400">{party.company}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0C1628] border border-[#1E293B] rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <svg className="w-5 h-5 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
        Your Signature Required
      </h3>

      <div className="mb-4">
        <p className="text-sm text-gray-400 mb-2">
          Sign below to agree to all contract terms and clauses
        </p>
        <div className="flex items-center gap-2 text-xs text-amber-400 bg-amber-500/10 px-3 py-2 rounded-lg">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          Your signature is legally binding
        </div>
      </div>

      {/* Signature Canvas */}
      <div className="relative mb-4">
        <canvas
          ref={canvasRef}
          className={`w-full h-32 bg-[#050B18] rounded-lg border-2 ${
            hasDrawn ? 'border-[#D4AF37]' : 'border-dashed border-[#1E293B]'
          } cursor-crosshair touch-none`}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
        {!hasDrawn && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <p className="text-gray-500 text-sm">Draw your signature here</p>
              <p className="text-gray-600 text-xs mt-1">Use mouse or touch</p>
            </div>
          </div>
        )}

        {/* Signature Line */}
        <div className="absolute bottom-3 left-4 right-4">
          <div className="border-b border-gray-600/50" />
          <p className="text-gray-500 text-xs mt-1 text-center">{party.name}</p>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={clearSignature}
          className="flex-1 px-4 py-2.5 bg-[#1E293B] text-gray-300 rounded-lg hover:bg-[#2D3748] transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Clear
        </button>
        <button
          onClick={onSign}
          disabled={!hasDrawn}
          className={`flex-1 px-4 py-2.5 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
            hasDrawn
              ? 'bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#050B18] hover:shadow-lg hover:shadow-[#D4AF37]/20'
              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Sign Contract
        </button>
      </div>
    </div>
  );
};
