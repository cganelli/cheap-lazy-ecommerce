'use client';

import { useEffect, useRef } from 'react';

type ReviewDialogProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  reviewUrl: string;
  amazonUrl?: string;
};

/**
 * ReviewDialog Component
 * 
 * A modal dialog that displays product review videos (Google Drive preview links or direct video URLs).
 * Optimized for 9:16 portrait videos (TikTok/Instagram Reels format).
 * Includes accessibility features like ARIA labels, keyboard navigation (Escape to close), and focus management.
 * 
 * Location: src/components/ReviewDialog.tsx
 * Purpose: Display product review videos in an accessible modal dialog
 */
export default function ReviewDialog({
  open,
  onClose,
  title,
  reviewUrl,
  amazonUrl
}: ReviewDialogProps) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const previouslyFocusedElement = useRef<HTMLElement | null>(null);

  const stopVideo = () => {
    // Stop iframe by removing src (cross-origin restrictions prevent direct control)
    if (iframeRef.current) {
      iframeRef.current.src = '';
    }
    // Stop video element
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  const handleClose = () => {
    stopVideo();
    onClose();
  };

  useEffect(() => {
    const dlg = dialogRef.current;
    if (!dlg) return;

    if (open && !dlg.open) {
      // Store the previously focused element
      previouslyFocusedElement.current = document.activeElement as HTMLElement;
      dlg.showModal();
      // Focus the close button when dialog opens
      setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 0);
    }
    if (!open && dlg.open) {
      stopVideo();
      dlg.close();
      // Restore focus to the previously focused element
      if (previouslyFocusedElement.current) {
        previouslyFocusedElement.current.focus();
        previouslyFocusedElement.current = null;
      }
    }
  }, [open]);

  // Handle backdrop clicks and escape key
  useEffect(() => {
    const dlg = dialogRef.current;
    if (!dlg) return;

    const handleBackdropClick = (e: MouseEvent) => {
      // If clicking the backdrop (not the dialog content), close the modal
      if (e.target === dlg) {
        handleClose();
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && dlg.open) {
        handleClose();
      }
    };

    dlg.addEventListener('click', handleBackdropClick);
    document.addEventListener('keydown', handleEscape);
    return () => {
      dlg.removeEventListener('click', handleBackdropClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  // Remove pop-out functionality from Google Drive URLs
  const getIframeUrl = (url: string) => {
    if (url.includes('/preview')) {
      // Add parameters to minimize controls and prevent pop-out
      const separator = url.includes('?') ? '&' : '?';
      return `${url}${separator}rm=minimal&embedded=true`;
    }
    return url;
  };

  return (
    <dialog
      ref={dialogRef}
      onClose={(e) => {
        e.preventDefault();
        handleClose();
      }}
      aria-labelledby="review-title"
      aria-describedby="review-desc"
      className="rounded-xl p-0 w-[min(400px,95vw)] max-w-[400px] max-h-[95vh] flex flex-col overflow-hidden"
    >
      <div className="flex items-center justify-between px-3 py-2 border-b shrink-0">
        <h2 id="review-title" className="text-sm font-semibold line-clamp-1 pr-2">{title} — My review</h2>
        <button
          ref={closeButtonRef}
          type="button"
          onClick={handleClose}
          className="rounded-md px-2 py-1 text-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-black shrink-0"
          aria-label="Close review modal"
        >
          Close
        </button>
      </div>
      <div id="review-desc" className="px-3 py-2 flex flex-col flex-1 min-h-0 overflow-y-auto">
        <div className="w-full" style={{ maxHeight: 'calc(95vh - 140px)' }}>
          <div className="aspect-[9/16] w-full max-w-full mx-auto">
            {reviewUrl.includes('/preview') ? (
              open ? (
                <iframe
                  ref={iframeRef}
                  src={getIframeUrl(reviewUrl)}
                  title={`Review video for ${title}`}
                  allow="autoplay; encrypted-media"
                  allowFullScreen={false}
                  className="w-full h-full rounded-md"
                  style={{ pointerEvents: 'auto' }}
                />
              ) : null
            ) : (
              <video 
                ref={videoRef}
                src={reviewUrl} 
                controls
                controlsList="nodownload nofullscreen noremoteplayback"
                disablePictureInPicture
                className="w-full h-full rounded-md object-contain"
                aria-label={`Review video for ${title}`}
              />
            )}
          </div>
        </div>
        <div className="mt-2 flex gap-2 shrink-0 pb-1">
          {amazonUrl ? (
            <a
              href={amazonUrl}
              target="_blank"
              rel="sponsored nofollow noopener noreferrer"
              onClick={handleClose}
              className="inline-flex items-center justify-center rounded-md bg-[#C6392D] px-3 py-2 text-sm text-white font-medium flex-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white"
              aria-label={`Buy ${title} on Amazon, opens in a new tab`}
            >
              Buy on Amazon
            </a>
          ) : null}
          <button
            type="button"
            onClick={handleClose}
            className="inline-flex items-center justify-center rounded-md bg-white px-3 py-2 text-sm font-bold ring-4 ring-red-600 text-red-600 flex-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-600"
          >
            Continue browsing
          </button>
        </div>
        <p className="sr-only">
          Video includes voiceover. Turn on captions if available. Press Escape to close the dialog.
        </p>
      </div>
    </dialog>
  );
}

