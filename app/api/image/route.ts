import { Configuration, OpenAIApi } from 'openai';
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
});

const openai = new OpenAIApi(configuration);

export const POST = async (req: Request) => {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { prompt, amount = 1, resolution = "512x512" } = body;

    if (!userId) {
      return new NextResponse('Unauthorized', {status: 401});
    }

    if (!configuration.apiKey) {
      return new NextResponse("OpenAI API Key not configured.", { status: 500 });
    }

    if (!prompt) {
      return new NextResponse("Prompt is required", { status: 400 });
    }

    if (!amount) {
      return new NextResponse("Amount is required", { status: 400 });
    }

    if (!resolution) {
      return new NextResponse("Resolution is required", { status: 400 });
    }

    const response = await openai.createImage({
      prompt,
      n: parseInt(amount, 10),
      size: resolution
    });

    return NextResponse.json(response.data.data);
  } catch (e) {
    console.log('\x1b[33m%s\x1b[0m', 'IMAGE_ERROR', (e as Error).message);
    return new NextResponse('Internal error', { status: 500 });
  }
};
