import { useState } from "react";
import { X } from "lucide-react";

interface VideoModalProps {
  open: boolean;
  onClose: () => void;
}

const VideoModal = ({ open, onClose }: VideoModalProps) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-foreground/70 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-3xl">
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-primary-foreground hover:text-accent transition-colors"
        >
          <X className="w-8 h-8" />
        </button>
        <div className="aspect-video rounded-2xl overflow-hidden bg-foreground shadow-2xl">
          <iframe
            width="100%"
            height="100%"
            src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
            title="How IELTShala Works"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        </div>
      </div>
    </div>
  );
};

export default VideoModal;
