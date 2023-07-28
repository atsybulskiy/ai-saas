'use client';

import * as z from 'zod';
import axios, { isAxiosError } from 'axios';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { VideoIcon } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-hot-toast';

import { Button, Form, FormControl, FormField, FormItem, Input } from '@/components/ui';
import { Heading } from '@/components/Heading';
import { Empty } from '@/components/Empty';
import { Loader } from '@/components/Loader';
import { useProModal } from '@/hooks/use-pro-modal';

import styles from './video.module.scss';

import { formSchema } from './constants';

const VideoPage = () => {
  const router = useRouter();
  const { onOpen } = useProModal();
  const [video, setVideo] = useState<string>();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: ''
    }
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setVideo(undefined);
      const response = await axios.post('/api/video', values);

      setVideo(response.data[0]);
      form.reset();
    } catch (e: unknown) {
      if (isAxiosError(e) && e.response?.status === 403) {
        onOpen();
      } else {
        toast.error('Something went wrong.');
      }
    } finally {
      router.refresh();
    }
  };

  return (
    <div>
      <Heading
        title="Video Generation"
        description="Turn your prompt into video."
        icon={VideoIcon}
        iconColor="text-orange-500"
        bgColor="bg-orange-500/10"
      />
      <div className="px-4 lg:px-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className={styles.form}>
            <FormField
              name="prompt"
              render={({ field }) => (
                <FormItem className="col-span-12 lg:col-span-10">
                  <FormControl className="m-0 p-0">
                    <Input
                      className={styles.input}
                      disabled={isLoading}
                      placeholder="Clown fish swimming in a coral reef"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button className={styles.button} type="submit" disabled={isLoading} size="icon">
              Generate
            </Button>
          </form>
        </Form>
        <div className="space-y-4 mt-4">
          {isLoading && (
            <div className={styles.loader}>
              <Loader />
            </div>
          )}
          {!video && !isLoading && <Empty label="No video generated." />}
          {video && (
            <video controls className={styles.video}>
              <source src={video} />
            </video>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoPage;
