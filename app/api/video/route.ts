import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import Replicate from 'replicate';

import { checkApiLimit, incrementApiLimit } from '@/lib/api-limit';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!
});

export const POST = async (req: Request) => {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { prompt } = body;

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    if (!prompt) {
      return new NextResponse('Prompt is required', { status: 400 });
    }

    const freeTrial = await checkApiLimit();
    if (!freeTrial) {
      return new NextResponse('Free trial has expired', { status: 403 });
    }

    const response = await replicate.run(
      'anotherjesse/zeroscope-v2-xl:9f747673945c62801b13b84701c783929c0ee784e4748ec062204894dda1a351',
      {
        input: {
          prompt
        }
      }
    );

    await incrementApiLimit();

    return NextResponse.json(response);
  } catch (e) {
    console.log('\x1b[33m%s\x1b[0m', 'VIDEO_ERROR', (e as Error).message);
    return new NextResponse('Internal error', { status: 500 });
  }
};
