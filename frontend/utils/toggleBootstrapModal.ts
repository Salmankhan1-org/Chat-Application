// utils/toggleBootstrapModal.ts
'use client';

// @ts-ignore
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min.js';

export function ToggleBootstrapModal(modalId: string, action: 'show' | 'hide') {
    if (typeof window === 'undefined') return;

    const modalElement = document.getElementById(modalId);

    if (!modalElement || !bootstrap?.Modal) {
        
        return;
    }

    let modal = bootstrap.Modal.getOrCreateInstance(modalElement);

    if (!modal) {
        modal = new bootstrap.Modal(modalElement, {
        keyboard: false,
        });
    }

    if (action === 'show') {
        modal.show();
    } else if (action === 'hide') {
        modal.hide();
    }
}