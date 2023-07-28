'use client';

import { useState } from 'react';
import { Check, Zap } from 'lucide-react';
import axios from 'axios';

import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Badge, Button, Card } from '@/components/ui';
import { useProModal } from '@/hooks/use-pro-modal';
import { tools } from '@/constants';

export const ProModal = () => {
  const [loading, setLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useProModal();

  const onSubscribe = async () => {
    try {
      setLoading(true);
      const response = axios.get('/api/stripe');

      window.location.href = (await response).data.url;
    } catch (e) {
      console.log(e, 'STRIPE_CLIENT_ERROR');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex justify-center items-center flex-col gap-y-4 pb-2">
            <div className="flex items-center gap-x-2 font-bold py-1">
              Upgrade to Genius!
              <Badge variant="premium" className="uppercase text-sm py-1">
                pro
              </Badge>
            </div>
          </DialogTitle>
          <div className="text-center pt-2 space-y-2 text-zinc-900 font-medium">
            {tools.map((tool) => (
              <Card
                key={tool.label}
                className="p-3 border-black/5 flex items-center justify-between"
              >
                <div className="flex items-center gap-x-4">
                  <div className={cn('p-2 w-fit rounded-md', tool.bgColor)}>
                    <tool.icon className={cn('w-6 h-6', tool.color)} />
                  </div>
                  <div className="font-semibold text-sm">{tool.label}</div>
                </div>
                <Check className="text-primary w-5 h-5" />
              </Card>
            ))}
          </div>
        </DialogHeader>
        <DialogFooter>
          <Button size="lg" variant="premium" className="w-full" onClick={onSubscribe}>
            Upgrade
            <Zap className="w-4 h-4 ml-2 fill-white" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
