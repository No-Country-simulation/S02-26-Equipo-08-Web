"use client";

interface ConfirmModalProps {
    open: boolean;
    titulo: string;
    mensaje: string;
    onConfirm: () => void;
    onCancel: () => void;
    loading?: boolean;
}

export default function ConfirmModal({
    open,
    titulo,
    mensaje,
    onConfirm,
    onCancel,
    loading = false,
}: ConfirmModalProps) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40"
                onClick={!loading ? onCancel : undefined}
            />
            {/* Tarjeta */}
            <div className="relative z-10 bg-white rounded-2xl shadow-xl p-6 w-full max-w-md mx-4">
                <h2 className="text-lg font-bold text-brand-primary mb-2">{titulo}</h2>
                <p className="text-slate-500 text-sm mb-6">{mensaje}</p>
                <div className="flex justify-end gap-3">
                    <button
                        onClick={onCancel}
                        disabled={loading}
                        className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors disabled:opacity-50 cursor-pointer"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className="px-4 py-2 rounded-lg bg-brand-accent text-white text-sm font-medium hover:bg-brand-accent/90 transition-colors disabled:opacity-50 cursor-pointer flex items-center gap-2"
                    >
                        {loading && (
                            <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                        )}
                        Confirmar
                    </button>
                </div>
            </div>
        </div>
    );
}
