import { X, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePwaInstall } from '@/hooks/use-pwa-install';

export function PwaInstallPrompt() {
  const { showPrompt, promptInstall, dismissPrompt } = usePwaInstall();

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 right-4 left-4 sm:left-auto sm:w-80 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
      <div className="bg-card text-card-foreground border rounded-lg shadow-lg p-4 flex flex-col gap-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 p-2 rounded-md">
              <Download className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">Install SmartBiz</h3>
              <p className="text-xs text-muted-foreground">Quick access on your device</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 -mt-1 -mr-1 text-muted-foreground hover:text-foreground"
            onClick={dismissPrompt}
            aria-label="Dismiss installation prompt"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex gap-2 justify-end">
          <Button variant="ghost" size="sm" onClick={dismissPrompt} className="text-xs">
            Not now
          </Button>
          <Button size="sm" onClick={promptInstall} className="text-xs">
            Install
          </Button>
        </div>
      </div>
    </div>
  );
}
